import React, { useState, useEffect } from 'react';
import EtudiantApi from './Api/EtudiantApi';  // Assurez-vous que le chemin est correct

const EtudiantDetailPage = () => {
  const [etudiant, setEtudiant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const etudiantData = await EtudiantApi.fetchEtudiantById();
        setEtudiant(etudiantData);
        setLoading(false);
      } catch (err) {
        setError('Erreur de récupération des informations de l\'étudiant');
        setLoading(false);
      }
    };

    fetchData();
  }, []);  // Pas besoin de dépendances, car nous utilisons l'ID de l'utilisateur déjà stocké

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!etudiant) {
    return <p>Aucun étudiant trouvé.</p>;
  }

  return (
    <div>
      <h1>Détails de l'étudiant</h1>
      <p>Nom : {etudiant.nom}</p>
      <p>Prénom : {etudiant.prenom}</p>
      <p>Email : {etudiant.email}</p>
      {/* Afficher d'autres détails si nécessaire */}
    </div>
  );
};

export default EtudiantDetailPage;
