import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Terminal, Menu, X, LogOut, ShieldCheck, Lock } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, logout } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <Terminal className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  Kaze<span className="text-primary-600">Dev</span>
                </span>
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary-600'
                      : 'text-slate-600 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin ? (
                <div className="flex items-center gap-4 border-l pl-4 ml-4">
                  <Link to="/admin" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                    <ShieldCheck size={16} /> Panel
                  </Link>
                  <button onClick={logout} className="text-slate-500 hover:text-red-600" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-slate-400 hover:text-primary-600 transition-colors ml-4" title="Admin Login">
                  <Lock size={18} />
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                     location.pathname === link.path
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-amber-600 bg-amber-50"
                >
                  Admin Panel
                </Link>
              ) : (
                 <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-500 hover:bg-slate-50"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-lg text-slate-900">Kaze For Developers</span>
              <p className="text-slate-500 text-sm mt-1">Building the next generation of engineers.</p>
            </div>
            <div className="flex space-x-6 items-center">
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">GitHub</a>
              {/* Admin Link in Footer */}
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-slate-500 transition-colors">
                 Admin
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Kaze Developers. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};