import React from 'react';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser, userRole, userId } = useAuth();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg shadow-lg">
        Tableau de Bord
      </h1>

      {currentUser ? (
        <>
          <Card title="Bienvenue !" className="mb-6 shadow-lg rounded-xl bg-white p-6">
            <p className="text-gray-700 text-lg">
              Bonjour, <span className="font-semibold">{currentUser.email}</span> !
            </p>
            <p className="text-gray-600 text-lg">
              Votre rôle : <span className="font-semibold capitalize">{userRole}</span>
            </p>
            <p className="text-gray-600 text-sm font-mono mt-2">ID Utilisateur : {userId}</p>
            {userRole === 'admin' && (
              <p className="mt-4 text-blue-600 font-medium">
                Vous avez accès à toutes les fonctionnalités de gestion.
              </p>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card title="Total Utilisateurs" className="bg-indigo-100 border-l-4 border-indigo-500 shadow-lg rounded-xl transition-transform hover:scale-105">
              <p className="text-5xl font-bold text-indigo-700">1,234</p>
              <p className="text-gray-600 mt-2">Utilisateurs enregistrés dans le système</p>
            </Card>
            <Card title="Matériaux en Stock" className="bg-green-100 border-l-4 border-green-500 shadow-lg rounded-xl transition-transform hover:scale-105">
              <p className="text-5xl font-bold text-green-700">567</p>
              <p className="text-gray-600 mt-2">Différents types de matériaux</p>
            </Card>
            <Card title="Approbations en attente" className="bg-yellow-100 border-l-4 border-yellow-500 shadow-lg rounded-xl transition-transform hover:scale-105">
              <p className="text-5xl font-bold text-yellow-700">12</p>
              <p className="text-gray-600 mt-2">Articles en attente de révision</p>
            </Card>
          </div>

          <Card title="Activité Récente" className="mt-8 p-6 bg-white shadow-lg rounded-xl">
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <span className="text-green-500">
                  ✅
                </span>
                <p className="text-gray-700">L'utilisateur <span className="font-medium">Jane Doe</span> a ajouté un nouveau matériau.</p>
                <span className="text-sm text-gray-500 ml-auto">Il y a 2 heures</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-blue-500">
                  🔵
                </span>
                <p className="text-gray-700">Les permissions du rôle <span className="font-medium">Administrateur</span> ont été mises à jour.</p>
                <span className="text-sm text-gray-500 ml-auto">Hier</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-red-500">
                  ❌
                </span>
                <p className="text-gray-700">La catégorie <span className="font-medium">Électronique</span> a été supprimée.</p>
                <span className="text-sm text-gray-500 ml-auto">Il y a 3 jours</span>
              </li>
            </ul>
          </Card>

          <Card title="Aperçu du système" className="mt-8 p-6 bg-white shadow-lg rounded-xl">
            <p className="text-gray-700 text-lg">
              Intégrer une bibliothèque de graphiques comme Recharts ou Chart.js pour visualiser les données.
            </p>
            <div className="mt-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              [Espace réservé pour le graphique]
              
            </div>
          </Card>
        </>
      ) : (
        <Card title="Veuillez vous connecter" className="text-center shadow-lg rounded-xl p-6 bg-white">
          <p className="text-gray-700 mb-4 text-lg">
            Connectez-vous pour accéder au tableau de bord et aux fonctionnalités de gestion.
          </p>
          <button onClick={() => window.location.href = '/login'} className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all">
            Aller à la page de connexion
          </button>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;