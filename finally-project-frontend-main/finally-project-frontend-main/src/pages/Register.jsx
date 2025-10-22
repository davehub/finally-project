import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import SelectField from "../components/common/SelectField";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const availableRoles = [
    { value: "user", label: "Utilisateur standard" },
    { value: "admin", label: "Administrateur" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation côté client
    if (!email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, role);
      // Redirection vers la page de connexion après inscription réussie
      navigate("/login", { 
        state: { 
          message: "Inscription réussie ! Veuillez vous connecter.",
          email: email 
        }
      });
    } catch (err) {
      console.error("Erreur d'inscription:", err.code, err.message);
      
      // Gestion des erreurs basée sur les codes d'erreur du contexte
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Cet e-mail est déjà utilisé.");
          break;
        case "auth/invalid-email":
          setError("Format d'e-mail invalide.");
          break;
        case "auth/weak-password":
          setError("Le mot de passe doit contenir au moins 6 caractères.");
          break;
        default:
          setError(err.message || "Échec de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour pré-remplir avec des données de test
  const fillDemoData = (userType = 'user') => {
    const demoEmail = userType === 'admin' 
      ? `admin-demo-${Date.now()}@example.com` 
      : `user-demo-${Date.now()}@example.com`;
    
    setEmail(demoEmail);
    setPassword('password');
    setConfirmPassword('password');
    setRole(userType);
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-100 p-6">
      <Card title="Inscription" className="w-full max-w-md shadow-xl">
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
            autoComplete="new-password"
          />
          
          <InputField
            id="confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            required
            className="shadow-sm"
            autoComplete="new-password"
          />
          
          <SelectField
            id="role"
            label="Rôle"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={availableRoles}
            required
            className="shadow-sm"
          />
          
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-4"
            variant="primary"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </form>

        {/* Boutons de démonstration pour faciliter les tests */}
        <div className="mt-4 space-y-2">
          <p className="text-center text-sm text-gray-600 mb-2">
            Données de test :
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => fillDemoData('user')}
              className="flex-1 text-xs"
              variant="outline"
              disabled={loading}
            >
              Données User
            </Button>
            <Button
              type="button"
              onClick={() => fillDemoData('admin')}
              className="flex-1 text-xs"
              variant="outline"
              disabled={loading}
            >
              Données Admin
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Vous avez déjà un compte ?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Connectez-vous ici
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;