// Declare all variables
let totalInputs = document.querySelectorAll(".total_inputs input");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let title = document.getElementById("title");
let count = document.getElementById("count");
let category = document.getElementById("category");
let createBtn = document.getElementById("create");
let mode = "create"; // default mode is to create a new product
let globalIndex; // to can show the private parameter (i) --> index of the current product
let customMsg = document.querySelector(".customMSG");
let closeBtn = document.querySelector(".customMSG .close");

// Function which calculate the total price
function getTotal() {
  if (price.value !== "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.backgroundColor = "#040";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "#a00d02";
  }
}

// Check if the local storage is empty --> Create the array (productData)
// Check if the local storage is containing items --> locate them at the array (productData)
let productData;
let localStorageProduct = localStorage.getItem("product");
if (localStorageProduct !== null) {
  productData = JSON.parse(localStorageProduct);
} else {
  productData = [];
}

// Create the product when clicking the button
createBtn.addEventListener("click", function () {
  let newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  // Check if the inputs are not empty
  if (
    title.value !== "" &&
    price.value !== "" &&
    category.value !== "" &&
    newPro.count <= 100
  ) {
    // Check the mode (create or update)
    if (mode === "create") {
      // Create prodcts equal to the count number
      if (newPro.count > 1) {
        for (let i = 0; i < newPro.count; i++) {
          productData.push(newPro);
        }
      } else {
        productData.push(newPro);
      }
    } // else --> mode == "update"
    else {
      // Update the product
      productData[globalIndex] = newPro;
      mode = "create";
      createBtn.innerHTML = "Create";
      count.style.display = "block";
    }
    clearData();
  } else {
    customMsg.classList.add("open");
  }

  // Save the data in the local storage
  localStorage.setItem("product", JSON.stringify(productData));
  showData();
});

// Function which clear inputs after a successful add to local storage
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}

// Craete table Row and append the data in it
function showData() {
  getTotal();
  let table = "";
  for (let i = 0; i < productData.length; i++) {
    // (Delete and Update buttons take the (index) of the clicked product as a parameter)
    table += `
    <tr>
      <td>${i + 1}</td>
      <td>${productData[i].title}</td>
      <td>${productData[i].price}</td>
      <td>${productData[i].taxes}</td>
      <td>${productData[i].ads}</td>
      <td>${productData[i].discount}</td>
      <td>${productData[i].total}</td>
      <td>${productData[i].category}</td>
      <td><a href="#" id="update" onclick="updateItem(${i})">update</a></td>
      <td><a href="# id="delete" onclick="deleteItem(${i})">delete</a></td> 
    </tr>
    `;
  }
  document.getElementById("tbody").innerHTML = table;

  // Check if the length of the array > 0 (has products) --> show the delete all button
  let deleteAllBtn = document.getElementById("deleteAll");
  if (productData.length > 0) {
    deleteAllBtn.innerHTML = `
    <button class="deleteAll" onclick="deleteAllItems()">delete all (${productData.length}) </button>
    `;
  } else {
    deleteAllBtn.innerHTML = "";
  }
}
// call this function all the time to show UpToDate data from local storage
showData();

// Delete item
function deleteItem(index) {
  productData.splice(index, 1);
  localStorage.product = JSON.stringify(productData);
  showData();
}

// Delete All Items
function deleteAllItems() {
  productData = [];
  localStorage.clear();
  showData();
}

// Update Item
function updateItem(index) {
  // Showing the data from (the table tr) into the (inputs) again
  title.value = productData[index].title;
  price.value = productData[index].price;
  taxes.value = productData[index].taxes;
  ads.value = productData[index].ads;
  discount.value = productData[index].discount;
  category.value = productData[index].category;
  count.style.display = "none";
  getTotal();
  createBtn.innerHTML = "Update";
  mode = "update";
  globalIndex = index;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// Search Items (Title OR Category)
let searchMode = "title";
function getSearchMode(id) {
  let searchInput = document.getElementById("search");
  if (id === "searchTitle") {
    searchMode = "title";
  } else {
    searchMode = "category";
  }
  searchInput.placeholder = `Search By ${searchMode
    .charAt(0)
    .toUpperCase()}${searchMode.slice(1)} `;

  searchInput.focus();
  searchInput.value = "";
  showData();
}

// Search Functionality
function searchData(value) {
  let table = "";
  for (let i = 0; i < productData.length; i++) {
    if (searchMode === "title") {
      if (productData[i].title.includes(value.toLowerCase())) {
        table += `
        <tr>
          <td>${i}</td>
          <td>${productData[i].title}</td>
          <td>${productData[i].price}</td>
          <td>${productData[i].taxes}</td>
          <td>${productData[i].ads}</td>
          <td>${productData[i].discount}</td>
          <td>${productData[i].total}</td>
          <td>${productData[i].category}</td>
          <td><a href="#" id="update" onclick="updateItem(${i})">update</a></td>
          <td><a href="# id="delete" onclick="deleteItem(${i})">delete</a></td> 
        </tr>
    `;
      }
    } else {
      if (productData[i].category.includes(value.toLowerCase())) {
        table += `
        <tr>
          <td>${i}</td>
          <td>${productData[i].title}</td>
          <td>${productData[i].price}</td>
          <td>${productData[i].taxes}</td>
          <td>${productData[i].ads}</td>
          <td>${productData[i].discount}</td>
          <td>${productData[i].total}</td>
          <td>${productData[i].category}</td>
          <td><a href="#" id="update" onclick="updateItem(${i})">update</a></td>
          <td><a href="# id="delete" onclick="deleteItem(${i})">delete</a></td> 
        </tr>
    `;
      }
    }
  }
  document.getElementById("tbody").innerHTML = table;
}

// Close Pop Up Message
closeBtn.addEventListener("click", function () {
  customMsg.classList.remove("open");
});
