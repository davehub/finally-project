import React, { createContext, useContext, useState, useEffect } from 'react';

// Créer le contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Fournisseur de contexte d'authentification.
 * Gère l'état d'authentification simulée et les données de rôle de l'utilisateur.
 * @param {object} props - Propriétés du composant.
 * @param {React.ReactNode} props.children - Les enfants à rendre dans le fournisseur de contexte.
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('guest'); // Rôle par défaut
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Données utilisateur simulées (pour la démonstration sans backend)
  const simulatedUsers = {
    'admin@example.com': { password: 'password', role: 'admin', id: 'admin-123' },
    'user@example.com': { password: 'password', role: 'user', id: 'user-456' },
  };

  useEffect(() => {
    // Simuler la vérification de l'état d'authentification au chargement
    const checkAuthStatus = () => {
      // Récupérer l'utilisateur depuis le stockage local (simulé)
      const storedUser = localStorage.getItem('currentUser');
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');

      if (storedUser && storedRole && storedUserId) {
        setCurrentUser(JSON.parse(storedUser));
        setUserRole(storedRole);
        setUserId(storedUserId);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Fonction d'inscription simulée
  const register = async (email, password, role = 'user') => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simuler un délai réseau
        if (simulatedUsers[email]) {
          reject({ code: 'auth/email-already-in-use', message: 'Cet e-mail est déjà utilisé.' });
        } else {
          const newUserId = `simulated-user-${Date.now()}`;
          const newUser = { email, password, role, id: newUserId };
          simulatedUsers[email] = newUser; // Ajouter l'utilisateur à la liste simulée
          
          // Simuler la connexion après l'inscription
          localStorage.setItem('currentUser', JSON.stringify({ email, uid: newUserId }));
          localStorage.setItem('userRole', role);
          localStorage.setItem('userId', newUserId);
          setCurrentUser({ email, uid: newUserId });
          setUserRole(role);
          setUserId(newUserId);
          resolve({ user: { email, uid: newUserId } });
        }
      }, 500); // Délai de 500ms
    });
  };

  // Fonction de connexion simulée
  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simuler un délai réseau
        const user = simulatedUsers[email];
        if (user && user.password === password) {
          localStorage.setItem('currentUser', JSON.stringify({ email, uid: user.id }));
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('userId', user.id);
          setCurrentUser({ email, uid: user.id });
          setUserRole(user.role);
          setUserId(user.id);
          resolve({ user: { email, uid: user.id } });
        } else {
          reject({ code: 'auth/invalid-credential', message: 'E-mail ou mot de passe invalide.' });
        }
      }, 500); // Délai de 500ms
    });
  };

  // Fonction de déconnexion simulée
  const logout = async () => {
    return new Promise((resolve) => {
      setTimeout(() => { // Simuler un délai réseau
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        setCurrentUser(null);
        setUserRole('guest');
        setUserId(null);
        resolve();
      }, 300); // Délai de 300ms
    });
  };

  const value = {
    currentUser,
    userRole,
    userId,
    loading,
    register,
    login,
    logout,
    
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-lg font-semibold text-gray-700">Chargement de l'authentification...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
