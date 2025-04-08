// Variables globales para manejar el estado de la aplicación
let currentPage = 1; // Página actual
let totalPages; // Total de páginas disponibles
let currentType = 'character'; // Tipo de datos actual (character, location, episode)
let isShowingRelatedCharacters = false; // Indica si se están mostrando personajes relacionados

// Variables para el autocompletado
let suggestionsTimeout;
let currentSuggestions = [];

// URL base del servidor Java
const SERVER_URL = 'http://localhost:8080';

// Crear contenedor de sugerencias si no existe
function initSuggestions() {
    if (!document.getElementById('searchSuggestions')) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'searchSuggestions';
        suggestionsContainer.className = 'search-suggestions';
        document.getElementById('searchContainer').appendChild(suggestionsContainer);
    }
}

// Mostrar sugerencias al escribir
function showSuggestions(query) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!query) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    clearTimeout(suggestionsTimeout);
    suggestionsTimeout = setTimeout(() => {
        const status = document.getElementById('statusFilter')?.value;
        const species = document.getElementById('speciesFilter')?.value;
        const gender = document.getElementById('genderFilter')?.value;

        let url = `https://rickandmortyapi.com/api/character/?name=${query}`;
        if (status) url += `&status=${status}`;
        if (species) url += `&species=${species}`;
        if (gender) url += `&gender=${gender}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    currentSuggestions = data.results;
                    renderSuggestions(data.results);
                } else {
                    suggestionsContainer.style.display = 'none';
                }
            })
            .catch(() => {
                suggestionsContainer.style.display = 'none';
            });
    }, 300);
}

// Renderizar sugerencias
function renderSuggestions(characters) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    suggestionsContainer.innerHTML = characters.slice(0, 10).map(character => `
        <div class="suggestion-item" onclick="selectSuggestion(${character.id})">
            <img src="${character.image}" alt="${character.name}">
            <p>${character.name}</p>
        </div>
    `).join('');
    suggestionsContainer.style.display = 'block';
}

// Seleccionar una sugerencia
function selectSuggestion(characterId) {
    const character = currentSuggestions.find(c => c.id === characterId);
    if (character) {
        document.getElementById('searchInput').value = character.name;
        document.getElementById('searchSuggestions').style.display = 'none';
        showCharacterInfo(characterId);
    }
}

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
                outputDiv.innerHTML = data.results.map(character => 
                    `<button class="character-btn" onclick="showCharacterInfo(${character.id})">
                        <img src="${character.image}" alt="${character.name}">
                        <p>${character.name}</p>
                    </button>`
                ).join('');
            } else if (type === 'location') {
                outputDiv.innerHTML = data.results.map(location => 
                    `<div class="card">
                        <img src="Image/loc.jpg"></img>
                        <h3>${location.name}</h3>
                        <p><strong>Tipo:</strong> ${location.type}</p>
                        <p><strong>Dimensión:</strong> ${location.dimension}</p>
                        <p><strong>Residentes:</strong> ${location.residents.length}</p>
                        <button class="Boton" onclick="showLocationCharacters('${location.residents.join(",")}')">Ver personajes</button>
                    </div>`
                ).join('');
            } else if (type === 'episode') {
                outputDiv.innerHTML = data.results.map(episode => 
                    `<div class="card">
                        <img src="Image/epi.jpg"></img>
                        <h3>${episode.name}</h3>
                        <p><strong>Fecha de emisión:</strong> ${episode.air_date}</p>
                        <p><strong>Episodio:</strong> ${episode.episode}</p>
                        <p><strong>Personajes:</strong> ${episode.characters.length}</p>
                        <button class="Boton" onclick="showEpisodeCharacters('${episode.characters.join(",")}')">Ver personajes</button>
                    </div>`
                ).join('');
            }

            updatePagination(); // Actualiza la barra de paginación
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

// Evento para manejar el menú desplegable
document.addEventListener('DOMContentLoaded', () => {
    initSuggestions();
    
    const menuButton = document.getElementById('menuButton');
    const searchContainer = document.getElementById('searchContainer');

    // Ocultar el searchContainer al cargar la página
    if (searchContainer) {
        searchContainer.style.display = 'none';
    }

    menuButton.addEventListener('click', () => {
        if (searchContainer) {
            searchContainer.style.display = (searchContainer.style.display === 'none' || searchContainer.style.display === '') ? 'block' : 'none';
        }
    });

    // Evento para buscar al presionar Enter en el input
    document.getElementById('searchInput').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            const query = this.value.trim();
            if (!query) {
                alert('Por favor ingresa un término de búsqueda');
                return;
            }
            document.getElementById('searchSuggestions').style.display = 'none';
            document.getElementById('pagination').style.display = 'none';
            document.getElementById('searchButton').click();
        }
    });

    // Evento para input de búsqueda
    document.getElementById('searchInput').addEventListener('input', function() {
        showSuggestions(this.value.trim());
    });

    // Solo si elementsToToggle está definido en otra parte del código
    menuButton.addEventListener('click', () => {
        if (typeof elementsToToggle !== 'undefined') {
            elementsToToggle.forEach(element => {
                if (element) {
                    element.style.display = (element.style.display === 'none' || element.style.display === '') ? 'block' : 'none';
                }
            });
        }
    });
});

// Cerrar sugerencias al hacer clic fuera
document.addEventListener('click', (event) => {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer && 
        !event.target.closest('#searchContainer') && 
        event.target.id !== 'searchInput') {
        suggestionsContainer.style.display = 'none';
    }
});

// Evento para alternar la visibilidad del menú de búsqueda
document.getElementById('menuButton').addEventListener('click', () => {
    const searchMenu = document.getElementById('searchMenu');
    if (searchMenu) {
        searchMenu.classList.toggle('hidden');
    }
});

// Evento para realizar búsquedas por nombre
document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value.trim();
    
    // Validar que el campo no esté vacío
    if (!query) {
        alert('Por favor ingresa un término de búsqueda');
        return;
    }

    document.getElementById('searchSuggestions').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
    
    fetch(`https://rickandmortyapi.com/api/character/?name=${query}`)
        .then(response => response.json())
        .then(data => {
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';
            if (data.results) {
                outputDiv.innerHTML = data.results.map(character => 
                    `<button class="character-btn" onclick="showCharacterInfo(${character.id})">
                        <img src="${character.image}" alt="${character.name}">
                        <p>${character.name}</p>
                    </button>`
                ).join('');
                
                totalPages = data.info.pages || 1;
                document.getElementById('pagination').style.display = 'none';
            } else {
                outputDiv.innerHTML = '<p>No se encontraron resultados.</p>';
                document.getElementById('pagination').style.display = 'none';
            }
        })
        .catch(error => console.error('Error en la búsqueda:', error));
});

