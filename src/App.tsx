import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TwoFactor from './pages/auth/TwoFactor';
import DoctorLayout from './layouts/DoctorLayout';
import DoctorDashboard from './pages/doctor/Dashboard';
import Patients from './pages/doctor/Patients';
import PatientProfile from './pages/doctor/PatientProfile';
import Appointments from './pages/doctor/Appointments';
import PatientLayout from './layouts/PatientLayout';
import PatientDashboard from './pages/patient/Dashboard';
import PatientAppointments from './pages/patient/Appointments';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/2fa" element={<TwoFactor />} />
        
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<DoctorDashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>

        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="appointments" element={<PatientAppointments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
