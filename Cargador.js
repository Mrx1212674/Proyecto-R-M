// Variables globales para manejar el estado de la aplicación
let currentPage = 1; // Página actual
let totalPages; // Total de páginas disponibles
let currentType = 'character'; // Tipo de datos actual (character, location, episode)
let isShowingRelatedCharacters = false; // Indica si se están mostrando personajes relacionados

// Función principal para obtener datos de la API según el tipo y la página
function fetchData(type, page = 1) {
    currentPage = page;
    currentType = type;
    isShowingRelatedCharacters = false;
    document.getElementById('pagination').style.display = 'flex';

    let url = `https://rickandmortyapi.com/api/${type}?page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';
            totalPages = data.info.pages;

            // Renderiza los datos según el tipo seleccionado
            if (type === 'character') {
                outputDiv.innerHTML = data.results.map(character => `
                    <button class="character-btn" onclick="showCharacterInfo(${character.id})">
                        <img src="${character.image}" alt="${character.name}">
                        <p>${character.name}</p>
                    </button>
                `).join('');
            } else if (type === 'location') {
                outputDiv.innerHTML = data.results.map(location => `
                    <div class="card">
                        <img src="Image/loc.jpg" class:Boton></img>
                        <h3>${location.name}</h3>
                        <p><strong>Tipo:</strong> ${location.type}</p>
                        <p><strong>Dimensión:</strong> ${location.dimension}</p>
                        <p><strong>Residentes:</strong> ${location.residents.length}</p>
                        <button class="Boton" onclick="showLocationCharacters('${location.residents.join(",")}')">Ver personajes</button>
                    </div>
                `).join('');
            } else if (type === 'episode') {
                outputDiv.innerHTML = data.results.map(episode => `
                    <div class="card">
                        <img src="Image/epi.jpg" class:Boton></img>
                        <h3>${episode.name}</h3>
                        <p><strong>Fecha de emisión:</strong> ${episode.air_date}</p>
                        <p><strong>Episodio:</strong> ${episode.episode}</p>
                        <p><strong>Personajes:</strong> ${episode.characters.length}</p>
                        <button class="Boton" onclick="showEpisodeCharacters('${episode.characters.join(",")}')">Ver personajes</button>
                    </div>
                `).join('');
            }

            updatePagination(); // Actualiza la barra de paginación
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

// Evento para manejar el menú desplegable
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const searchContainer = document.getElementById('searchContainer');

    menuButton.addEventListener('click', () => {
        if (searchContainer) {
            searchContainer.style.display = (searchContainer.style.display === 'none' || searchContainer.style.display === '') ? 'block' : 'none';
        }
    });

    menuButton.addEventListener('click', () => {
        elementsToToggle.forEach(element => {
            if (element) {
                element.style.display = (element.style.display === 'none' || element.style.display === '') ? 'block' : 'none';
            }
        });
    });
});

// Evento para alternar la visibilidad del menú de búsqueda
document.getElementById('menuButton').addEventListener('click', () => {
    document.getElementById('searchMenu').classList.toggle('hidden');
});

// Evento para realizar búsquedas por nombre
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        fetch(`https://rickandmortyapi.com/api/character/?name=${query}`)
            .then(response => response.json())
            .then(data => {
                const outputDiv = document.getElementById('output');
                outputDiv.innerHTML = '';
                if (data.results) {
                    outputDiv.innerHTML = data.results.map(character => `
                        <button class="character-btn" onclick="showCharacterInfo(${character.id})">
                            <img src="${character.image}" alt="${character.name}">
                            <p>${character.name}</p>
                        </button>
                    `).join('');
                } else {
                    outputDiv.innerHTML = '<p>No se encontraron resultados.</p>';
                }
            })
            .catch(error => console.error('Error en la búsqueda:', error));
    }
});

// Añadir filtros funcionales para personajes
document.getElementById('searchButton').addEventListener('click', () => {

    const name = document.getElementById('searchInput').value.trim();
    const status = document.getElementById('statusFilter').value;
    const species = document.getElementById('speciesFilter').value;
    const gender = document.getElementById('genderFilter').value;

    let query = `https://rickandmortyapi.com/api/character/?`;
    let filters = [];

    if (name) filters.push(`name=${name}`);
    if (status) filters.push(`status=${status}`);
    if (species) filters.push(`species=${species}`);
    if (gender) filters.push(`gender=${gender}`);

    query += filters.join("&");

    fetchDataWithFilters(query);
});

