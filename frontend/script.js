// frontend/script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('project-form');
    const projectsList = document.getElementById('projects-list');

    // Obtener todos los proyectos
    fetch('http://localhost:5000/api/projects')
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            data.forEach((project) => addProjectToDOM(project));
        })
        .catch((err) => console.error('Error:', err));

    // Subir nuevo proyecto
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        fetch('http://localhost:5000/api/projects', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                alert('Proyecto subido con éxito');
                form.reset();
                location.reload();
            })
            .catch((err) => console.error('Error al subir proyecto:', err));
    });

    function addProjectToDOM(project) {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `
      <img src="${project.image_url}" alt="Proyecto" />
      <h3>${project.author}</h3>
      <p>${project.description}</p>
      <p><small>${new Date(project.created_at).toLocaleString()}</small></p>
      <button class="delete-btn" data-id="${project.id}">Eliminar</button>
    `;
        projectsList.appendChild(div);
        // Agregar evento al botón eliminar
        div.querySelector('.delete-btn').addEventListener('click', async () => {
            if (confirm('¿Estás seguro que quieres eliminar este proyecto?')) {
                try {
                    const res = await fetch(
                        `http://localhost:5000/api/projects/${project.id}`,
                        {
                            method: 'DELETE',
                        }
                    );
                    const data = await res.json();
                    alert(data.message);
                    location.reload();
                } catch (error) {
                    alert('Error al eliminar el proyecto');
                    console.error(error);
                }
            }
        });
    }
});