// Añadir filtros funcionales para personajes
document.getElementById('searchButton').addEventListener('click', () => {
    const name = document.getElementById('searchInput').value.trim();
    if (!name) return; // No buscar si está vacío
    
    const status = document.getElementById('statusFilter')?.value;
    const species = document.getElementById('speciesFilter')?.value;
    const gender = document.getElementById('genderFilter')?.value;

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
                outputDiv.innerHTML = data.results.map(character => 
                    `<button class="character-btn" onclick="showCharacterInfo(${character.id})">
                        <img src="${character.image}" alt="${character.name}">
                        <p>${character.name}</p>
                    </button>`
                ).join('');
            } else {
                outputDiv.innerHTML = '<p>No se encontraron resultados.</p>';
            }
            
            document.getElementById('pagination').style.display = 'none';
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
    outputDiv.innerHTML = 
        `<div class="related-characters-container">
            <button class="Boton small-exit-btn" onclick="fetchData('${previousType}', 1)">Exit</button>
            <div class="character-list">
                ${characterIds.map(characterId => 
                    `<button class="character-btn" onclick="showCharacterInfo(${characterId})">
                        <img src="https://rickandmortyapi.com/api/character/avatar/${characterId}.jpeg" alt="Character">
                    </button>`
                ).join('')}
            </div>
        </div>`;
}

