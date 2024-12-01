function addOwner() {
    // Function to add new owner
    console.log("Add Owner Functionality");
}

function editOwner() {
    // Function to edit existing owner
    console.log("Edit Owner Functionality");
}

function deleteOwner() {
    // Function to delete owner
    console.log("Delete Owner Functionality");
}

function toggleInseminationDate() {
    var isPregnant = document.getElementById('isPregnant').checked;
    var inseminationDateField = document.getElementById('inseminationDateField');
    inseminationDateField.style.display = isPregnant ? 'block' : 'none';
}

function addCow() {
    // Function to add new cow
    console.log("Add Cow Functionality");
}

function editCow() {
    // Function to edit existing cow
    console.log("Edit Cow Functionality");
}

function deleteCow() {
    // Function to delete cow
    console.log("Delete Cow Functionality");
}

// Initialize select options (example)
function initializeOwners() {
    // Populate owner select list with dummy data for demonstration
    const ownerSelect = document.getElementById("owner");
    const options = ['Owner 1', 'Owner 2'];
    options.forEach(function(owner) {
        var opt = document.createElement('option');
        opt.appendChild( document.createTextNode(owner) );
        opt.value = owner;
        ownerSelect.appendChild(opt);
    });
}
window.onload = initializeOwners;
