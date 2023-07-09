
const inspectionFormn = document.getElementById('inspection-form');
inspectionFormn.addEventListener('submit', (event) => {
    debugger
    event.preventDefault(); // Prevent the form from submitting normally

    // Collect form data
    const establishment = document.getElementById('establishment').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const visitDate = document.getElementById('visit-date').value;
    const clientName = document.getElementById('client-name').value;
    const clientSurname = document.getElementById('client-surname').value;
    const description = document.getElementById('description').value;

    // Construct the JSON payload
    const data = {
        etablissement: establishment,
        adresse: address,
        ville: city,
        date_visite: visitDate,
        client_nom: clientName,
        client_prenom: clientSurname,
        description_probleme: description
    };
    fetchInspectionData(data);
});

async function fetchInspectionData(data) {
    debugger
    try {
        const response = await fetch('/demande-inspection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const data = await response.json();
            handleFetchInspectionData(data);
        } else {
            console.log('Error during /demande-inspection request');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function handleFetchInspectionData(data) {
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

