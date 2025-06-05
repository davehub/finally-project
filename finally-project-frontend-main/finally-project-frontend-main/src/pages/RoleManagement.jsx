import React, { useState } from "react";
import Table from "../components/common/Table";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import InputField from "../components/common/InputField";
import Card from "../components/common/Card";
import { useAuth } from "../context/AuthContext";

const RoleManagement = () => {
  const { userRole } = useAuth();

  const [roles, setRoles] = useState([
    { id: 1, name: "admin", permissions: ["manage_users", "manage_materials", "manage_categories", "manage_roles"] },
    { id: 2, name: "user", permissions: ["view_materials", "view_categories"] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ name: "", permissions: [] });
  const [formErrors, setFormErrors] = useState({});

  if (userRole !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <Card title="Accès refusé">
          <p className="text-red-600 font-semibold mb-4">Vous n'avez pas les permissions nécessaires pour gérer les rôles.</p>
        </Card>
      </div>
    );
  }

  const allPermissions = ["manage_users", "view_users", "manage_materials", "view_materials", "manage_categories", "view_categories", "manage_roles", "view_roles"];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handlePermissionChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      permissions: e.target.checked ? [...prevData.permissions, e.target.value] : prevData.permissions.filter((perm) => perm !== e.target.value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormErrors({ name: "Le nom du rôle est requis." });
      return;
    }

    if (editingRole) {
      setRoles(roles.map((role) => (role.id === editingRole.id ? { ...role, ...formData } : role)));
    } else {
      setRoles([...roles, { id: roles.length + 1, ...formData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion des rôles</h1>
      <Card className="mb-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Liste des rôles</h2>
          <Button onClick={() => setIsModalOpen(true)}>Ajouter un rôle</Button>
        </div>
        <Table
          headers={["ID", "Nom", "Permissions", "Actions"]}
          data={roles.map((role) => [
            role.id,
            role.name,
            <ul key={role.id} className="list-disc list-inside text-sm capitalize">
              {role.permissions.map((perm, idx) => (
                <li key={idx}>{perm.replace(/_/g, " ")}</li>
              ))}
            </ul>,
            <div key={role.id} className="flex space-x-2">
              <Button size="sm" onClick={() => setEditingRole(role) || setIsModalOpen(true)}>Modifier</Button>
              <Button size="sm" variant="danger" onClick={() => setRoles(roles.filter((r) => r.id !== role.id))}>Supprimer</Button>
            </div>,
          ])}
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRole ? "Modifier le rôle" : "Ajouter un nouveau rôle"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField id="name" name="name" label="Nom du rôle" type="text" value={formData.name} onChange={handleInputChange} required error={formErrors.name} />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {allPermissions.map((permission) => (
                <div key={permission} className="flex items-center">
                  <input type="checkbox" id={permission} name="permissions" value={permission} checked={formData.permissions.includes(permission)} onChange={handlePermissionChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor={permission} className="ml-2 text-sm text-gray-700 capitalize">{permission.replace(/_/g, " ")}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit">{editingRole ? "Mettre à jour" : "Créer le rôle"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoleManagement;