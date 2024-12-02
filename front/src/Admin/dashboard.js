import React from 'react'

function Dashboard() {
  // Récupérer les données utilisateur depuis localStorage
  const userData = localStorage.getItem('userData');
    
  // Vérifier si les données existent et si l'utilisateur est un admin
  
      const parsedUserData = JSON.parse(userData);
      
          // Extraire l'ID de l'administrateur
          const adminId = parsedUserData.id;
            const adminEmail = parsedUserData.email;
          return (
              <div>
                  <h1>Page Admin</h1>
                  <p>Bienvenue, Admin!</p>
                  <p>Votre ID est : {adminId}</p>
                  <p>Votre Email est : {adminEmail}</p>
              </div>
          );
}

export default Dashboard