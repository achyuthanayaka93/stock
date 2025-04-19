import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import AdminView from './views/AdminView';
import UserView from './views/UserView';
import LoginView from './views/LoginView';

function App() {
  const { auth } = useStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route
              path="/admin/*"
              element={
                auth.isAuthenticated && auth.userType === 'admin' ? (
                  <AdminView />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/user"
              element={
                auth.isAuthenticated && auth.userType === 'user' ? (
                  <UserView />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;