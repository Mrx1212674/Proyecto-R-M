let currentPage = 1;
let totalPages = 1;

function fetchData(page = 1) {
    currentPage = page;

    let url = `https://rickandmortyapi.com/api/character?page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';
            totalPages = data.info.pages;

            outputDiv.innerHTML = data.results.map(character => `
                <button class="character-btn" onclick="showCharacterInfo(${character.id})">
                    <img src="${character.image}" alt="${character.name}">
                    <p>${character.name}</p>
                </button>
            `).join('');
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

window.onload = () => {
    fetchData(1);
}

document.getElementById('btnInicio').addEventListener('click', () => fetchData(1));
document.getElementById('btnAnterior').addEventListener('click', () => fetchData(Math.max(1, currentPage - 1)));
document.getElementById('btnSiguiente').addEventListener('click', () => fetchData(Math.min(totalPages, currentPage + 1)));
document.getElementById('btnFinal').addEventListener('click', () => fetchData(totalPages));
