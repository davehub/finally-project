import React, { useState } from 'react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/common/InputField';
import SelectField from '../components/common/SelectField';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext'; // Importer le contexte d'authentification

const UserManagement = () => {
  const { userRole } = useAuth(); // Obtenir le rôle de l'utilisateur

  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'admin', status: 'Active' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'Active' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user', status: 'Inactive' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Objet utilisateur en cours d'édition ou null pour un nouvel utilisateur
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user', // Rôle par défaut pour les nouveaux utilisateurs
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState({});

  // Si l'utilisateur n'est pas un administrateur, afficher un message d'accès refusé
  if (userRole !== 'admin') {
    return (
      <div className="p-6 text-center">
        <Card title="Accès refusé">
          <p className="text-red-600 font-semibold mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <p className="text-gray-700">
            Seuls les administrateurs peuvent gérer les utilisateurs.
          </p>
        </Card>
      </div>
    );
  }

  const roles = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'user', label: 'Utilisateur standard' },
  ];

  const statuses = [
    { value: 'Active', label: 'Actif' },
    { value: 'Inactive', label: 'Inactif' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' }); // Effacer l'erreur lors du changement
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = 'Le nom est requis.';
    if (!formData.email.trim()) {
      errors.email = 'L\'e-mail est requis.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'L\'e-mail est invalide.';
    }
    if (!formData.role) errors.role = 'Le rôle est requis.';
    if (!formData.status) errors.status = 'Le statut est requis.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'user', status: 'Active' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({ ...user }); // Pré-remplir le formulaire avec les données de l'utilisateur
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id) => {
    // Remplacer window.confirm par un composant de modale personnalisé si l'application est en production
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (editingUser) {
      // Mettre à jour l'utilisateur existant
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
    } else {
      // Ajouter un nouvel utilisateur
      const newUser = { id: users.length + 1, ...formData };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const tableHeaders = ['ID', 'Nom', 'E-mail', 'Rôle', 'Statut', 'Actions'];
  const tableData = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.role,
    <span
      key={user.id}
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
        ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
    >
      {user.status}
    </span>,
    <div key={user.id} className="flex space-x-2">
      <Button size="sm" onClick={() => handleEditUser(user)}>
        Modifier
      </Button>
      <Button size="sm" variant="danger" onClick={() => handleDeleteUser(user.id)}>
        Supprimer
      </Button>
    </div>,
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion des utilisateurs</h1>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Liste des utilisateurs</h2>
          <Button onClick={handleAddUser}>Ajouter un nouvel utilisateur</Button>
        </div>
        <Table headers={tableHeaders} data={tableData} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un nouvel utilisateur'}
      >
        <form onSubmit={handleSubmit}>
          <InputField
            id="name"
            name="name"
            label="Nom"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Entrez le nom de l'utilisateur"
            required
            error={formErrors.name}
          />
          <InputField
            id="email"
            name="email"
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Entrez l'e-mail de l'utilisateur"
            required
            error={formErrors.email}
          />
          <SelectField
            id="role"
            name="role"
            label="Rôle"
            value={formData.role}
            onChange={handleInputChange}
            options={roles}
            required
            error={formErrors.role}
          />
          <SelectField
            id="status"
            name="status"
            label="Statut"
            value={formData.status}
            onChange={handleInputChange}
            options={statuses}
            required
            error={formErrors.status}
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {editingUser ? 'Mettre à jour l\'utilisateur' : 'Créer l\'utilisateur'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;