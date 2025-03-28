let currentPage = 1;
let totalPages = 1;
let currentType = 'character';

function fetchData(type, page = 1) {
    currentPage = page;
    currentType = type;

    let url = `https://rickandmortyapi.com/api/${type}?page=${currentPage}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';
            totalPages = data.info.pages;

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
                        <h3>${location.name}</h3>
                        <p><strong>Tipo:</strong> ${location.type}</p>
                        <p><strong>Dimensión:</strong> ${location.dimension}</p>
                    </div>
                `).join('');
            } else if (type === 'episode') {
                outputDiv.innerHTML = data.results.map(episode => `
                    <div class="card">
                        <h3>${episode.name}</h3>
                        <p><strong>Episodio:</strong> ${episode.episode}</p>
                        <p><strong>Fecha de emisión:</strong> ${episode.air_date}</p>
                    </div>
                `).join('');
            }

            updatePagination();
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

document.getElementById('menuButton').addEventListener('click', () => {
    document.getElementById('searchMenu').classList.toggle('hidden');
});

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

function closeModal() {
    document.getElementById('characterModal').style.display = 'none';
}

function updatePagination() {
    const pageNumbersDiv = document.getElementById('pageNumbers');
    pageNumbersDiv.innerHTML = '';

    document.getElementById('btnInicio').style.display = currentPage === 1 ? 'none' : 'inline-block';
    document.getElementById('btnAnterior').style.display = currentPage === 1 ? 'none' : 'inline-block';
    document.getElementById('btnSiguiente').style.display = currentPage === totalPages ? 'none' : 'inline-block';
    document.getElementById('btnFinal').style.display = currentPage === totalPages ? 'none' : 'inline-block';

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



document.getElementById('btnPersonajes').addEventListener('click', () => fetchData('character', 1));
document.getElementById('btnLugares').addEventListener('click', () => fetchData('location', 1));
document.getElementById('btnEpisodios').addEventListener('click', () => fetchData('episode', 1));

document.getElementById('btnInicio').addEventListener('click', () => fetchData(currentType, 1));
document.getElementById('btnAnterior').addEventListener('click', () => fetchData(currentType, Math.max(1, currentPage - 1)));
document.getElementById('btnSiguiente').addEventListener('click', () => fetchData(currentType, Math.min(totalPages, currentPage + 1)));
document.getElementById('btnFinal').addEventListener('click', () => fetchData(currentType, totalPages));

window.onload = () => fetchData('character', 1);
