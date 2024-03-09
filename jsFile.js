document.addEventListener("DOMContentLoaded", function() {
  // Wait for the DOM to be fully loaded before executing the script

  // Fetch the JSON file containing image data
  fetch('./jokers.json')
    .then(response => response.json())
    .then(data => {
      const grid = document.querySelector('.grid');

      // Loop through each item in the JSON data
      data.forEach(item => {
        // Create a container for each image and its description
        const container = document.createElement('div');
        container.classList.add('container');

        // Create the image element
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.description;
        image.classList.add('image');
        container.appendChild(image);

        // Create the description element
        const description = document.createElement('p');
        description.textContent = item.description;
        description.classList.add('description');
        container.appendChild(description);

        // Add the container to the grid
        grid.appendChild(container);

        // Add mouseover event listener to show description
        container.addEventListener('mouseover', function() {
          description.style.display = 'block';
        });

        // Add mouseout event listener to hide description
        container.addEventListener('mouseout', function() {
          description.style.display = 'none';
        });
      });
    })
    .catch(error => console.error('Error loading JSON file:', error));
});
