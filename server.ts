import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { supabase } from './src/supabase';
import Database from 'better-sqlite3';

const app = express();
const httpServer = createServer(app);
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';

// Initialize SQLite for Peer IDs
const db = new Database('peer_ids.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS peer_mappings (
    id INTEGER,
    type TEXT,
    peer_id TEXT,
    PRIMARY KEY (id, type)
  )
`);

const getPeerId = (id: number, type: 'user' | 'patient'): string => {
  const row = db.prepare('SELECT peer_id FROM peer_mappings WHERE id = ? AND type = ?').get(id, type) as { peer_id: string } | undefined;
  if (row) return row.peer_id;

  // Generate new ID if not exists
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let peerId = '';
  for (let i = 0; i < 6; i++) {
    peerId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  db.prepare('INSERT INTO peer_mappings (id, type, peer_id) VALUES (?, ?, ?)').run(id, type, peerId);
  return peerId;
};

app.use(express.json());
app.use(cookieParser());

// --- API Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, cpf } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert User
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role }])
      .select()
      .single();

    if (userError) {
      if (userError.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'Email already exists' });
      }
      throw userError;
    }
    
    const peerId = getPeerId(user.id, 'user');
    
    // If patient, also create patient record
    if (role === 'patient') {
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert([{ name, cpf, email }])
        .select()
        .single();
      
      if (patientError) {
        console.error('Error creating patient record:', patientError);
        // Ideally rollback user creation here, but for now just log
      } else {
        // Ensure patient also has a peer_id (same as user or different? Usually same person, but different table ID)
        // Let's give the patient record its own peer_id mapping, or reuse?
        // The requirement says "cada médico e paciente vai ter um id".
        // A user with role 'patient' IS a patient.
        // But the system has separate 'users' and 'patients' tables.
        // The 'patients' table is used for medical records.
        // The 'users' table is used for login.
        // When a doctor views a patient, they view the 'patients' record.
        // So the 'patients' record needs a peer_id.
        getPeerId(patient.id, 'patient');
      }
    }

    res.status(201).json({ id: user.id, message: 'User created', peer_id: peerId });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    // Set cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
    const peerId = getPeerId(user.id, 'user');

    res.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email,
      role: user.role, 
      peer_id: peerId,
      totp_enabled: !!user.totp_enabled 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Setup 2FA
app.post('/api/auth/2fa/setup', (req, res) => {
  const secret = speakeasy.generateSecret({ name: 'TeleMedPro' });
  res.json({
    secret: secret.base32,
    otpauth_url: secret.otpauth_url
  });
});

// Verify 2FA
app.post('/api/auth/2fa/verify', (req, res) => {
  const { token, secret } = req.body;
  
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token
  });
  
  if (verified) {
    res.json({ verified: true });
  } else {
    res.status(400).json({ verified: false });
  }
});

// Get Patients (Doctor only)
app.get('/api/patients', async (req, res) => {
  try {
    const { data: patients, error } = await supabase.from('patients').select('*');
    if (error) throw error;
    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create Patient
app.post('/api/patients', async (req, res) => {
  const { name, cpf, email, phone, dob } = req.body;
  try {
    const { data, error } = await supabase
      .from('patients')
      .insert([{ name, cpf, email, phone, dob }])
      .select()
      .single();
      
    if (error) throw error;
    
    const peerId = getPeerId(data.id, 'patient');
    
    res.status(201).json({ id: data.id, peer_id: peerId });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get Appointments (Doctor view - can filter by doctor)
app.get('/api/appointments', async (req, res) => {
  const doctorId = req.query.doctor_id;
  try {
    // Join with patients table
    let query = supabase
      .from('appointments')
      .select('*, patients(name)');
      
    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }
      
    const { data, error } = await query;
      
    if (error) throw error;

    // Map to flatten structure for frontend
    const appointments = data.map((apt: any) => ({
      ...apt,
      patient_name: apt.patients?.name || 'Unknown',
      patient_peer_id: apt.patient_id ? getPeerId(apt.patient_id, 'patient') : undefined
    }));

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get Doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const { data: doctors, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('role', 'doctor');
      
    if (error) throw error;
    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get Single Patient
app.get('/api/patients/:id', async (req, res) => {
  try {
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', req.params.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Patient not found' });
      throw error;
    }
    
    const peerId = getPeerId(patient.id, 'patient');
    
    res.json({ ...patient, peer_id: peerId });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get Patient by Email
app.get('/api/patients/by-email/:email', async (req, res) => {
  try {
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('email', req.params.email)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Patient not found' });
      throw error;
    }
    
    const peerId = getPeerId(patient.id, 'patient');
    
    res.json({ ...patient, peer_id: peerId });
  } catch (error) {
    console.error('Get patient by email error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get Patient Records
app.get('/api/patients/:id/records', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('records')
      .select('*, users(name)')
      .eq('patient_id', req.params.id)
      .order('date', { ascending: false });
      
    if (error) throw error;

    const records = data.map((rec: any) => ({
      ...rec,
      doctor_name: rec.users?.name || 'Unknown'
    }));

    res.json(records);
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create Record
app.post('/api/records', async (req, res) => {
  const { patient_id, doctor_id, date, content, type, attachment } = req.body;
  try {
    const { data, error } = await supabase
      .from('records')
      .insert([{ patient_id, doctor_id, date, content, type, attachment }])
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json({ id: data.id });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get Patient Appointments (Patient view)
app.get('/api/patients/:id/appointments', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, users(name)')
      .eq('patient_id', req.params.id)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
      
    if (error) throw error;

    const appointments = data.map((apt: any) => ({
      ...apt,
      doctor_name: apt.users?.name || 'Unknown',
      doctor_peer_id: apt.doctor_id ? getPeerId(apt.doctor_id, 'user') : undefined
    }));

    res.json(appointments);
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create Appointment
app.post('/api/appointments', async (req, res) => {
  const { doctor_id, patient_id, date, time } = req.body;
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ doctor_id, patient_id, date, time }])
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json({ id: data.id });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});


// --- Vite Middleware ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
