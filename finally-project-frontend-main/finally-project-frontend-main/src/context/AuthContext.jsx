import React, { createContext, useContext, useState, useEffect } from 'react';

// Créer le contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
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
    'admin@example.com': { 
      password: 'password', 
      role: 'admin', 
      id: 'admin-123',
      email: 'admin@example.com'
    },
    'user@example.com': { 
      password: 'password', 
      role: 'user', 
      id: 'user-456',
      email: 'user@example.com'
    },
  };

  useEffect(() => {
    // Simuler la vérification de l'état d'authentification au chargement
    const checkAuthStatus = () => {
      try {
        // Récupérer l'utilisateur depuis le stockage local
        const storedUser = localStorage.getItem('currentUser');
        const storedRole = localStorage.getItem('userRole');
        const storedUserId = localStorage.getItem('userId');

        if (storedUser && storedRole && storedUserId) {
          const parsedUser = JSON.parse(storedUser);
          
          // Vérifier si l'utilisateur existe toujours dans nos données simulées
          if (simulatedUsers[parsedUser.email]) {
            setCurrentUser(parsedUser);
            setUserRole(storedRole);
            setUserId(storedUserId);
          } else {
            // Si l'utilisateur n'existe plus, nettoyer le stockage
            clearAuthStorage();
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        clearAuthStorage();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Fonction pour nettoyer le stockage d'authentification
  const clearAuthStorage = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setCurrentUser(null);
    setUserRole('guest');
    setUserId(null);
  };

  // Validation des entrées
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password && password.length >= 6;
  };

  // Fonction d'inscription simulée
  const register = async (email, password, role = 'user') => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validation des entrées
        if (!validateEmail(email)) {
          reject({ code: 'auth/invalid-email', message: 'Format d\'e-mail invalide.' });
          return;
        }

        if (!validatePassword(password)) {
          reject({ code: 'auth/weak-password', message: 'Le mot de passe doit contenir au moins 6 caractères.' });
          return;
        }

        if (simulatedUsers[email]) {
          reject({ code: 'auth/email-already-in-use', message: 'Cet e-mail est déjà utilisé.' });
        } else {
          const newUserId = `user-${Date.now()}`;
          const newUser = { 
            email, 
            password, 
            role, 
            id: newUserId 
          };
          
          // Ajouter l'utilisateur à la liste simulée
          simulatedUsers[email] = newUser;
          
          // Sauvegarder dans le localStorage
          const userData = { email, uid: newUserId };
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('userRole', role);
          localStorage.setItem('userId', newUserId);
          
          // Mettre à jour l'état
          setCurrentUser(userData);
          setUserRole(role);
          setUserId(newUserId);
          
          resolve({ user: userData });
        }
      }, 500);
    });
  };

  // Fonction de connexion simulée
  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validation des entrées
        if (!validateEmail(email)) {
          reject({ code: 'auth/invalid-email', message: 'Format d\'e-mail invalide.' });
          return;
        }

        if (!validatePassword(password)) {
          reject({ code: 'auth/invalid-credential', message: 'Le mot de passe doit contenir au moins 6 caractères.' });
          return;
        }

        const user = simulatedUsers[email];
        if (user && user.password === password) {
          const userData = { email, uid: user.id };
          
          // Sauvegarder dans le localStorage
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('userId', user.id);
          
          // Mettre à jour l'état
          setCurrentUser(userData);
          setUserRole(user.role);
          setUserId(user.id);
          
          resolve({ user: userData });
        } else {
          reject({ 
            code: 'auth/invalid-credential', 
            message: 'E-mail ou mot de passe invalide.' 
          });
        }
      }, 500);
    });
  };

  // Fonction de déconnexion simulée
  const logout = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        clearAuthStorage();
        resolve();
      }, 300);
    });
  };

  // Fonction pour vérifier si l'utilisateur est authentifié
  const isAuthenticated = () => {
    return currentUser !== null && userId !== null;
  };

  // Fonction pour vérifier les rôles
  const hasRole = (requiredRole) => {
    return userRole === requiredRole;
  };

  const value = {
    currentUser,
    userRole,
    userId,
    loading,
    register,
    login,
    logout,
    isAuthenticated,
    hasRole
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