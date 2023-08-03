let lastForm = "";
document.querySelector("#show-login").addEventListener("click", function () {
    debugger
    document.querySelector(".popup").classList.add("active");
    if (document.querySelector("#quickSearchForm").style.display === "block") {
        lastForm = "quickSearchForm";
    } else if (document.querySelector("#inspection-form").style.display === "block") {
        lastForm = "inspection-form"
    } else {
        lastForm = ""
    }
    document.querySelector("#quickSearchForm").style.display = "none";
    document.querySelector("#inspection-form").style.display = "none"; // Hide the inspection form

});

document.querySelector("#show-signup").addEventListener("click", function () {
    debugger
    document.querySelector(".popup-signup").classList.add("active");
    document.querySelector(".popup").classList.remove("active");
    document.querySelector("#quickSearchForm").style.display = "none";
    document.querySelector("#inspection-form").style.display = "none"; // Hide the inspection form
});

document.querySelector(".popup .close-btn").addEventListener("click", function () {
    debugger
    document.querySelector(".popup").classList.remove("active");
    if (!document.querySelector(".popup-signup").classList.contains("active")) {
        showLastForm(lastForm);
    }
});

document.querySelector(".popup-signup .close-btn").addEventListener("click", function () {
    debugger
    document.querySelector(".popup-signup").classList.remove("active");
    if (!document.querySelector(".popup").classList.contains("active")) {
        showLastForm(lastForm);
    }
});

function showLastForm(lastform) {
    debugger
    if (lastform === "quickSearchForm") {
        document.querySelector("#quickSearchForm").style.display = "block";
        document.querySelector("#inspection-form").style.display = "none"; // hide the inspection form
    } else if (lastform === "inspection-form"){
        document.querySelector("#inspection-form").style.display = "block"; // hide the inspection form
        document.querySelector("#quickSearchForm").style.display = "none";
    }
}


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
    const url = `/contrevenants-restaurant/${date1}/${date2}/${selectedRestaurantValue}`;
    debugger
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
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
            handleMessageResponse(responseData);
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
            handleMessageResponse(responseData);
        } else {
            console.log('Error occurred during deleteLawsuits');
        }
    } catch (error) {
        console.error('Error', error);
    }
}

async function fetchLogin(data) {
    debugger
    try {
        const response = await fetch(`/login/${data.email}/${data.password}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // if (response.redirected) {
        //     window.location.href = response.url; // Redirect to the specified URL
        if (response.ok) {
            // const responseData = await response.json();
            if (!isLoggedIn()) {
                // handleFetchInspectionData(responseData);
                modifyLogin(true);
                window.location.href = "/user"; // Redirect to the user.html page
            } else {
                handleMessageResponse({message: "You have already logged in"});
            }
        } else {
            handleMessageResponse({error: "The password or email are invalid"})
            console.log('Error occurred during login');
        }
    } catch (error) {
        console.error('Error', error);
    }
}


async function fetchDataUser(userData) {
    debugger
    try {
        const response = await fetch('/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const responseData = await response.json();
            handleMessageResponse(responseData);
            document.querySelector(".popup-signup").classList.remove("active");
        } else {
            const erroResponseData = await response.json();
            handleMessageResponse(erroResponseData);
            // document.querySelector(".popup-signup").classList.add("active-sign");
        }
    } catch (error) {
        console.error('Error', error);
    }
}

debugger
// const searchForm = document.getElementById('searchForm');
const searchFormD = document.getElementById('searchFormDate');
const closeButton = document.getElementById('closeButton');
const resultsTable = document.getElementById('resultsTable');
const restaurantList = document.getElementById('restaurant-list');
const applyButton = document.getElementById("applyButton");
const displayFormButton = document.getElementById('quickSearchFormBtn');
const quickSearchForm = document.getElementById('quickSearchForm');
const signinButton = document.getElementById('signin-btn')
const signupButton = document.getElementById('signup-button')
const inspectionRequestButton = document.getElementById("inspectionFormBtn");
const inspectionForm = document.getElementById("inspection-form");
const establishmentsInputLogin = document.getElementById("establishments-input");
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
    } else if (!date1 || !date2) {
        handleMessageResponse({error: "Choose a date"})
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
        handleMessageResponse({message: "You have to log in first"});
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

signinButton.addEventListener("click", async (event) => {
    debugger
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (email && password) {
        const userData = {
            email,
            password
        };
        await fetchLogin(userData);
    } else {
        handleMessageResponse({message: "You have fill in all fields"})
    }
});

signupButton.addEventListener("click", async (event) => {
    debugger
    const full_name = document.getElementById('nom-signup').value;
    const email = document.getElementById('email-signup').value;
    const establishments = document.getElementById('establishments-input').value;
    const password = document.getElementById('password-signup').value;

    if (full_name && email && establishments && password) {
        const userData = {
            full_name,
            email,
            establishments,
            password
        };
        await fetchDataUser(userData);
    } else {
        handleMessageResponse({message: "You have to fill in all the inputs"});
    }
})

function isLoggedIn() {
    return loggedIn;
}

function modifyLogin(status) {
    loggedIn = status;
}

displayFormButton.addEventListener('click', () => {
    if (quickSearchForm.style.display === 'none' || quickSearchForm.style.display === '') {
        quickSearchForm.style.display = 'block';
        inspectionForm.style.display = 'none'; // Hide the inspection form
    } else {
        quickSearchForm.style.display = 'none';
    }
});

inspectionRequestButton.addEventListener("click", function () {
    if (inspectionForm.style.display === "none") {
        inspectionForm.style.display = "block";
        quickSearchForm.style.display = 'none'; // Hide the display form
    } else {
        inspectionForm.style.display = "none";
    }
});

function handleMessageResponse(data) {
    debugger
    if (data && data.error) {
        // Show error message
        Toastify({
            text: data.error,
            duration: 3000,
            close: true,
            gravity: "top",
            backgroundColor: "#ff6b6b" // Set custom background color for error messages
        }).showToast();
    } else if (data && data.message) {
        // Show success message
        Toastify({
            text: data.message,
            duration: 3000,
            close: true,
            gravity: "top",
            backgroundColor: "#6bd9a8" // Set custom background color for success messages
        }).showToast();
    } else {
        console.log("Invalid response data");
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    establishmentsInputLogin.value = "";
    debugger
    const establishments = await fetchEstablishmentsLogin();
    renderEstablishmentsDropdownLogin(establishments);

    const establishmentsDropdownLogin = document.getElementById("establishments-signup");

    establishmentsDropdownLogin.addEventListener("change", (event) => {
        const selectedEstablishment = event.target.value;
        addEstablishmentToInputLogin(selectedEstablishment);
    });
});

async function fetchEstablishmentsLogin() {
    const response = await fetch(`/establishments`);
    const data = await response.json();
    return data.establishments.sort();
}

function renderEstablishmentsDropdownLogin(establishments) {
    const dropdown = document.getElementById("establishments-signup");

    // Clear existing options
    dropdown.innerHTML = "";

    // Create a new option for each establishment
    establishments.forEach((establishment) => {
        const option = document.createElement("option");
        option.value = establishment;
        option.textContent = establishment;
        dropdown.appendChild(option);
    });
}

function addEstablishmentToInputLogin(establishment) {
    establishmentsInputLogin.value += establishment + ", ";
}
