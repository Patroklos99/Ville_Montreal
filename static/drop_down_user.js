const establishmentsDropdown = document.getElementById("establishments-signup-user");
const establishmentsInput = document.getElementById("establishments-input-user");
const buttonApply = document.getElementById("uploaded-image")

// Fetch and render all establishments on page load
window.addEventListener("DOMContentLoaded", async () => {
    debugger
    const establishments = await fetchEstablishments();
    renderEstablishmentsDropdown(establishments);
    establishmentsInput.value = "";
    await fetchProfilePhoto();
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
    buttonApply.value = "";

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

// Function to fetch and display the profile photo
async function fetchProfilePhoto() {
    debugger
    try {
        const response = await fetch("/get_profile_photo"); // Replace with your actual endpoint URL
        if (response.ok) {
            const imageData = await response.json();
            const image = document.getElementById("uploaded-image");
            image.src = imageData.imageUrl;
            image.style.display = "block";
        }
    } catch (error) {
        console.error("Error", error);
    }
}