function fetchDataWithFilters(url) {
    console.log("Fetching data from:", url); 

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = ''; 

            if (data.results) {
                outputDiv.innerHTML = data.results.map(character => `
                    <button class="character-btn" onclick="showCharacterInfo(${character.id})">
                        <img src="${character.image}" alt="${character.name}">
                        <p>${character.name}</p>
                    </button>
                `).join('');
            } else {
                outputDiv.innerHTML = '<p>No se encontraron resultados.</p>';
            }
        })
        .catch(error => console.error('Error en la búsqueda:', error));
}

// Muestra los personajes relacionados con una ubicación
function showLocationCharacters(characterUrls) {
    const characterIds = characterUrls.split(',').map(url => url.split('/').pop());
    showRelatedCharacters(characterIds, 'location');
}

// Muestra los personajes relacionados con un episodio
function showEpisodeCharacters(characterUrls) {
    const characterIds = characterUrls.split(',').map(url => url.split('/').pop());
    showRelatedCharacters(characterIds, 'episode');
}

// Muestra una lista de personajes relacionados
function showRelatedCharacters(characterIds, previousType) {
    isShowingRelatedCharacters = true;
    document.getElementById('pagination').style.display = 'none';

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `
        <div class="related-characters-container">
            <button class="Boton small-exit-btn" onclick="fetchData('${previousType}', 1)">Exit</button>
            <div class="character-list">
                ${characterIds.map(characterId => `
                    <button class="character-btn" onclick="showCharacterInfo(${characterId})">
                        <img src="https://rickandmortyapi.com/api/character/avatar/${characterId}.jpeg" alt="Character">
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

// Muestra información detallada de un personaje en un modal
function showCharacterInfo(id) {
    fetch(`https://rickandmortyapi.com/api/character/${id}`)
        .then(response => response.json())
        .then(character => {
            const modal = document.getElementById('characterModal');
            const modalContent = document.getElementById('modalContent');

            modalContent.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <h2>${character.name}</h2>
                <p><strong>Estado:</strong> ${character.status}</p>
                <p><strong>Especie:</strong> ${character.species}</p>
                <p><strong>Género:</strong> ${character.gender}</p>
                <p><strong>Origen:</strong> ${character.origin.name}</p>
                <p><strong>Ubicación:</strong> ${character.location.name}</p>
                <button onclick="closeModal()">Cerrar</button>
            `;

            modal.style.display = 'block';
        })
        .catch(error => console.error('Error al cargar el personaje:', error));
}

// Cierra el modal de información del personaje
function closeModal() {
    document.getElementById('characterModal').style.display = 'none';
}

// Actualiza la barra de paginación
function updatePagination() {
    const pageNumbersDiv = document.getElementById('pageNumbers');
    pageNumbersDiv.innerHTML = '';

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('Boton');
        pageButton.innerText = i;
        
        if (i === currentPage) {
            pageButton.style.backgroundColor = '#00ff00';
            pageButton.style.color = 'black';
        }
        
        pageButton.addEventListener('click', () => fetchData(currentType, i));
        pageNumbersDiv.appendChild(pageButton);
    }
}

// Eventos para manejar la navegación entre páginas
document.getElementById('btnPersonajes').addEventListener('click', () => fetchData('character', 1));
document.getElementById('btnLugares').addEventListener('click', () => fetchData('location', 1));
document.getElementById('btnEpisodios').addEventListener('click', () => fetchData('episode', 1));

document.getElementById('btnInicio').addEventListener('click', () => fetchData(currentType, 1));
document.getElementById('btnAnterior').addEventListener('click', () => fetchData(currentType, Math.max(1, currentPage - 1)));
document.getElementById('btnSiguiente').addEventListener('click', () => fetchData(currentType, Math.min(totalPages, currentPage + 1)));
document.getElementById('btnFinal').addEventListener('click', () => fetchData(currentType, totalPages));

// Carga inicial de datos al abrir la página
window.onload = () => {
    fetch('https://rickandmortyapi.com/api/character')
        .then(response => response.json())
        .then(data => {
            const randomPage = Math.floor(Math.random() * data.info.pages) + 1;
            fetchData('character', randomPage);
        })
        .catch(error => console.error('Error al obtener el número total de páginas:', error));
};
