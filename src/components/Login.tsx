import { useState } from 'react';
import { Lock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const correctPassword = 'ישוע המשיח הוא האדון'; // Yeshua HaMashiach Hu HaAdon

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular delay de validação
    setTimeout(() => {
      if (password === correctPassword) {
        toast.success('Acesso concedido!');
        onLogin(true);
      } else {
        toast.error('Senha incorreta. Tente novamente.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Lock className="text-blue-600" size={32} />
          </div>
          <h1 className="text-gray-900 text-center">Sistema de Gerenciamento</h1>
          <p className="text-gray-600 text-center mt-2">
            Leads e Agendamentos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Senha de Acesso
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Digite a senha"
              required
              disabled={isLoading}
              dir="rtl"
            />
            <p className="text-gray-500 mt-2 text-center">
              ישוע המשיח הוא האדון
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Validando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500">
          <p>Sistema protegido</p>
        </div>
      </div>
    </div>
  );
}
