// 🔹 Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, set, get, remove, onValue } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

// 🔹 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQ4n-PwuEIHqCmVLG3NDaoqRUzO18xNJk",
  authDomain: "furniture-1a77a.firebaseapp.com",
  databaseURL: "https://furniture-1a77a-default-rtdb.firebaseio.com",
  projectId: "furniture-1a77a",
  storageBucket: "furniture-1a77a.firebasestorage.app",
  messagingSenderId: "548304340307",
  appId: "1:548304340307:web:4f6ebe922eb4923acbcda6",
  measurementId: "G-1M7MC35MDB"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const tablesRef = ref(database, 'tables');

// 🔹 Render tables in the HTML
function renderTables(tables) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';

    Object.keys(tables).forEach((key) => {
        const t = tables[key];
        const row = tbody.insertRow();

        row.insertCell(0).innerText = t.name;
        row.insertCell(1).innerText = t.height;
        row.insertCell(2).innerText = t.width;
        row.insertCell(3).innerText = t.length;
        row.insertCell(4).innerText = t.price;

        // تعديل/حذف cell
        const editCell = row.insertCell(5);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'حذف';
        deleteBtn.style.background = '#dc3545';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '6px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.onclick = () => deleteTable(key);

        editCell.appendChild(deleteBtn);
    });
}

// 🔹 Add a new table
export async function addTable() {
    const name = document.getElementById('name').value.trim();
    const height = document.getElementById('height').value.trim();
    const width = document.getElementById('width').value.trim();
    const length = document.getElementById('length').value.trim();
    const priceValue = document.getElementById('price').value.trim();

    if (!name || !height || !width || !length || !priceValue) {
        alert('من فضلك املأ كل البيانات');
        return;
    }

    const tableObj = {
        name,
        height: height + ' سم',
        width: width + ' سم',
        length: length + ' سم',
        price: priceValue + ' جنيه'
    };

    const newKey = new Date().getTime().toString();
    await set(ref(database, 'tables/' + newKey), tableObj);

    // Clear input fields
    document.getElementById('name').value = '';
    document.getElementById('height').value = '';
    document.getElementById('width').value = '';
    document.getElementById('length').value = '';
    document.getElementById('price').value = '';
}

// 🔹 Delete a table
async function deleteTable(key) {
    const confirmDelete = confirm('هل أنت متأكد من حذف هذه الطرابيزة؟');
    if (confirmDelete) {
        await remove(ref(database, 'tables/' + key));
    }
}

// 🔹 Real-time listener to update the table automatically
onValue(tablesRef, (snapshot) => {
    const tables = snapshot.exists() ? snapshot.val() : {};
    renderTables(tables);
});

// 🔹 Make addTable globally accessible for the button
window.addTable = addTable;
