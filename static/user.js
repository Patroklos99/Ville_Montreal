const applyButton = document.getElementById("applyButton-user");

async function fetchAddUsers(establishment) {
    debugger
    try {
        const data = {};

        const response = await fetch(`/user_establishments/${establishment}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const responseData = await response.json();
            // handleFetchDataUser(responseData)
            handleFetchDataUser({message: `New establishment ${establishment} added successfully.`})
            updateEstablishmentsList(responseData.establishments)
        } else {
            const badResponse = await response.json()
            handleFetchDataUser(badResponse)
            console.log('Error occurred during modifyUsers');
        }
    } catch (error) {
        console.error('Error', error);
    }
}

async function fetchDeleteUsers(establishment) {
    debugger
    try {
        const data = {};

        const response = await fetch(`/user_establishments/${establishment}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const responseData = await response.json();
            handleFetchDataUser({message: `Establishment ${establishment} deleted successfully.`})
            updateEstablishmentsList(responseData.establishments)
            return responseData;
        } else {
            const badResponse = await response.json()
            handleFetchDataUser(badResponse)
            console.log('Error occurred during deleteUsers');
        }
    } catch (error) {
        console.error('Error', error);
    }
}


// Function to update the followed establishments list
function updateEstablishmentsList(establishments) {
    debugger
    const establishmentsList = document.getElementById("establishments-list");
    establishmentsList.innerHTML = ""; // Clear the existing list

    establishments.forEach((establishment) => {
        const li = document.createElement("li");
        li.textContent = establishment;
        establishmentsList.appendChild(li);
    });
}


applyButton.addEventListener('click', async (event) => {
    debugger
    event.preventDefault();
    const selectedAction = document.getElementById("dm-criteria-options-user").value;
    const establishment = document.getElementById("establishments-input-user").value;

    if (establishment) {
        if (selectedAction === "Modify") {
            await fetchAddUsers(establishment);
        } else if (selectedAction === "Delete") {
            await fetchDeleteUsers(establishment);
        }

    } else {
        handleFetchDataUser({message: "You must write an Establishment to modify"})
    }
});


function handleFetchDataUser(data) {
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

const uploadButton = document.getElementById("upload-button");
const fileInput = document.getElementById("profile-photo");
const uploadedImage = document.getElementById("uploaded-image");

async function fetchPhotoData(file) {
    const formData = new FormData();
    formData.append("photo", file)
    try {
        const response = await fetch("/upload-photo", {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            const dataResponse = await response.json();
            handleFetchUploadResponse(dataResponse)
        } else {
            console.log("Error occurred during photo upload.");
        }
    } catch (error) {
        console.error("Error", error);
    }
}

function handleFetchUploadResponse(responseData) {
    if (responseData && responseData.imageUrl) {
        // Handle success, e.g., display the uploaded image
        uploadedImage.src = responseData.imageUrl;
        uploadedImage.style.display = "block";
    } else {
        console.log("Invalid response data");
    }
}

uploadedImage.addEventListener("click", (event) => {
    const file = fileInput.files[0]; // Get the selected file
    if (!file) {
        handleFetchDataUser({message: `Please add a valid file`})
    } else {
        fetchPhotoData(file);
    }
});