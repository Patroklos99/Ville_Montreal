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

async function fetchDataForDate(date1, date2) {
    debugger
    try {
        const response = await fetch('/contrevenants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({date1, date2}),
        });
        if (response.ok) {
            const responseData = await response.json();
            handleResponseData(responseData);
        } else {
            console.error("Error occured during Date /contrevenants")
        }
    } catch (error) {
        console.error(error);
    }
}


// Function to handle the JSON response data
// function handleResponseData(responseData) {
//     // Assuming resultsContainer is the parent element for your list
//     let resultsContainer = document.getElementById('resultsContainer');
//
//     responseData.forEach(item => {
//         const listItem = document.createElement('li');
//         const unorderedList = document.createElement('ul');
//
//         listItem.innerHTML = `
//               <li>
//         ID: ${item.id_poursuite}<br>
//         Business ID: ${item.buisness_id}<br>
//         Date: ${item.date}<br>
//         Description: ${item.description}<br>
//         Adresse: ${item.adresse}<br>
//         Date Jugement: ${item.date_jugement}<br>
//         Etablissement: ${item.etablissement}<br>
//         Montant: ${item.montant}<br>
//         Proprietaire: ${item.proprietaire}<br>
//         Ville: ${item.ville}<br>
//         Statut: ${item.statut}<br>
//         Date Statut: ${item.date_statut}<br>
//         Categorie: ${item.categorie}<br>
//     </li>
//         `;
//
//         unorderedList.appendChild(listItem);
//         resultsContainer.appendChild(unorderedList);
//     });
// }

function handleResponseData(responseData) {
    // Assuming resultsTable is the table element where the data will be displayed
    let resultsTable = document.getElementById('resultsTable');

    // Clear existing table rows
    resultsTable.innerHTML = '';

    // Create table header
    const tableHeader = document.createElement('tr');
    tableHeader.innerHTML = `
    <th>Etablissement</th>
    <th>Nombre de contraventions</th>
  `;
    resultsTable.appendChild(tableHeader);

    // Create a map to store the count of contraventions for each establishment
    const contraventionCounts = new Map();

    // Iterate over the responseData and count the contraventions for each establishment
    responseData.forEach(item => {
        const establishment = item.etablissement;
        if (contraventionCounts.has(establishment)) {
            contraventionCounts.set(establishment, contraventionCounts.get(establishment) + 1);
        } else {
            contraventionCounts.set(establishment, 1);
        }
    });

    // Iterate over the contraventionCounts and create table rows
    contraventionCounts.forEach((count, establishment) => {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
      <td>${establishment}</td>
      <td>${count}</td>
    `;
        resultsTable.appendChild(tableRow);
    });
}

// const searchForm = document.getElementById('searchForm');
const searchFormD = document.getElementById('searchFormDate');
const closeButton = document.getElementById('closeButton');
const resultsTable = document.getElementById('resultsTable');
const rechercherButton = document.querySelector('#searchFormDate button[type="submit"]');
let isResultsTableVisible = true;

function handleSearchFormDateSubmit(event) {
    debugger
    event.preventDefault();
    const date1 = document.getElementById('date1').value;
    const date2 = document.getElementById('date2').value;
    fetchDataForDate(date1, date2);
    resultsTable.style.display = 'block';
    isResultsTableVisible = true;
}

// searchForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     const searchCriteria = document.getElementById('search-criteria').value;
//     const searchInput = document.getElementById('search-input').value;
//     fetchData(searchCriteria, searchInput);
// });

searchFormD.addEventListener('submit', handleSearchFormDateSubmit);

rechercherButton.addEventListener('click', (event) => {
    if (!isResultsTableVisible) {
        resultsTable.style.display = 'block';
        isResultsTableVisible = true;
    }
});

closeButton.addEventListener('click', (event) => {
    debugger
    event.stopPropagation(); // Stop the event from propagating further
    event.preventDefault();
    resultsTable.style.display = 'none';
    isResultsTableVisible = false;
});
