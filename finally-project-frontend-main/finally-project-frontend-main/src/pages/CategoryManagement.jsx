
import React, { useState } from 'react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/common/InputField';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext'; // Importer le contexte d'authentification

const CategoryManagement = () => {
  const { userRole } = useAuth(); // Obtenir le rôle de l'utilisateur

  const [categories, setCategories] = useState([
    { id: 1, name: 'Métaux', description: 'Métaux bruts et alliages métalliques' },
    { id: 2, name: 'Bois', description: 'Divers types de bois et produits en bois' },
    { id: 3, name: 'Construction', description: 'Matériaux utilisés dans le bâtiment et la construction' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = 'Le nom de la catégorie est requis.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({ ...category });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setCategories(categories.filter((category) => category.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (editingCategory) {
      setCategories(
        categories.map((category) =>
          category.id === editingCategory.id ? { ...category, ...formData } : category
        )
      );
    } else {
      const newCategory = { id: categories.length + 1, ...formData };
      setCategories([...categories, newCategory]);
    }
    setIsModalOpen(false);
  };

  const tableHeaders = ['ID', 'Nom', 'Description', 'Actions'];
  const tableData = categories.map((category) => [
    category.id,
    category.name,
    category.description || 'N/A',
    <div key={category.id} className="flex space-x-2">
      {/* Les boutons d'édition et de suppression sont visibles uniquement si l'utilisateur est un administrateur */}
      {userRole === 'admin' && (
        <>
          <Button size="sm" onClick={() => handleEditCategory(category)}>
            Modifier
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeleteCategory(category.id)}>
            Supprimer
          </Button>
        </>
      )}
      {/* Les utilisateurs standard peuvent juste voir */}
      {userRole === 'user' && (
        <span className="text-gray-500 text-sm">Voir seulement</span>
      )}
    </div>,
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion des catégories</h1>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Liste des catégories</h2>
          {/* Le bouton d'ajout est visible uniquement si l'utilisateur est un administrateur */}
          {userRole === 'admin' && (
            <Button onClick={handleAddCategory}>Ajouter une nouvelle catégorie</Button>
          )}
        </div>
        <Table headers={tableHeaders} data={tableData} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Modifier la catégorie' : 'Ajouter une nouvelle catégorie'}
      >
        <form onSubmit={handleSubmit}>
          <InputField
            id="name"
            name="name"
            label="Nom de la catégorie"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Entrez le nom de la catégorie"
            required
            error={formErrors.name}
          />
          <InputField
            id="description"
            name="description"
            label="Description"
            type="text"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Entrez la description de la catégorie (facultatif)"
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {editingCategory ? 'Mettre à jour la catégorie' : 'Créer la catégorie'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;