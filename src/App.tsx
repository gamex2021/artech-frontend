import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, NavLink, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProjectList from './components/ProjectList';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import { motion } from 'framer-motion';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-lg font-semibold text-gray-800">Portfolio</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                Projects
              </NavLink>
              {isAuthenticated && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  Admin
                </NavLink>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </motion.button>
            ) : (
              <NavLink
                to="/auth"
                className={({ isActive }) =>
                  `inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${isActive
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                    : 'text-indigo-600 bg-white hover:bg-indigo-50'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
                }
              >
                {({ isActive }) => (
                  <motion.span
                    initial={false}
                    animate={{ scale: isActive ? 1.05 : 1 }}
                  >
                    Login
                  </motion.span>
                )}
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProjectList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

const AppWithAuth: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;