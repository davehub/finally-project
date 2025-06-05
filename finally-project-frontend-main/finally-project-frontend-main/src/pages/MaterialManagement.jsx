import React, { useState } from 'react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/common/InputField';
import SelectField from '../components/common/SelectField';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext'; // Importer le contexte d'authentification

const MaterialManagement = () => {
  const { userRole } = useAuth(); // Obtenir le rôle de l'utilisateur

  const [materials, setMaterials] = useState([
    { id: 1, name: 'Barre d\'acier', category: 'Métaux', quantity: 150, unit: 'kg' },
    { id: 2, name: 'Planche en bois', category: 'Bois', quantity: 200, unit: 'pcs' },
    { id: 3, name: 'Mélange de béton', category: 'Construction', quantity: 50, unit: 'sacs' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const categories = [
    { value: 'Metals', label: 'Métaux' },
    { value: 'Wood', label: 'Bois' },
    { value: 'Construction', label: 'Construction' },
    { value: 'Plastics', label: 'Plastiques' },
  ];

  const units = [
    { value: 'kg', label: 'Kilogrammes (kg)' },
    { value: 'pcs', label: 'Pièces (pcs)' },
    { value: 'bags', label: 'Sacs' },
    { value: 'meters', label: 'Mètres (m)' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = 'Le nom du matériau est requis.';
    if (!formData.category) errors.category = 'La catégorie est requise.';
    if (!formData.quantity || isNaN(formData.quantity) || formData.quantity <= 0) {
      errors.quantity = 'La quantité doit être un nombre positif.';
    }
    if (!formData.unit) errors.unit = 'L\'unité est requise.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setFormData({ name: '', category: categories[0]?.value || '', quantity: '', unit: units[0]?.value || '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setFormData({ ...material });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteMaterial = (id) => {
   
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matériau ?')) {
      setMaterials(materials.filter((material) => material.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (editingMaterial) {
      setMaterials(
        materials.map((material) =>
          material.id === editingMaterial.id ? { ...material, ...formData } : material
        )
      );
    } else {
      const newMaterial = { id: materials.length + 1, ...formData, quantity: parseFloat(formData.quantity) };
      setMaterials([...materials, newMaterial]);
    }
    setIsModalOpen(false);
  };

  const tableHeaders = ['ID', 'Nom', 'Catégorie', 'Quantité', 'Unité', 'Actions'];
  const tableData = materials.map((material) => [
    material.id,
    material.name,
    material.category,
    material.quantity,
    material.unit,
    <div key={material.id} className="flex space-x-2">
      {/* Les boutons d'édition et de suppression sont visibles uniquement si l'utilisateur est un administrateur */}
      {userRole === 'admin' && (
        <>
          <Button size="sm" onClick={() => handleEditMaterial(material)}>
            Modifier
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeleteMaterial(material.id)}>
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion des matériaux</h1>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Liste des matériaux</h2>
          {/* Le bouton d'ajout est visible uniquement si l'utilisateur est un administrateur */}
          {userRole === 'admin' && (
            <Button onClick={handleAddMaterial}>Ajouter un nouveau matériau</Button>
          )}
        </div>
        <Table headers={tableHeaders} data={tableData} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMaterial ? 'Modifier le matériau' : 'Ajouter un nouveau matériau'}
      >
        <form onSubmit={handleSubmit}>
          <InputField
            id="name"
            name="name"
            label="Nom du matériau"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Entrez le nom du matériau"
            required
            error={formErrors.name}
          />
          <SelectField
            id="category"
            name="category"
            label="Catégorie"
            value={formData.category}
            onChange={handleInputChange}
            options={categories}
            required
            error={formErrors.category}
          />
          <InputField
            id="quantity"
            name="quantity"
            label="Quantité"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Entrez la quantité"
            required
            error={formErrors.quantity}
          />
          <SelectField
            id="unit"
            name="unit"
            label="Unité"
            value={formData.unit}
            onChange={handleInputChange}
            options={units}
            required
            error={formErrors.unit}
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {editingMaterial ? 'Mettre à jour le matériau' : 'Créer le matériau'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MaterialManagement;
