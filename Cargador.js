let currentPage = 1;

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
                    <button onclick="showCharacterInfo(${character.id})">
                        <img src="${character.image}" alt="${character.name}">
                        <p>${character.name}</p>
                    </button>
                `).join('');

        })
        .catch(error => console.error('Error al cargar los datos:', error));
}
window.onload = () => fetchData();
