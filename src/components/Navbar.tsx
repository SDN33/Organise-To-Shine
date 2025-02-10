import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  LogOut,
  Shield
} from 'lucide-react';

const ADMIN_EMAIL = 's.deinegri2@gmail.com';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className="relative">
      {/* Purple curved background */}
      <div className="absolute inset-x-0 top-0 h-20 bg-indigo-600 mb-10" />

      {/* Navbar content */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img
              src="https://res.cloudinary.com/daroyxenr/image/upload/v1739149891/07a8a9c192544fe28acd5ee09fc6c6ca-free-removebg-preview_ulqtxh.png"
              alt="DataBuzz Logo"
              className="h-20 -mt-4 w-auto"
              />
            </Link>

          <div className="flex items-center space-x-6 -mt-4">
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
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  Se Connecter
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md bg-white text-indigo-600 hover:bg-gray-100 transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

// Helper component for nav links
interface NavLinkProps {
  to: string;
  icon: React.ReactElement;
  text: string;
  className?: string;
}

const NavLink = ({ to, icon, text, className = "text-white hover:text-gray-200" }: NavLinkProps) => (
  <Link to={to} className={`flex flex-col items-center ${className} transition-colors`}>
    {React.cloneElement(icon, { className: "h-5 w-5" })}
    <span className="mt-1 text-xs">{text}</span>
  </Link>
);
