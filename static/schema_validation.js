
const inspectionForm = document.getElementById('inspection-form');
inspectionForm.addEventListener('submit', (event) => {
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
    // Show the toast notification
    Toastify({
        text: data.message,
        duration: 3000, // Duration in milliseconds (e.g., 3000 = 3 seconds)
        close: true, // Show a close button to manually close the notification
        gravity: "top", // Position the notification at the top of the screen
        // You can customize other options like background color, font color, etc.
    }).showToast();
}

