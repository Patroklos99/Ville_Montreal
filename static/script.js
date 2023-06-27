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

function fetchDataForDateRestaurant(date1, date2, selectedRestaurantValue) {
  const requestData = {
    date1: date1,
    date2: date2,
    restaurant: selectedRestaurantValue
  };

  fetch('/contrevenants-restaurant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => handleDataForDateRestaurantResponse(data))
  .catch(error => {
    console.error('Error:', error);
  });
}

// const searchForm = document.getElementById('searchForm');
const searchFormD = document.getElementById('searchFormDate');
const closeButton = document.getElementById('closeButton');
const resultsTable = document.getElementById('resultsTable');
const restaurantList = document.getElementById('restaurant-list');
let isResultsTableVisible = true;

function handleSearchFormDateSubmit(event) {
    debugger
    event.preventDefault();
    const date1 = document.getElementById('date1').value;
    const date2 = document.getElementById('date2').value;
    const selectedRestaurantValue = restaurantList.value;
    if (restaurantList) {
        fetchDataForDateRestaurant(date1, date2, selectedRestaurantValue);
    } else {
        fetchDataForDate(date1, date2);
        resultsTable.style.display = 'block';
        isResultsTableVisible = true;
    }
}

// searchForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     const searchCriteria = document.getElementById('search-criteria').value;
//     const searchInput = document.getElementById('search-input').value;
//     fetchData(searchCriteria, searchInput);
// });

searchFormD.addEventListener('submit', handleSearchFormDateSubmit);

closeButton.addEventListener('click', (event) => {
    debugger
    event.stopPropagation(); // Stop the event from propagating further
    event.preventDefault();
    resultsTable.style.display = 'none';
    isResultsTableVisible = false;
});
