import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    setLoading(true);

    try {
      await login(email, password);
      navigate("/"); // Rediriger vers le tableau de bord après la connexion
    } catch (err) {
      console.error("Erreur de connexion:", err.code, err.message);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("E-mail ou mot de passe invalide.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Trop de tentatives de connexion. Veuillez réessayer plus tard.");
      } else {
        setError("Échec de la connexion. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
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
          />
          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Vous n'avez pas de compte ?{" "}
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Inscrivez-vous ici
          </a>
        </p>
      </Card>
    </div>
  );
};

export default Login;