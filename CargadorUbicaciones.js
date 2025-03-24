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
            } else if (type === 'location') {
                outputDiv.innerHTML = data.results.map(location => `
                    <button class="Boton" onclick="showLocationResidents(${location.id})">${location.name}</button>
                `).join('');
                
            }

        })
        .catch(error => console.error('Error al cargar los datos:', error));
}



window.onload = () => fetchData('character', 1);
