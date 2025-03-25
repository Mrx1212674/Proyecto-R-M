let currentPage = 1;
let totalPages = 1;
let currentType = 'character';

function fetchData(type, page = 1) {
    currentPage = page;

    let url = `https://rickandmortyapi.com/api/${type}?page=${page}`;

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

document.getElementById('btnPersonajes').addEventListener('click', () => fetchData('character', 1));
document.getElementById('btnEpisodios').addEventListener('click', () => fetchData('episode', 1));


window.onload = () => fetchData('character', 1);