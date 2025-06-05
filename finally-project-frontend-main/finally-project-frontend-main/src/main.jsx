import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Importer le CSS global (y compris Tailwind)


// Assurez-vous que l'élément racine existe avant le rendu
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('L\'élément racine avec l\'ID "root" est introuvable dans le document.');
}


const tailwindScript = document.createElement('script');
tailwindScript.src = 'https://cdn.tailwindcss.com';
document.head.appendChild(tailwindScript);

// Ajouter la police Inter de Google Fonts
const interFontLink = document.createElement('link');
interFontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
interFontLink.rel = 'stylesheet';
document.head.appendChild(interFontLink);

// Définir la famille de polices pour le corps dans une balise de style pour une application immédiate
const fontStyle = document.createElement('style');
fontStyle.innerHTML = `
  body {
    font-family: 'Inter', sans-serif;
  }
`;
document.head.appendChild(fontStyle);
