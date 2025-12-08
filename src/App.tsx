import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Kanban } from './components/Kanban';
import { Agendamentos } from './components/Agendamentos';
import { Portfolio } from './components/Portfolio';
import { LayoutDashboard, Columns, Calendar, Briefcase } from 'lucide-react';
import { Toaster } from 'sonner@2.0.3';

type Page = 'dashboard' | 'kanban' | 'agendamentos' | 'portfolio';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  useEffect(() => {
    // Verificar se já está autenticado no localStorage
    const auth = localStorage.getItem('auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
    if (success) {
      localStorage.setItem('auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
    setCurrentPage('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Sistema de Gerenciamento</h1>
              <p className="text-gray-600">Leads e Agendamentos</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="px-6 pb-2 flex gap-1">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
              currentPage === 'dashboard'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          
          <button
            onClick={() => setCurrentPage('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
              currentPage === 'kanban'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Columns size={20} />
            Kanban
          </button>
          
          <button
            onClick={() => setCurrentPage('agendamentos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
              currentPage === 'agendamentos'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar size={20} />
            Agendamentos
          </button>
          
          <button
            onClick={() => setCurrentPage('portfolio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
              currentPage === 'portfolio'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Briefcase size={20} />
            Portfólio
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'kanban' && <Kanban />}
        {currentPage === 'agendamentos' && <Agendamentos />}
        {currentPage === 'portfolio' && <Portfolio />}
      </main>
    </div>
  );
}
