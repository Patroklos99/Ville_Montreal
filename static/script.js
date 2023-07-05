
async function fetchDataForDate(date1, date2) {
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
            console.log('Error occurred during Date /contrevenants');
        }
    } catch (error) {
        console.error('Error', error);
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

    // Sort the establishment names in alphabetical order
    const establishments = Array.from(contraventionCounts.keys()).sort();

    // Iterate over the sorted establishment names and create table rows
    establishments.forEach(establishment => {
        const count = contraventionCounts.get(establishment);
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
          <td>${establishment}</td>
          <td>${count}</td>
        `;
        resultsTable.appendChild(tableRow);
    });
}

async function fetchDataForDateRestaurant(date1, date2, selectedRestaurantValue) {
    debugger
    const requestData = {
        date1: date1,
        date2: date2,
        restaurant: selectedRestaurantValue
    };

    try {
        const response = await fetch('/contrevenants-restaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            const data = await response.json();
            handleDataForDateRestaurantResponse(data);
        } else {
            console.log('Error during /contrevenants-restaurant request');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function handleDataForDateRestaurantResponse(response) {
    // Handle the response data
    console.log("Response data:", response);

    const resultsTable = document.getElementById("resultsTable");

    resultsTable.innerHTML = '';

    // Get the establishment name (assuming it's the same for all items)
    const establishment = response[0].etablissement;

    // Create the table row for the establishment
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
    <td>
      <strong>Etablissement:</strong> ${establishment}<br><br>
      <ul>
        ${response.map(item => `<li><strong>Date </strong>(${item.date}) :<br> ${item.description}</li><br>`).join('')}
      </ul>
    </td>
  `;

    resultsTable.appendChild(tableRow);
}

async function fetchModifyLawsuits(etablissement) {
    debugger
    try {
        const data = {
            updated_etablissement: etablissement
        };

        const response = await fetch(`/contrevenants/${etablissement}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const responseData = await response.json();
            handleFetchInspectionData(responseData);
        } else {
            console.log('Error occurred during modifyLawsuits');
        }
    } catch (error) {
        console.error('Error', error);
    }
}

async function fetchDeleteLawsuits(etablissement) {
    debugger
    try {
        const response = await fetch(`/contrevenants/${etablissement}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const responseData = await response.json();
            handleFetchInspectionData(responseData);
        } else {
            console.log('Error occurred during deleteLawsuits');
        }
    } catch (error) {
        console.error('Error', error);
    }
}

async function fetchLogin() {
    debugger
    try {
        const response = await fetch(`/login`, {
            method: 'GET',
        });

        if (response.ok) {
            const responseData = await response.json();
            if (!isLoggedIn()) {
                handleFetchInspectionData(responseData);
                modifyLogin(true)
            } else {
                handleFetchInspectionData({message: "You have already logged in"});
            }
        } else {
            console.log('Error occurred during modifyLawsuits');
        }
    } catch (error) {
        console.error('Error', error);
    }
}

// const searchForm = document.getElementById('searchForm');
const searchFormD = document.getElementById('searchFormDate');
const closeButton = document.getElementById('closeButton');
const resultsTable = document.getElementById('resultsTable');
const restaurantList = document.getElementById('restaurant-list');
const applyButton = document.getElementById("applyButton");
const displayFormButton = document.getElementById('displayFormButton');
const hiddenForm = document.getElementById('hiddenForm');
const loginButton = document.getElementById('loginButton')
let isResultsTableVisible = true;
let loggedIn = false;

searchFormD.addEventListener('submit', handleSearchFormSubmit);

function handleSearchFormSubmit(event) {
    debugger
    event.preventDefault();
    const date1 = document.getElementById('date1').value;
    const date2 = document.getElementById('date2').value;
    const selectedRestaurantValue = restaurantList.value;
    if (selectedRestaurantValue && date1 && date2) {
        fetchDataForDateRestaurant(date1, date2, selectedRestaurantValue);
        resultsTable.style.display = 'block';
        isResultsTableVisible = true;
    } else if (!selectedRestaurantValue && date1 && date2) {
        fetchDataForDate(date1, date2);
        resultsTable.style.display = 'block';
        isResultsTableVisible = true;
    }

    const modifyDeleteForm = document.querySelector('.dm-criteria');
    if (selectedRestaurantValue) {
        modifyDeleteForm.style.display = 'none';
        resultsTable.classList.remove('dm-criteria');
    } else if (!selectedRestaurantValue && date1 && date2) {
        modifyDeleteForm.style.display = 'block';
        resultsTable.classList.add('dm-criteria');
    }
}

closeButton.addEventListener('click', (event) => {
    debugger
    event.stopPropagation(); // Stop the event from propagating further
    event.preventDefault();
    resultsTable.style.display = 'none';
    isResultsTableVisible = false;
    const modifyDeleteForm = document.querySelector('.dm-criteria');
    modifyDeleteForm.style.display = "none";
});

applyButton.addEventListener('click', async (event) => {
    debugger
    event.preventDefault();
    const selectedAction = document.getElementById("dm-criteria-options").value;
    const searchInputValue = document.getElementById("md-search-input").value;

    if (!isLoggedIn()) {
        handleFetchInspectionData({message: "You have to log in first"});
        return;
    }

    if (selectedAction === "Modify") {
        fetchModifyLawsuits(searchInputValue)
            .then(() => handleSearchFormSubmit(event))
    } else if (selectedAction === "Delete") {
        fetchDeleteLawsuits(searchInputValue)
            .then(() => handleSearchFormSubmit(event))
    } else {
        console.log("Invalid action selected.");
    }
});

displayFormButton.addEventListener('click', () => {
    if (hiddenForm.style.display === 'none' || hiddenForm.style.display === '') {
        hiddenForm.style.display = 'block';
    } else {
        hiddenForm.style.display = 'none';
    }
});

loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    fetchLogin();
});

function isLoggedIn() {
    return loggedIn;
}

function modifyLogin(status) {
    loggedIn = status;
}

document.querySelector("#show-login").addEventListener("click",function () {
    document.querySelector(".popup").classList.add("active");
});

document.querySelector(".popup .close-btn").addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("active");
})

document.querySelector("#show-signup").addEventListener("click",function () {
    document.querySelector(".popup-signup").classList.add("active");
});

document.querySelector(".popup-signup .close-btn").addEventListener("click", function () {
    document.querySelector(".popup-signup").classList.remove("active");
})
