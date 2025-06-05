import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import SelectField from "../components/common/SelectField"; // Pour la sélection du rôle

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
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      await register(email, password, role);
      navigate("/");
    } catch (err) {
      console.error("Erreur d'inscription:", err.code, err.message);
      if (err.code === "auth/email-already-in-use") {
        setError("Cet e-mail est déjà utilisé.");
      } else if (err.code === "auth/weak-password") {
        setError("Le mot de passe est trop faible (minimum 6 caractères).");
      } else {
        setError("Échec de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
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
          <InputField
            id="confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            required
            className="shadow-sm"
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
          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Register;