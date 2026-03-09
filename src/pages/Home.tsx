import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Brain, Users, Video, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-orange-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-cyan-500" />
              <span className="text-xl font-bold text-slate-900">NeuroMães</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#sobre" className="text-slate-600 hover:text-cyan-500 font-medium transition-colors">Sobre</a>
              <a href="#autores" className="text-slate-600 hover:text-cyan-500 font-medium transition-colors">Autores</a>
            </div>
            <div>
              <Link to="/login" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 transition-colors">
                <Video className="w-4 h-4 mr-2" />
                Telemedicina
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-orange-50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Acolhimento, informação e cuidado para <span className="text-cyan-500">mães atípicas</span>.
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Um espaço seguro e riquíssimo em informações sobre neurodivergência. Entenda o universo do seu filho, encontre apoio e conecte-se com especialistas através da nossa plataforma de telemedicina.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#sobre" className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-cyan-500 hover:bg-cyan-600 transition-colors">
                Explorar Conteúdo
              </a>
              <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 border-2 border-cyan-200 rounded-full text-base font-medium text-cyan-600 bg-white hover:bg-cyan-50 transition-colors">
                Acessar Telemedicina <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-10 hidden lg:block">
          <svg width="600" height="600" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#06B6D4" d="M45.7,-76.1C58.9,-69.3,69.2,-55.4,77.2,-40.8C85.2,-26.2,90.9,-10.9,89.5,4.1C88.1,19.1,79.5,33.8,69.2,46.1C58.9,58.4,46.9,68.3,32.8,74.9C18.7,81.5,2.5,84.8,-12.8,82.5C-28.1,80.2,-42.5,72.3,-54.6,61.3C-66.7,50.3,-76.5,36.2,-81.7,20.6C-86.9,5,-87.5,-12.1,-81.6,-27.1C-75.7,-42.1,-63.3,-55,-50.1,-61.8C-36.9,-68.6,-22.9,-69.3,-7.8,-59.8C7.3,-50.3,22.4,-30.6,32.5,-82.9Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* Info Section */}
      <section id="sobre" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Entendendo a Neurodivergência</h2>
            <p className="text-lg text-slate-600">
              A neurodivergência não é uma doença, mas sim uma variação natural do cérebro humano. Autismo, TDAH, Dislexia e outras condições fazem parte da diversidade neurológica.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Autismo (TEA)</h3>
              <p className="text-slate-600 leading-relaxed">
                O Transtorno do Espectro Autista envolve diferenças na comunicação social e comportamentos. Cada criança no espectro é única, com suas próprias forças e desafios.
              </p>
            </div>
            <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">TDAH</h3>
              <p className="text-slate-600 leading-relaxed">
                O Transtorno de Déficit de Atenção e Hiperatividade caracteriza-se por padrões de desatenção, hiperatividade e impulsividade. Mentes com TDAH são frequentemente muito criativas.
              </p>
            </div>
            <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Dislexia e outros</h3>
              <p className="text-slate-600 leading-relaxed">
                Condições que afetam a aprendizagem, leitura ou coordenação. Com o apoio e as ferramentas certas, crianças neurodivergentes podem alcançar todo o seu potencial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Telemedicine CTA */}
      <section className="py-20 bg-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Precisa de orientação profissional?</h2>
              <p className="text-cyan-50 text-lg mb-8 leading-relaxed">
                Sabemos que a jornada pode ser desafiadora. Por isso, integramos um aplicativo de telemedicina exclusivo onde você pode agendar consultas com neuropediatras, psicólogos e terapeutas especializados em neurodivergência, sem sair de casa.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span>Profissionais acolhedores e especializados</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <span>Consultas online seguras e práticas</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span>Acompanhamento contínuo para o seu filho</span>
                </li>
              </ul>
              <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 transition-colors">
                Acessar o Aplicativo <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-cyan-600 relative shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Mãe e filho sorrindo em consulta online" 
                  className="object-cover w-full h-full opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center">
                        <Video className="w-6 h-6 text-slate-900" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">TeleMed Pro</h4>
                        <p className="text-cyan-100 text-sm">Plataforma Integrada</p>
                      </div>
                    </div>
                    <p className="text-cyan-50 text-sm">Conectando famílias a especialistas com amor e praticidade.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Autores Section */}
      <section id="autores" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-50 rounded-3xl p-8 md:p-12 border border-orange-100 shadow-sm text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Autores do Projeto</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left space-y-4">
                <div className="inline-block px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full font-semibold text-sm mb-2">
                  Projeto Inovador
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Administração</h3>
                <p className="text-xl text-slate-600 font-medium">2º Módulo</p>
                <p className="text-lg text-slate-500 font-bold">ETEC</p>
              </div>
              <div className="text-left bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-amber-500" />
                  <h4 className="text-lg font-bold text-slate-800">Integrantes</h4>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Marisa, Geovane, Rebeca,<br />
                  Gabrieli, Ieda e Camila
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-50 py-12 border-t border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-500" />
            <span className="text-lg font-bold text-slate-900">NeuroMães</span>
          </div>
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} NeuroMães. Todos os direitos reservados. Feito com amor para mães atípicas.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-medium text-sm">
              Acesso Profissionais
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
