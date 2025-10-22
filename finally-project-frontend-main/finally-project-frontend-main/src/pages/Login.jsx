import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation côté client
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format d'e-mail invalide.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate("/"); // Rediriger vers le tableau de bord après la connexion
    } catch (err) {
      console.error("Erreur de connexion:", err.code, err.message);
      
      // Gestion des erreurs basée sur les codes d'erreur du contexte
      switch (err.code) {
        case "auth/invalid-credential":
          setError("E-mail ou mot de passe invalide.");
          break;
        case "auth/invalid-email":
          setError("Format d'e-mail invalide.");
          break;
        case "auth/user-not-found":
          setError("Aucun compte trouvé avec cet e-mail.");
          break;
        case "auth/too-many-requests":
          setError("Trop de tentatives de connexion. Veuillez réessayer plus tard.");
          break;
        default:
          setError(err.message || "Échec de la connexion. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Données de démonstration pour faciliter les tests
  const fillDemoCredentials = (role = 'user') => {
    if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('password');
    } else {
      setEmail('user@example.com');
      setPassword('password');
    }
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-100 p-6">
      <Card title="Connexion" className="w-full max-w-md shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 animate-pulse">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <InputField
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre.email@example.com"
            required
            className="shadow-sm"
            autoComplete="email"
          />
          
          <InputField
            id="password"
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            className="shadow-sm"
            autoComplete="current-password"
          />
          
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-4"
            variant="primary"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>

        {/* Boutons de démonstration pour faciliter les tests */}
        <div className="mt-4 space-y-2">
          <p className="text-center text-sm text-gray-600 mb-2">
            Comptes de démonstration :
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => fillDemoCredentials('user')}
              className="flex-1 text-xs"
              variant="outline"
              disabled={loading}
            >
              Remplir User
            </Button>
            <Button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="flex-1 text-xs"
              variant="outline"
              disabled={loading}
            >
              Remplir Admin
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Vous n'avez pas de compte ?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Inscrivez-vous ici
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;