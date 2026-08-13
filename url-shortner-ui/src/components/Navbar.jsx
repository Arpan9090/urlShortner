import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-xl sm:text-2xl font-extrabold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent shrink-0"
          >
            🔗 CutIt
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6 font-medium">
            <Link to="/" className="hover:text-indigo-400 transition">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-indigo-400 transition">Dashboard</Link>
                <span className="text-indigo-400 font-semibold bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/50 whitespace-nowrap">
                  👋 {username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-400 transition">Login</Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md shadow-indigo-600/30"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col space-y-1 font-medium border-t border-slate-800 pt-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="px-2 py-2 rounded-lg hover:bg-slate-800 hover:text-indigo-400 transition"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded-lg hover:bg-slate-800 hover:text-indigo-400 transition"
                >
                  Dashboard
                </Link>
                <span className="mx-2 my-1 text-indigo-400 font-semibold bg-indigo-950/60 px-3 py-1.5 rounded-full border border-indigo-800/50 w-fit">
                  👋 {username}
                </span>
                <button
                  onClick={handleLogout}
                  className="mx-2 mt-1 bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition font-medium text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded-lg hover:bg-slate-800 hover:text-indigo-400 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="mx-2 mt-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md shadow-indigo-600/30 text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;