import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { authClient } from './lib/auth-client';
import './App.css';

/**
 * Main App Component
 * 
 * Root component with routing and authentication state management.
 * Manages user authentication across the application using Better Auth.
 */
function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount using Better Auth
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          setAuth(true);
          setUser(session.data.user);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (userData) => {
    setAuth(true);
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setAuth(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setAuth(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show nothing while checking auth
  if (loading) {
    return null;
  }

  return (
    <Router>
      <Routes>
        {/* Protected route - redirect to login if not authenticated */}
        <Route 
          path="/" 
          element={auth ? <Home auth={auth} user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        
        {/* Redirect to home if already authenticated */}
        <Route 
          path="/login" 
          element={!auth ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/signup" 
          element={!auth ? <Signup onSignup={handleSignup} /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
