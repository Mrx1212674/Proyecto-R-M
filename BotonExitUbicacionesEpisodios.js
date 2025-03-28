function showRelatedCharacters(characters, previousType) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `
        <button class="Boton" onclick="fetchData('${previousType}', 1)">Exit</button>
        <div class="character-list">
            ${characters.map(characterURL => {
                const characterId = characterURL.split('/').pop();
                return `<button class="character-btn" onclick="showCharacterInfo(${characterId})">
                            <img src="https://rickandmortyapi.com/api/character/avatar/${characterId}.jpeg" alt="Character">
                        </button>`;
            }).join('')}
        </div>
    `;
}

if (type === 'location') {
    outputDiv.innerHTML = data.results.map(location => `
        <div class="card">
            <h3>${location.name}</h3>
            <p><strong>Tipo:</strong> ${location.type}</p>
            <p><strong>Dimensión:</strong> ${location.dimension}</p>
            <p><strong>Residentes:</strong> ${location.residents.length}</p>
            <button class="Boton" onclick="showRelatedCharacters(${JSON.stringify(location.residents)}, 'location')">Ver personajes</button>
        </div>
    `).join('');
} else if (type === 'episode') {
    outputDiv.innerHTML = data.results.map(episode => `
        <div class="card">
            <h3>${episode.name}</h3>
            <p><strong>Fecha de emisión:</strong> ${episode.air_date}</p>
            <p><strong>Episodio:</strong> ${episode.episode}</p>
            <p><strong>Personajes:</strong> ${episode.characters.length}</p>
            <button class="Boton" onclick="showRelatedCharacters(${JSON.stringify(episode.characters)}, 'episode')">Ver personajes</button>
        </div>
    `).join('');
}
