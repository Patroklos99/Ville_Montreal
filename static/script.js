async function fetchData(searchCriteria, searchInput) {
    debugger
    try {
        const response = await fetch('/handle_search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({searchCriteria, searchInput}),
        });

        if (response.ok) {
            const responseData = await response.json();

            // Handle the JSON data on the frontend
            handleResponseData(responseData);
        } else {
            console.error("Error occurred during handle_search");
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to handle the JSON response data
function handleResponseData(responseData) {
    // Assuming resultsContainer is the parent element for your list
    let resultsContainer = document.getElementById('resultsContainer');

    responseData.forEach(item => {
        const listItem = document.createElement('li');
        const unorderedList = document.createElement('ul');

        listItem.innerHTML = `
              <li>
        ID: ${item.id_poursuite}<br>
        Business ID: ${item.buisness_id}<br>
        Date: ${item.date}<br>
        Description: ${item.description}<br>
        Adresse: ${item.adresse}<br>
        Date Jugement: ${item.date_jugement}<br>
        Etablissement: ${item.etablissement}<br>
        Montant: ${item.montant}<br>
        Proprietaire: ${item.proprietaire}<br>
        Ville: ${item.ville}<br>
        Statut: ${item.statut}<br>
        Date Statut: ${item.date_statut}<br>
        Categorie: ${item.categorie}<br>
    </li>
        `;

        unorderedList.appendChild(listItem);
        resultsContainer.appendChild(unorderedList);
    });
}

const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchCriteria = document.getElementById('search-criteria').value;
    const searchInput = document.getElementById('search-input').value;
    fetchData(searchCriteria, searchInput);
});