document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('project-form');
    const projectsList = document.getElementById('projects-list');

    // Función para cargar proyectos
    function loadProjects() {
        projectsList.innerHTML = '<p>Cargando proyectos...</p>';
        fetch('https://galeriaceramica-backend.onrender.com/api/projects')
            .then((res) => res.json())
            .then((data) => {
                projectsList.innerHTML = '';
                if (data.length === 0) {
                    projectsList.innerHTML = '<p>No hay proyectos aún.</p>';
                    return;
                }
                data.forEach((project) => addProjectToDOM(project));
            })
            .catch((err) => {
                projectsList.innerHTML = '<p>Error cargando proyectos.</p>';
                console.error('Error:', err);
            });
    }

    // Añade un proyecto al DOM
    function addProjectToDOM(project) {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `
            <img src="${project.image_url}" alt="Proyecto" />
            <h3>${project.author}</h3>
            <p>${project.description}</p>
            <p><small>${new Date(
                project.created_at
            ).toLocaleString()}</small></p>
            <button class="delete-btn" data-id="${project.id}">Eliminar</button>
        `;
        projectsList.appendChild(div);

        // Evento para eliminar proyecto
        div.querySelector('.delete-btn').addEventListener('click', async () => {
            if (confirm('¿Estás seguro que quieres eliminar este proyecto?')) {
                try {
                    const res = await fetch(
                        `https://galeriaceramica-backend.onrender.com/api/projects/${project.id}`,
                        {
                            method: 'DELETE',
                        }
                    );
                    const data = await res.json();
                    alert(data.message);
                    loadProjects(); // Recarga la lista sin recargar la página
                } catch (error) {
                    alert('Error al eliminar el proyecto');
                    console.error(error);
                }
            }
        });
    }

    // Evento para subir un proyecto
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        fetch('https://galeriaceramica-backend.onrender.com/api/projects', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                alert('Proyecto subido con éxito');
                form.reset();
                loadProjects(); // Recarga la lista sin recargar la página
            })
            .catch((err) => console.error('Error al subir proyecto:', err));
    });

    // Carga los proyectos apenas cargue la página
    loadProjects();
});
