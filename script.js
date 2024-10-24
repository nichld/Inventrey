// script.js

// Replace with your backend URL
const BASE_URL = 'http://localhost:8000/api';

// Event listeners for tab navigation
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.getAttribute('data-tab');

    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = content.id === tab ? 'block' : 'none';
    });

    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.toggle('active', btn === button);
    });
  });
});

// Load initial data
window.onload = () => {
  loadCustomers();
  loadProducts();
  loadLoans();
  populateLoanForm();
};

// Customers Section
function loadCustomers() {
  fetch(`${BASE_URL}/customers`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#customers-table tbody');
      tbody.innerHTML = '';
      data.data.forEach(customer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${customer._id}</td>
          <td>${customer.fullName}</td>
          <td>${customer.loans.length}</td>
          <td>
            <button onclick="deleteCustomer('${customer._id}')">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error(err));
}

document.getElementById('add-customer').addEventListener('click', () => {
  const fullName = document.getElementById('customer-name').value;
  if (fullName.trim() === '') return alert('Please enter a full name.');

  fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fullName })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Customer added successfully.');
        document.getElementById('customer-name').value = '';
        loadCustomers();
        populateLoanForm();
      } else {
        alert(`Error: ${data.error}`);
      }
    })
    .catch(err => console.error(err));
});

function deleteCustomer(id) {
  if (!confirm('Are you sure you want to delete this customer?')) return;

  fetch(`${BASE_URL}/customers/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Customer deleted successfully.');
        loadCustomers();
        populateLoanForm();
      } else {
        alert(`Error: ${data.error}`);
      }
    })
    .catch(err => console.error(err));
}

// Products Section
function loadProducts() {
  fetch(`${BASE_URL}/products`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#products-table tbody');
      tbody.innerHTML = '';
      data.data.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${product._id}</td>
          <td>${product.name}</td>
          <td>${product.productID}</td>
          <td>${product.available ? 'Yes' : 'No'}</td>
          <td>
            <button onclick="deleteProduct('${product._id}')">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error(err));
}

document.getElementById('add-product').addEventListener('click', () => {
  const name = document.getElementById('product-name').value;
  const productID = document.getElementById('product-id').value;
  if (name.trim() === '' || productID.trim() === '') return alert('Please enter all product details.');

  fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, productID })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Product added successfully.');
        document.getElementById('product-name').value = '';
        document.getElementById('product-id').value = '';
        loadProducts();
        populateLoanForm();
      } else {
        alert(`Error: ${data.error}`);
      }
    })
    .catch(err => console.error(err));
});

function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Product deleted successfully.');
        loadProducts();
        populateLoanForm();
      } else {
        alert(`Error: ${data.error}`);
      }
    })
    .catch(err => console.error(err));
}

// Loans Section
function loadLoans() {
    fetch(`${BASE_URL}/loans`)
      .then(res => res.json())
      .then(data => {
        const tbody = document.querySelector('#loans-table tbody');
        tbody.innerHTML = '';
        data.data.forEach(loan => {
          const customers = loan.customers.map(c => c.fullName).join(', ');
          const products = loan.products.map(p => p.name).join(', ');
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${loan._id}</td>
            <td>${new Date(loan.created).toLocaleString()}</td>
            <td>${customers}</td>
            <td>${products}</td>
            <td>${loan.description}</td>
            <td>
              <button onclick="deleteLoan('${loan._id}')">Delete</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => console.error(err));
  }

function populateLoanForm() {
  // Populate Customers
  fetch(`${BASE_URL}/customers`)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('loan-customers');
      select.innerHTML = '';
      data.data.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer._id;
        option.textContent = customer.fullName;
        select.appendChild(option);
      });
    })
    .catch(err => console.error(err));

  // Populate Products
  fetch(`${BASE_URL}/products`)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('loan-products');
      select.innerHTML = '';
      data.data.forEach(product => {
        if (product.available) {
          const option = document.createElement('option');
          option.value = product._id;
          option.textContent = product.name;
          select.appendChild(option);
        }
      });
    })
    .catch(err => console.error(err));
}

document.getElementById('create-loan').addEventListener('click', () => {
    const customerSelect = document.getElementById('loan-customers');
    const productSelect = document.getElementById('loan-products');
    const description = document.getElementById('loan-description').value;
  
    const customers = Array.from(customerSelect.selectedOptions).map(option => option.value); // IDs
    const products = Array.from(productSelect.selectedOptions).map(option => option.value);   // IDs
  
    if (customers.length === 0 || products.length === 0 || description.trim() === '') {
      return alert('Please select customers, products, and enter a description.');
    }
  
    fetch(`${BASE_URL}/loans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customers, products, description })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Loan created successfully.');
          document.getElementById('loan-description').value = '';
          loadLoans();
          loadProducts();
          populateLoanForm();
        } else {
          alert(`Error: ${data.error}`);
        }
      })
      .catch(err => console.error(err));
  });

function deleteLoan(id) {
  if (!confirm('Are you sure you want to delete this loan?')) return;

  fetch(`${BASE_URL}/loans/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Loan deleted successfully.');
        loadLoans();
        loadProducts();
        populateLoanForm();
      } else {
        alert(`Error: ${data.error}`);
      }
    })
    .catch(err => console.error(err));
}