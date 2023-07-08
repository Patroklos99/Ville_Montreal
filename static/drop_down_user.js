const establishmentsDropdown = document.getElementById("establishments-signup-user");
const establishmentsInput = document.getElementById("establishments-input-user");

// Fetch and render all establishments on page load
window.addEventListener("DOMContentLoaded", async () => {
    const establishments = await fetchEstablishments();
    renderEstablishmentsDropdown(establishments);
    establishmentsInput.value = "";
});

establishmentsDropdown.addEventListener("change", (event) => {
    const selectedEstablishment = event.target.value;
    addEstablishmentToInput(selectedEstablishment);
});

async function fetchEstablishments() {
    const response = await fetch(`/establishments`);
    const data = await response.json();
    return data.establishments.sort();
}

function renderEstablishmentsDropdown(establishments) {
    const dropdown = document.getElementById("establishments-signup-user");

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

function addEstablishmentToInput(establishment) {
    establishmentsInput.value = establishment;
}

function clearEstablishmentsDropdown() {
    establishmentsDropdown.innerHTML = "";
}
