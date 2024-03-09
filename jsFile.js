document.addEventListener("DOMContentLoaded", function() {
  const grid = document.querySelector('.grid');

  // Charger le fichier JSON
  fetch('jokers.json')
      .then(response => response.json())
      .then(data => {
          // Parcourir les données JSON
          data.forEach(item => {
              // Créer un conteneur pour chaque image et sa description
              const container = document.createElement('div');
              container.classList.add('container');

              // Créer l'élément image
              const image = document.createElement('img');
              image.src = item.image;
              image.alt = item.description;
              image.classList.add('image');
              container.appendChild(image);

              // Créer l'élément de description
              const description = document.createElement('p');
              description.textContent = item.description;
              description.classList.add('description');
              container.appendChild(description);

              // Ajouter le conteneur à la grille
              grid.appendChild(container);
          });

          // Récupérer toutes les descriptions
          const descriptions = document.querySelectorAll('.description');

          // Ajouter des gestionnaires d'événements pour afficher les descriptions au survol
          grid.addEventListener('mouseover', function(event) {
              if (event.target.classList.contains('image')) {
                  const description = event.target.nextElementSibling;
                  description.style.display = 'block';
              }
          });

          // Ajouter des gestionnaires d'événements pour cacher les descriptions lorsque la souris quitte l'image
          grid.addEventListener('mouseout', function(event) {
              if (event.target.classList.contains('image')) {
                  const description = event.target.nextElementSibling;
                  description.style.display = 'none';
              }
          });
      })
      .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));
});