// Verificar si un personaje está en favoritos consultando la base de datos
async function checkFavoriteStatus(characterId) {
    try {
        const query = `SELECT id FROM personaje WHERE id = ${characterId}`;
        const response = await fetch(`${SERVER_URL}/ejecutarSQL`, {
            method: 'POST',
            body: query,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        
        const result = await response.text();
        // Si contiene más de una línea y no empieza por "Error", hay resultados
        const lines = result.trim().split('\n');
        return lines.length > 1 && !result.startsWith('Error');
    } catch (error) {
        console.error('Error al verificar estado de favorito:', error);
        return false;
    }
}

async function getAllData(type) {
    let allResults = [];
    let nextPage = `https://rickandmortyapi.com/api/${type}`;

    while (nextPage) {
        try {
            const response = await fetch(nextPage);
            const data = await response.json();

            allResults = allResults.concat(data.results);
            nextPage = data.info.next; // URL de la siguiente página, o null si no hay más
        } catch (error) {
            console.error(`Error al obtener datos de ${type}:`, error);
            throw error; // Re-lanza el error para que sea manejado por la función principal
        }
    }

    return allResults;
}
// Función para obtener todos los datos de la API recorriendo todas las páginas
async function getAllData(type) {
    let allResults = [];
    let nextPage = `https://rickandmortyapi.com/api/${type}`;

    while (nextPage) {
        try {
            const response = await fetch(nextPage);
            const data = await response.json();

            if (data.results) {
                allResults = allResults.concat(data.results);
                nextPage = data.info.next; // URL de la siguiente página, o null si no hay más
            } else {
                console.warn(`No se encontraron resultados en la página actual para ${type}.`);
                nextPage = null; // Detener el bucle si no hay resultados
            }
        } catch (error) {
            console.error(`Error al obtener datos de ${type}:`, error);
            throw error; // Re-lanza el error para que sea manejado por la función principal
        }
    }

    return allResults;
}

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&"']/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '"': return '&quot;';
            case '\'': return '&apos;';
            default: return c;
        }
    });
}

// Función para convertir datos a formato XML
function convertToXML(data, type) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${type}s>\n`;
    data.forEach(item => {
        xml += `  <${type}>\n`;
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                // Escapar el valor antes de insertarlo en el XML
                const escapedValue = escapeXml(String(item[key]));
                xml += `    <${key}>${escapedValue}</${key}>\n`;
            }
        }
        xml += `  </${type}>\n`;
    });
    xml += `</${type}s>`;
    return xml;
}

// Función para descargar el archivo XML
function downloadXML(xmlContent, fileName) {
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

// Evento para manejar la exportación a XML
document.getElementById('btnExportXML').addEventListener('click', async () => {
    const selectedType = document.getElementById('dataTypeSelector').value;

    try {
        // Obtener todos los datos de todas las páginas
        const allData = await getAllData(selectedType);

        // Convertir los datos a formato XML
        const xmlContent = convertToXML(allData, selectedType);

        // Descargar el archivo XML
        downloadXML(xmlContent, `${selectedType}s.xml`);

        alert(`El archivo ${selectedType}s.xml se ha descargado con éxito.`);
    } catch (error) {
        console.error('Error al generar el archivo XML:', error);
        alert('Hubo un problema al generar el archivo XML.');
    }
})


// Muestra información detallada de un personaje en un modal
async function showCharacterInfo(id) {
    try {
        const [character, isFavorite] = await Promise.all([
            fetch(`https://rickandmortyapi.com/api/character/${id}`).then(response => response.json()),
            checkFavoriteStatus(id)
        ]);
        
        const heartIcon = isFavorite ? '♥︎' : '♡';
        const activeClass = isFavorite ? 'active' : '';
        
        const modal = document.getElementById('characterModal');
        const modalContent = document.getElementById('modalContent');

        modalContent.innerHTML = `
            <button class="btnfavorite ${activeClass}" onclick="toggleFavorite(${id}, '${character.name}', '${character.status}', '${character.species}', '${character.gender}', '${character.origin.name}', '${character.location.name}', '${character.image}')">${heartIcon}</button>
            <img src="${character.image}" alt="${character.name}">
            <h2>${character.name}</h2>
            <p><strong>Estado:</strong> ${character.status}</p>
            <p><strong>Especie:</strong> ${character.species}</p>
            <p><strong>Género:</strong> ${character.gender}</p>
            <p><strong>Origen:</strong> ${character.origin.name}</p>
            <p><strong>Ubicación:</strong> ${character.location.name}</p>
            <button onclick="closeModal()">Cerrar</button>`;

        modal.style.display = 'block';
    } catch (error) {
        console.error('Error al cargar el personaje:', error);
    }
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

