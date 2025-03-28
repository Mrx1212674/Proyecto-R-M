// 🔹 Ocultar barra de paginación cuando se muestran personajes de un episodio o ubicación
function showRelatedCharacters(characterIds, previousType) {
    isShowingRelatedCharacters = true;
    document.getElementById('pagination').style.display = 'none'; // Ocultar paginación
    
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `
        <div class="related-characters-container">
            <button class="Boton small-exit-btn" onclick="fetchData('${previousType}', 1)">Exit</button> <!-- 🔹 Botón de salida -->
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

// 🔹 Hacer que los botones "Ver personajes" funcionen correctamente
function showLocationCharacters(characterUrls) {
    const characterIds = characterUrls.split(',').map(url => url.split('/').pop());
    showRelatedCharacters(characterIds, 'location');
}

function showEpisodeCharacters(characterUrls) {
    const characterIds = characterUrls.split(',').map(url => url.split('/').pop());
    showRelatedCharacters(characterIds, 'episode');
}
