// app.js

const rootElement = document.getElementById('root');

let billExpenses = [];
let billNames = [];
let totalExpense = 0;

function handleBillNameChange(index, value) {
    billNames[index] = value;
}

function handleBillAmountChange(index, value) {
    billExpenses[index] = parseFloat(value);
}

function handleAddBillPerson() {
    billNames.push('');
    billExpenses.push(0);
    renderBill();
}

function handleDeleteBillPerson(index) {
    billNames.splice(index, 1);
    billExpenses.splice(index, 1);
    renderBill();
}

function handleBillSubmit(event) {
    event.preventDefault();

    const totalAmount = billExpenses.reduce((acc, amount) => acc + amount, 0);
    const averageAmount = totalAmount / billExpenses.length;

    const results = billExpenses.map((amount, index) => ({
        name: billNames[index] || `Person ${index + 1}`,
        amount: amount - averageAmount
    }));

    renderBillResults(results);
}

function handleExpenseChange(value) {
    totalExpense += parseFloat(value);
    renderExpense();
}

function handleAddExpense(amount) {
    totalExpense += parseFloat(amount);
    renderExpense();
}

function handleSubmitExpense(event) {
    event.preventDefault();
    const amountInput = document.getElementById('expenseInput');
    handleAddExpense(amountInput.value);
    amountInput.value = '';
}

function renderBill() {
    rootElement.innerHTML = `
    <div class="container">
      <h2>Bill Splitting</h2>
      <form id="billForm">
        <div id="billInputs"></div>
        <button type="submit" class="btn btn-primary">Calculate</button>
        <button type="button" class="btn btn-primary" id="addBillPersonBtn">+ Add Person</button>
      </form>
      <div class="results" id="billResults">
        <h3>Results</h3>
        <ul id="resultsList"></ul>
      </div>
    </div>
  `;

    const billFormElement = document.getElementById('billForm');
    billFormElement.addEventListener('submit', handleBillSubmit);

    const addBillPersonBtn = document.getElementById('addBillPersonBtn');
    addBillPersonBtn.addEventListener('click', handleAddBillPerson);

    renderBillInputs();
}

function renderBillInputs() {
    const billInputsElement = document.getElementById('billInputs');
    billInputsElement.innerHTML = billNames.map((name, index) => `
    <div class="input-group">
      <input type="text" placeholder="Person ${index + 1} Name" value="${name}" oninput="handleBillNameChange(${index}, this.value)">
      <input type="number" placeholder="Amount Spent" value="${billExpenses[index]}" oninput="handleBillAmountChange(${index}, this.value)">
      <button type="button" class="btn btn-danger" onclick="handleDeleteBillPerson(${index})">Delete</button>
    </div>
  `).join('');
}

function renderBillResults(results) {
    const resultsListElement = document.getElementById('resultsList');
    resultsListElement.innerHTML = results.map(result => `
    <li class="list-group-item ${result.amount > 0 ? 'list-group-item-success' : 'list-group-item-danger'}">
      ${result.name}: ${result.amount > 0 ? 'Will Receive' : 'Pending'} ₹${Math.abs(result.amount)} from the group
    </li>
  `).join('');
}

function renderExpense() {
    rootElement.innerHTML += `
    <div class="container">
      <h2>Expense Tracking</h2>
      <form id="expenseForm">
        <input type="number" id="expenseInput" placeholder="Enter Expense">
        <button type="submit" class="btn btn-primary">Add Expense</button>
      </form>
      <div class="results" id="expenseResults">
        <h3>Total Balance</h3>
        <p>₹${totalExpense}</p>
      </div>
    </div>
  `;

    const expenseFormElement = document.getElementById('expenseForm');
    expenseFormElement.addEventListener('submit', handleSubmitExpense);
}

renderBill();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
   navigator.serviceWorker.register('../service-worker.js').then( () => {
    console.log('Service Worker Registered')
   })
 })
}