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
let cattleData = [];  // Mảng lưu trữ thông tin bò

function addCow() {
    const cowName = document.getElementById('cowName').value;
    const breed = document.getElementById('breed').value;
    const birthDate = document.getElementById('birthDate').value;
    const owner = document.getElementById('owner').value;
    const isPregnant = document.getElementById('isPregnant').checked;
    const inseminationDate = isPregnant ? document.getElementById('inseminationDate').value : null;
    const calvingHistory = document.getElementById('calvingHistory').value;

    // Thêm thông tin bò vào mảng
    cattleData.push({
        cowName,
        breed,
        birthDate,
        owner,
        isPregnant,
        inseminationDate,
        calvingHistory,
    });

    // Cập nhật lại phân tích đàn bò
    updateCattleAnalysis();

    console.log('Cattle added:', cattleData);
}

function updateCattleAnalysis() {
    const totalCows = cattleData.length;
    const pregnantCows = cattleData.filter(cow => cow.isPregnant).length;
    const inseminatedCows = cattleData.filter(cow => cow.inseminationDate && !cow.isPregnant).length;
    const notPregnantCows = cattleData.filter(cow => !cow.isPregnant).length;
    
    // Hiển thị kết quả phân tích
    document.getElementById('cattleAnalysis').innerHTML = `
        <h2>Cattle Analysis</h2>
        <ul>
            <li>Total Cows: ${totalCows}</li>
            <li>Pregnant Cows: ${pregnantCows}</li>
            <li>Inseminated but Not Pregnant: ${inseminatedCows}</li>
            <li>Not Pregnant Cows: ${notPregnantCows}</li>
        </ul>
    `;
}
let cattleData = [];  // Array to store cow information

function addCow() {
    const cowName = document.getElementById('cowName').value;
    const breed = document.getElementById('breed').value;
    const birthDate = document.getElementById('birthDate').value;
    const owner = document.getElementById('owner').value;
    const isPregnant = document.getElementById('isPregnant').checked;
    const inseminationDate = isPregnant ? document.getElementById

