import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import MaterialManagement from './pages/MaterialManagement';
import CategoryManagement from './pages/CategoryManagement';
import RoleManagement from './pages/RoleManagement';
import Button from './components/common/Button';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

// Composant de chargement
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <div className="text-lg font-semibold text-gray-700">Chargement...</div>
    </div>
  </div>
);

// Composant de route protégée
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    // Rediriger vers la page de connexion avec retour à la page demandée
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si des rôles spécifiques sont requis, vérifier les permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Accès refusé</h2>
          <p className="text-gray-700 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            <br />
            <span className="text-sm text-gray-500">
              Rôle requis: {allowedRoles.join(', ')}
            </span>
          </p>
          <Button 
            onClick={() => window.history.back()} 
            variant="primary"
            className="w-full"
          >
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return children;
};

// Composant pour les pages publiques (redirige si déjà connecté)
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (currentUser) {
    // Rediriger vers la page d'origine ou le dashboard
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

// Composant 404
const NotFound = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">404 - Page non trouvée</h2>
        <p className="text-gray-600 mb-6">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button 
          onClick={() => window.location.href = currentUser ? '/' : '/login'} 
          variant="primary"
          className="w-full"
        >
          {currentUser ? 'Retour au Tableau de bord' : 'Aller à la connexion'}
        </Button>
      </div>
    </div>
  );
};

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, loading } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Afficher la barre latérale uniquement si l'utilisateur est connecté */}
      {currentUser && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
        />
      )}

      {/* Zone de contenu principale */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        currentUser ? 'lg:ml-64' : ''
      }`}>
        {/* Barre de navigation - affichée seulement si connecté */}
        {currentUser && (
          <Navbar onMenuClick={toggleSidebar} />
        )}

        {/* Contenu de la page */}
        <main className={`flex-1 overflow-y-auto ${
          currentUser ? 'p-4' : ''
        }`}>
          <Routes>
            {/* Routes publiques */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />

            {/* Routes protégées */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute allowedRoles={['user', 'admin', 'manager', 'support']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/materials" 
              element={
                <ProtectedRoute allowedRoles={['user', 'admin', 'manager', 'support']}>
                  <MaterialManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute allowedRoles={['user', 'admin', 'manager', 'support']}>
                  <CategoryManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/roles" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <RoleManagement />
                </ProtectedRoute>
              } 
            />

            {/* Redirection par défaut */}
            <Route 
              path="/" 
              element={<Navigate to={currentUser ? "/" : "/login"} replace />} 
            />

            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;