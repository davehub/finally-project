import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import MaterialManagement from './pages/MaterialManagement';
import CategoryManagement from './pages/CategoryManagement';
import RoleManagement from './pages/RoleManagement';
import Button from './components/common/Button'; // Composant de bouton réutilisable
import Login from './pages/Login'; // Nouvelle page de connexion
import Register from './pages/Register'; // Nouvelle page d'inscription
import { AuthProvider, useAuth } from './context/AuthContext'; // Contexte d'authentification

// Composant de route protégée
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    // Afficher un indicateur de chargement pendant la vérification de l'authentification
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-700">Chargement...</div>
      </div>
    );
  }

  if (!currentUser) {
    // Rediriger vers la page de connexion si non authentifié
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Rediriger vers le tableau de bord ou une page d'accès refusé si le rôle n'est pas autorisé
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Accès refusé</h2>
        <p className="text-gray-700">Vous n'avez pas les permissions pour accéder à cette page.</p>
        <Button onClick={() => window.location.href = '/'}>Retour au Tableau de bord</Button>
      </div>
    );
  }

  return children;
};

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, loading } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-700">Chargement de l'application...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Afficher la barre latérale uniquement si l'utilisateur est connecté */}
      {currentUser && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}

      {/* Zone de contenu principale */}
      <div className={`flex-1 flex flex-col ${currentUser ? 'lg:ml-64' : ''}`}> {/* Ajuster ml-64 pour correspondre à la largeur de la barre latérale */}
        {/* Barre de navigation */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            {/* <Route path="/login" element={<Login />} /> */}
            
            <Route path="/register" element={<Register />} />

            {/* Routes protégées */}
            <Route path="/" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Dashboard /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="/materials" element={<ProtectedRoute allowedRoles={['user', 'admin']}><MaterialManagement /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute allowedRoles={['user', 'admin']}><CategoryManagement /></ProtectedRoute>} />
            <Route path="/roles" element={<ProtectedRoute allowedRoles={['admin']}><RoleManagement /></ProtectedRoute>} />

            {/* Route de secours pour les chemins non trouvés */}
            <Route path="*" element={
              <div className="p-6 text-center text-gray-600">
                <h2 className="text-2xl font-bold mb-4">404 - Page non trouvée</h2>
                <p>La page que vous recherchez n'existe pas.</p>
                <Button onClick={() => window.location.href = currentUser ? '/' : '/register'} className="mt-4">
                  {currentUser ? 'Retour au Tableau de bord' : 'Retour à la connexion'}
                </Button>
              </div>
            } />
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