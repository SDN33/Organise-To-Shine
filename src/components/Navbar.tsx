import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Layout, LogOut, Shield } from 'lucide-react';

const ADMIN_EMAIL = 's.deinegri2@gmail.com';

export default function Navbar() {
  const { user, signOut } = useAuth();

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900"
            >
              <Home className="h-6 w-6" />
              <span className="ml-2 font-medium">Organise To Shine</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Mon Espace
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnection
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  Se Connecter
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  S&pos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