// Función para alternar el estado de favorito de un personaje y guardarlo en la base de datos
async function toggleFavorite(id, nombre, estado, especie, genero, origen, localizacion, imagen) {
    const button = document.querySelector('.btnfavorite');
    const isFavorite = button.classList.contains('active');
    
    try {
        if (isFavorite) {
            // Si ya es favorito, eliminarlo de la base de datos
            const deleteQuery = `DELETE FROM personaje WHERE id = ${id}`;
            await executeSQLQuery(deleteQuery);
            button.textContent = '♡';
            button.classList.remove('active');
        } else {
            // Si no es favorito, agregarlo a la base de datos
            // Escapar comillas simples en los strings para evitar errores SQL
            nombre = nombre.replace(/'/g, "''");
            estado = estado.replace(/'/g, "''");
            especie = especie.replace(/'/g, "''");
            genero = genero.replace(/'/g, "''");
            origen = origen.replace(/'/g, "''");
            localizacion = localizacion.replace(/'/g, "''");
            imagen = imagen.replace(/'/g, "''");
            
            const insertQuery = `INSERT INTO personaje (id, nombre, estado, especie, genero, origen, localización, imagen, episodio) 
                                VALUES (${id}, '${nombre}', '${estado}', '${especie}', '${genero}', '${origen}', '${localizacion}', '${imagen}', '')`;
            await executeSQLQuery(insertQuery);
            button.textContent = '♥︎';
            button.classList.add('active');
        }
    } catch (error) {
        console.error('Error al actualizar favorito en la base de datos:', error);
        alert('Error al actualizar favorito. Verifica la conexión con el servidor.');
    }
}

// Función para ejecutar consultas SQL mediante el servidor Java
async function executeSQLQuery(query) {
    try {
        const response = await fetch(`${SERVER_URL}/ejecutarSQL`, {
            method: 'POST',
            body: query,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        
        const result = await response.text();
        console.log('Resultado SQL:', result);
        
        if (result.startsWith('Error')) {
            throw new Error(result);
        }
        
        return result;
    } catch (error) {
        console.error('Error en consulta SQL:', error);
        throw error;
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

// Mostrar los personajes favoritos desde la base de datos cuando se hace clic en el botón "Favoritos"
document.getElementById('btnFavorito').addEventListener('click', async () => {
    try {
        // Ocultar paginación
        document.getElementById('pagination').style.display = 'none';
        isShowingRelatedCharacters = true;
        
        // Mostrar la sección de carga mientras se recuperan los datos
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '<p>Cargando favoritos...</p>';
        
        // Consultar todos los personajes favoritos de la base de datos
        const query = 'SELECT * FROM personaje';
        const result = await executeSQLQuery(query);
        
        // Procesar resultados CSV
        const lines = result.trim().split('\n');
        
        if (lines.length <= 1) {
            outputDiv.innerHTML = '<p>No tienes personajes favoritos guardados.</p>';
            return;
        }
        
        // La primera línea contiene los nombres de las columnas
        const headers = lines[0].split(',');
        
        // Las siguientes líneas contienen los datos
        const characters = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const character = {};
            
            for (let j = 0; j < headers.length; j++) {
                character[headers[j]] = values[j];
            }
            
            characters.push(character);
        }
        
        // Mostrar los personajes
        if (characters.length > 0) {
            outputDiv.innerHTML = `
                <div class="related-characters-container">
                    <h2>Mis Personajes Favoritos</h2>
                    <div class="character-list">
                        ${characters.map(character => `
                            <button class="character-btn" onclick="showCharacterInfo(${character.id})">
                                <img src="${character.imagen}" alt="${character.nombre}">
                                <p>${character.nombre}</p>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            outputDiv.innerHTML = '<p>No tienes personajes favoritos guardados.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los favoritos:', error);
        document.getElementById('output').innerHTML = '<p>Error al cargar los favoritos. Verifica la conexión con el servidor.</p>';
    }
});