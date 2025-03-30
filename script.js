const toast = document.getElementById('toast');

 const today = new Date();
 const thirtyDaysLater = new Date();
 thirtyDaysLater.setDate(today.getDate() + 30);
 
 const expiringInThirtyDays = inventoryData.filter(item => {
     const expiryDate = new Date(item.expiryDate);
     return expiryDate <= thirtyDaysLater;
 });
 
 expiringInThirtyDays.forEach(item => {
     const alertItem = document.createElement('li');
     alertItem.className = 'alert-item expiring';
     
     const expiryDate = new Date(item.expiryDate);
     const formattedDate = expiryDate.toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric'
     });
     
     alertItem.innerHTML = `
         <div class="alert-title">Expiring Inventory</div>
         <div class="alert-info">${item.name} - ${item.stock} units</div>
         <div class="alert-info">Expires on ${formattedDate}</div>
     `;
     alertsList.appendChild(alertItem);
 });

function showToast() {
 toast.style.display = 'block';
 
 setTimeout(() => {
     toast.style.display = 'none';
 }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
const addMedicationForm = document.getElementById('addMedicationForm');

addMedicationForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const medicationName = document.getElementById('newMedicationName').value.trim();
    const medicationStock = parseInt(document.getElementById('newMedicationStock').value);
    const medicationThreshold = parseInt(document.getElementById('newMedicationThreshold').value);
    const medicationExpiry = document.getElementById('newMedicationExpiry').value;
    
    if (!medicationName || isNaN(medicationStock) || isNaN(medicationThreshold) || !medicationExpiry) {
        alert('Please fill in all fields correctly.');
        return;
    }
    
    const medicationData = {
        name: medicationName,
        stock: medicationStock,
        threshold: medicationThreshold,
        expiryDate: medicationExpiry,
        dateAdded: new Date().toISOString()
    };
    
    let medications = [];
    try {
        const storedMedications = localStorage.getItem('medications');
        medications = storedMedications ? JSON.parse(storedMedications) : [];
        
        if (!Array.isArray(medications)) {
            medications = [];
        }
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        medications = [];
    }
    
    medications.push(medicationData);
    
    try {
        localStorage.setItem('medications', JSON.stringify(medications));
        console.log('Medication saved successfully:', medicationData);
        console.log('Current medications in storage:', medications);
        
        alert('Medication added successfully!');
        
        addMedicationForm.reset();
        
        updateMedicationList();
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        alert('Error saving medication. Please try again.');
    }
});

updateMedicationList();

const formActions = document.querySelector('.form-actions');
if (formActions) {
    const testButton = document.createElement('button');
    testButton.type = 'button';
    testButton.className = 'btn-test';
    testButton.textContent = 'Test Storage';
    testButton.style.marginLeft = '10px';
    
    testButton.addEventListener('click', function() {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        console.log('Current medications in storage:', medications);
        alert(`Found ${medications.length} medications in storage. Check console for details.`);
    });
    
    formActions.appendChild(testButton);
}
});

function updateMedicationList() {
let medicationListElement = document.getElementById('medicationList');

if (!medicationListElement) {
    const formContainer = document.querySelector('.add-medication-form');
    if (formContainer) {
        medicationListElement = document.createElement('div');
        medicationListElement.id = 'medicationList';
        medicationListElement.className = 'medication-list';
        
        const listTitle = document.createElement('h3');
        listTitle.textContent = 'Current Medications';
        medicationListElement.appendChild(listTitle);
        
        formContainer.parentNode.insertBefore(medicationListElement, formContainer.nextSibling);
    }
}

if (medicationListElement) {
    let medications = [];
    try {
        medications = JSON.parse(localStorage.getItem('medications')) || [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        medications = [];
    }
    
    const listTitle = medicationListElement.querySelector('h3');
    medicationListElement.innerHTML = '';
    if (listTitle) {
        medicationListElement.appendChild(listTitle);
    }
    
    if (medications.length === 0) {
        const noMedsMessage = document.createElement('p');
        noMedsMessage.textContent = 'No medications in the inventory';
        medicationListElement.appendChild(noMedsMessage);
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'medications-table';
    
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Threshold</th>
            <th>Expiry Date</th>
            <th>Actions</th>
        </tr>
    `;
    table.appendChild(tableHeader);
    
    const tableBody = document.createElement('tbody');
    medications.forEach((medication, index) => {
        const row = document.createElement('tr');
        
        const expiryDate = new Date(medication.expiryDate);
        const formattedExpiry = expiryDate.toLocaleDateString();
        
        const stockStatus = medication.stock <= medication.threshold ? 'low-stock' : 'in-stock';
        
        row.innerHTML = `
            <td>${medication.name}</td>
            <td class="${stockStatus}">${medication.stock}</td>
            <td>${medication.threshold}</td>
            <td>${formattedExpiry}</td>
            <td>
                <button class="btn-edit" data-index="${index}">Edit</button>
                <button class="btn-delete" data-index="${index}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    table.appendChild(tableBody);
    medicationListElement.appendChild(table);
    
    const style = document.createElement('style');
    style.textContent = `
        .medications-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .medications-table th, .medications-table td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: left;
        }
        .medications-table th {
            background-color: #f2f2f2;
        }
        .low-stock {
            color: red;
            font-weight: bold;
        }
        .in-stock {
            color: green;
        }
        .btn-edit, .btn-delete {
            margin-right: 5px;
            padding: 3px 8px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
    
    attachMedicationActionListeners();
}
}

function attachMedicationActionListeners() {
document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        deleteMedication(index);
    });
});

document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        editMedication(index);
    });
});
}

function deleteMedication(index) {
if (confirm('Are you sure you want to delete this medication?')) {
    let medications = JSON.parse(localStorage.getItem('medications')) || [];
    medications.splice(index, 1);
    localStorage.setItem('medications', JSON.stringify(medications));
    updateMedicationList();
}
}

function editMedication(index) {
const medications = JSON.parse(localStorage.getItem('medications')) || [];
const medication = medications[index];

document.getElementById('newMedicationName').value = medication.name;
document.getElementById('newMedicationStock').value = medication.stock;
document.getElementById('newMedicationThreshold').value = medication.threshold;
document.getElementById('newMedicationExpiry').value = medication.expiryDate;

const form = document.getElementById('addMedicationForm');
const submitButton = form.querySelector('.btn-submit');

const originalButtonText = submitButton.textContent;

submitButton.textContent = 'Update Medication';

const updateHandler = function(event) {
    event.preventDefault();
    
    const updatedName = document.getElementById('newMedicationName').value.trim();
    const updatedStock = parseInt(document.getElementById('newMedicationStock').value);
    const updatedThreshold = parseInt(document.getElementById('newMedicationThreshold').value);
    const updatedExpiry = document.getElementById('newMedicationExpiry').value;
    
    if (!updatedName || isNaN(updatedStock) || isNaN(updatedThreshold) || !updatedExpiry) {
        alert('Please fill in all fields correctly.');
        return;
    }
    
    medications[index] = {
        name: updatedName,
        stock: updatedStock,
        threshold: updatedThreshold,
        expiryDate: updatedExpiry,
        dateAdded: medication.dateAdded,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('medications', JSON.stringify(medications));
    
    form.reset();
    submitButton.textContent = originalButtonText;
    
    form.removeEventListener('submit', updateHandler);
    
    updateMedicationList();
    
    alert('Medication updated successfully!');
};

form.removeEventListener('submit', updateHandler); 
form.addEventListener('submit', updateHandler);
}