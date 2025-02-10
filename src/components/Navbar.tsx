import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  LogOut,
  Shield,
  Menu,
  X
} from 'lucide-react';

const ADMIN_EMAIL = 's.deinegri2@gmail.com';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-20 bg-indigo-600 mb-10" />

      <nav className="relative z-10 max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="https://res.cloudinary.com/daroyxenr/image/upload/v1739149742/07a8a9c192544fe28acd5ee09fc6c6ca-free_rwcrr6.png"
              alt="DataBuzz Logo"
              className="h-20 -mt-4 w-auto"
            />
            <span className='text-white px-5 -mt-4 font-semibold hidden md:block'>
              L'info digitale qui fait vibrer votre quotidien !
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6 -mt-4">
            {user ? (
              <>
                <NavLink to="/dashboard" icon={<LayoutDashboard />} text="Dashboard" />
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    icon={<Shield className="h-5 w-5" />}
                    text="Admin"
                    className="text-yellow-300 hover:text-yellow-100"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center text-white hover:text-gray-200 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2 text-sm">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-200 transition-colors">
                  Se Connecter
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-md bg-white text-indigo-600 hover:bg-gray-100 transition-colors">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-indigo-600 rounded-lg p-4">
            {user ? (
              <div className="flex flex-col space-y-4">
                <NavLink to="/dashboard" icon={<LayoutDashboard />} text="Dashboard" />
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    icon={<Shield className="h-5 w-5" />}
                    text="Admin"
                    className="text-yellow-300 hover:text-yellow-100"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center text-white hover:text-gray-200 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2">Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link to="/login" className="text-white hover:text-gray-200 transition-colors">
                  Se Connecter
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-md bg-white text-indigo-600 hover:bg-gray-100 transition-colors text-center">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  className?: string;
}

function NavLink({ to, icon, text, className = "text-white hover:text-gray-200" }: NavLinkProps) {
  return (
    <Link to={to} className={`flex items-center ${className} transition-colors`}>
      {icon}
      <span className="ml-2">{text}</span>
    </Link>
  );
}
