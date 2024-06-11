// Define which fields to show from each endpoint.
const endpointFields = {
    website_1: ['id', 'login', 'password', 'phone', '2FA', 'functional'],
    website_2: ['id', 'login', 'password', 'phone', 'email'],
    website_3: ['id', 'login', 'password', 'joined'],
};

// Variable to keep track of the currently selected td.
let selectedTd = null;

// Function to fetch data from the server.
function fetchData(name = '', category = '') {
    const url = `/${category}?search=${name}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayData(data, category);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to show the copied to clipboard popup.
function showPopup() {
    const popup = document.getElementById('popup');
    popup.textContent = "Copied to clipboard";
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 1000);
}

// Function to copy text to clipboard.
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Copied to clipboard:', text);
        showPopup();
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

// Function to display data in the table.
function displayData(data, category) {
    const tableBody = document.getElementById('passwordsTableBody');
    const tableHeader = document.getElementById('tableHeader');
    tableBody.innerHTML = '';
    tableHeader.innerHTML = ''; // Clear existing table header.

    const fields = endpointFields[category];
    const headerRow = document.createElement('tr');
    fields.forEach(field => {
        const th = document.createElement('th');
        th.textContent = field; // Use textContent to avoid unintended whitespace.
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);

    data.forEach(item => {
        const row = document.createElement('tr');
        fields.forEach(field => {
            const td = document.createElement('td');
            // Ensure item[field] is trimmed and converted to a string if not null/undefined.
            td.textContent = item[field] ? item[field].toString().trim() : '';
            // Add click event listener to copy text to clipboard.
            td.addEventListener('click', () => {
                copyToClipboard(td.textContent);
                highlightTd(td);
            });
            row.appendChild(td);
        });
        tableBody.appendChild(row);
    });
}

// Function to highlight the clicked td.
function highlightTd(td) {
    if (selectedTd) {
        selectedTd.classList.remove('selected');
    }
    selectedTd = td;
    selectedTd.classList.add('selected');
}

// Function to handle the change of category (endpoint).
function changeCategory() {
    const searchCategory = document.getElementById('searchCategory');
    const selectedCategory = searchCategory.value;
    const name = document.getElementById('name').value;
    fetchData(name, selectedCategory);
}

// Add event listener to the form submission.
document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior.
        const name = document.getElementById('name').value;
        const searchCategory = document.getElementById('searchCategory').value;
        fetchData(name, searchCategory);
    });

    // Make an initial GET request to fetch default data when the page loads.
    const initialCategory = document.getElementById('searchCategory').value;
    fetchData('', initialCategory);
});