import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppRoutes = () => {
  const { student, loading } = useAuth();
  const [showRegister, setShowRegister] = React.useState(false);

  if (loading) {
    return (
      <div className="auth-wrapper">
        <div className="loader"><div className="spinner"></div></div>
      </div>
    );
  }

  if (student) return <Dashboard />;

  return showRegister
    ? <Register onSwitchToLogin={() => setShowRegister(false)} />
    : <Login onSwitchToRegister={() => setShowRegister(true)} />;
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="dark"
        toastStyle={{ background: '#1a1a2e', border: '1px solid rgba(108,99,255,0.3)', color: '#fffffe' }}
      />
    </AuthProvider>
  );
}

export default App;
