/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  return data.products;
}

// Keep track of selected products using localStorage
let selectedProducts =
  JSON.parse(localStorage.getItem("selectedProducts")) || [];

// Update the list of selected products in the UI and save to localStorage
function updateSelectedList() {
  const container = document.getElementById("selectedProductsList");
  container.innerHTML = selectedProducts
    .map(
      (p, idx) => `
      <div class="selected-tag" data-idx="${idx}">
        ${p.name}
        <button class="remove-tag" title="Remove">&times;</button>
      </div>
    `
    )
    .join("");

  // Add click event to each remove button
  container.querySelectorAll(".remove-tag").forEach((btn, idx) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedProducts.splice(idx, 1);
      updateSelectedList();
      localStorage.setItem(
        "selectedProducts",
        JSON.stringify(selectedProducts)
      );
    });
  });

  // Save the updated list to localStorage
  localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
}

/* 
  Display product cards with Add and Details buttons.
  Add lets users select products for their routine.
  Details opens the modal with product info.
*/
function displayProducts(products, searchTerm = "") {
  // Filter products by search term (checks both name and description)
  const filtered = products.filter((p) =>
    (p.name + p.description).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render product cards with Add and Details buttons
  productsContainer.innerHTML = filtered
    .map(
      (product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <button class="add-btn" data-id="${product.id}">
            ${isRTL ? arabic.add : english.add}
          </button>
          <button class="details-btn" data-id="${product.id}">
            ${isRTL ? arabic.details : english.details}
          </button>
        </div>
      </div>
    `
    )
    .join("");

  // Add event listeners to Add buttons
  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = parseInt(e.target.dataset.id);
      const allProducts = await loadProducts();
      const product = allProducts.find((p) => p.id === productId);
      if (!selectedProducts.some((p) => p.id === productId)) {
        selectedProducts.push(product);
        updateSelectedList();
      }
    });
  });

  // Add event listeners to Details buttons
  document.querySelectorAll(".details-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = parseInt(e.target.dataset.id);
      const allProducts = await loadProducts();
      const product = allProducts.find((p) => p.id === productId);

      // Fill modal with product info
      document.getElementById("modalTitle").textContent = product.name;
      document.getElementById("modalImage").src = product.image;
      document.getElementById("modalImage").alt = product.name;
      document.getElementById("modalDescription").textContent = product.description;

      // Show the modal
      document.getElementById("productModal").classList.remove("hidden");
    });
  });

  // Add event listener to the close button in the modal
  document.getElementById("closeModalBtn").onclick = () => {
    document.getElementById("productModal").classList.add("hidden");
  };
}

// This variable will hold the products filtered by the selected category
let currentFilteredCategoryProducts = [];

// Listen for input in the search bar and filter products by search term
document.getElementById("searchInput").addEventListener("input", (e) => {
  const searchTerm = e.target.value;
  displayProducts(currentFilteredCategoryProducts, searchTerm);
});

// Update currentFilteredCategoryProducts when the category changes
categoryFilter.addEventListener("change", async (e) => {
  const products = await loadProducts();
  const selectedCategory = e.target.value;

  // Filter products by the selected category
  currentFilteredCategoryProducts = products.filter(
    (product) => product.category === selectedCategory
  );
  // Reset search bar
  document.getElementById("searchInput").value = "";
  displayProducts(currentFilteredCategoryProducts);
});

/* 
  Display product cards with Add and Details buttons.
  Add lets users select products for their routine.
  Details opens the modal with product info.
*/
function displayProducts(products, searchTerm = "") {
  // Filter products by search term (checks both name and description)
  const filtered = products.filter((p) =>
    (p.name + p.description).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render product cards with Add and Details buttons
  productsContainer.innerHTML = filtered
    .map(
      (product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <button class="add-btn" data-id="${product.id}">
            ${isRTL ? arabic.add : english.add}
          </button>
          <button class="details-btn" data-id="${product.id}">
            ${isRTL ? arabic.details : english.details}
          </button>
        </div>
      </div>
    `
    )
    .join("");

  // Add event listeners to Add buttons
  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = parseInt(e.target.dataset.id);
      const allProducts = await loadProducts();
      const product = allProducts.find((p) => p.id === productId);
      if (!selectedProducts.some((p) => p.id === productId)) {
        selectedProducts.push(product);
        updateSelectedList();
      }
    });
  });

  // Add event listeners to Details buttons
  document.querySelectorAll(".details-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = parseInt(e.target.dataset.id);
      const allProducts = await loadProducts();
      const product = allProducts.find((p) => p.id === productId);

      // Fill modal with product info
      document.getElementById("modalTitle").textContent = product.name;
      document.getElementById("modalImage").src = product.image;
      document.getElementById("modalImage").alt = product.name;
      document.getElementById("modalDescription").textContent = product.description;

      // Show the modal
      document.getElementById("productModal").classList.remove("hidden");
    });
  });

  // Add event listener to the close button in the modal
  document.getElementById("closeModalBtn").onclick = () => {
    document.getElementById("productModal").classList.add("hidden");
  };
}

// Get references to the chat form and chat window
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");

// Handle chat form submission so users can send messages to the assistant
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the page from reloading

  // Get the user's message from the input field
  const userInput = document.getElementById("userInput").value;

  // Create the messages array for the OpenAI API
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: userInput },
  ];

  // Show a loading message while waiting for the response
  chatWindow.innerHTML = "Thinking...";

  // Send the user's message to your Cloudflare Worker, which talks to OpenAI
  const response = await fetch(
    "https://loreal-routine-builder-worker.samanthasears2002.workers.dev/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    }
  );
  const data = await response.json();

  // Display the assistant's reply in the chat window
  if (data.choices && data.choices[0].message.content) {
    chatWindow.innerHTML = data.choices[0].message.content;
  } else {
    chatWindow.innerHTML = "Sorry, I couldn't get a response.";
  }

  // Clear the chat input field after sending
  document.getElementById("userInput").value = "";
});

// Add event listener for the "Generate Routine" button
document
  .getElementById("generateRoutine")
  .addEventListener("click", async () => {
    // If no products are selected, show a message and stop
    if (selectedProducts.length === 0) {
      chatWindow.innerHTML = "Please select products to build your routine.";
      return;
    }

    // Show a loading message while waiting for the response
    chatWindow.innerHTML = "Generating your personalized routine...";

    // Create the messages array for the OpenAI API
    const messages = [
      {
        role: "system",
        content:
          "You're a skincare and beauty advisor. Recommend a personalized routine based on selected products.",
      },
      {
        role: "user",
        content:
          "Here are the products I selected: " +
          selectedProducts.map((p) => p.name).join(", "),
      },
    ];

    // Send the request to your Cloudflare Worker (which talks to OpenAI)
    const response = await fetch(
      "https://loreal-routine-builder-worker.samanthasears2002.workers.dev/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      }
    );

    // Get the response data
    const data = await response.json();

    // Show the routine or an error message
    chatWindow.innerHTML =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a routine.";
  });

// Arabic translation for subtitle and modal fields
const arabic = {
  subtitle: "مستشار الروتين الذكي ومنتجات لوريال",
  details: "تفاصيل",
  add: "إضافة",
  close: "إغلاق",
  generate: "إنشاء روتين",
  selectCategory: "اختر فئة",
  categories: [
    "منظفات",
    "مرطبات وعلاجات",
    "العناية بالشعر",
    "مكياج",
    "تلوين الشعر",
    "تصفيف الشعر",
    "العناية بالرجل",
    "واقي الشمس",
    "عطر",
  ],
  selectedProducts: "المنتجات المختارة",
  chatHeading: "لنقم ببناء روتينك",
  send: "إرسال",
};

const english = {
  subtitle: "Smart Routine & Product Advisor",
  details: "Details",
  add: "Add",
  close: "Close",
  generate: "Generate Routine",
  selectCategory: "Choose a Category",
  categories: [
    "Cleansers",
    "Moisturizers & Treatments",
    "Haircare",
    "Makeup",
    "Hair Color",
    "Hair Styling",
    "Men's Grooming",
    "Suncare",
    "Fragrance",
  ],
  selectedProducts: "Selected Products",
  chatHeading: "Let's Build Your Routine",
  send: "Send",
};
let isRTL = false;

/* Check browser language and set RTL/Arabic by default if it's Arabic */
const browserLanguage = navigator.language || navigator.userLanguage;
const isArabic = browserLanguage.startsWith("ar");
if (isArabic) {
  isRTL = true;
  document.body.classList.add("rtl");
}

/* 
  Set initial subtitle text based on the default language.
  This will be updated on page load and when toggling RTL.
*/
document.getElementById("subtitle").textContent = isArabic
  ? "مستشار المنتجات والروتين الذكي"
  : "Smart Routine and Product Advisor";

/* Helper to get current language text */
function t(key) {
  return isRTL ? arabic[key] : english[key];
}

// Update all static text on the page when toggling RTL/Arabic
function updateStaticText() {
  // Update subtitle/heading
  document.getElementById("subtitle").textContent = t("subtitle");

  // Update Generate Routine button
  document.getElementById("generateRoutineLabel").textContent = t("generate");

  // Update Selected Products heading
  document.getElementById("selectedProductsHeading").textContent =
    t("selectedProducts");

  // Update Chat heading
  document.getElementById("chatHeading").textContent = t("chatHeading");

  // Update Send button in chat form
  document.getElementById("sendBtn").textContent = t("send");

  // Update Choose a Category option
  document.getElementById("chooseCategoryOption").textContent =
    t("selectCategory");

  // Update category dropdown options
  const options = document.querySelectorAll(
    "#categoryFilter option:not(#chooseCategoryOption)"
  );
  const cats = t("categories");
  options.forEach((opt, idx) => {
    opt.textContent = cats[idx];
  });
}

// Update subtitle based on language
function updateSubtitle() {
  document.querySelector(".site-title").textContent = t("subtitle");
}

// Modal logic
const modal = document.getElementById("productModal");

// Function to show the modal
function showModal(product) {
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" aria-label="${t("close")}">&times;</button>
      <img src="${product.image}" alt="${
    product.name
  }" style="width:100px;display:block;margin:0 auto 16px;">
      <h3>${product.name}</h3>
      <p style="font-weight:bold;">${product.brand}</p>
      <p style="margin:16px 0;">${product.description}</p>
      <button class="add-product-modal" data-id="${product.id}">${t(
    "add"
  )}</button>
    </div>
  `;
  modal.classList.remove("hidden");

  // Close modal on X click or background click
  modal.querySelector(".modal-close").onclick = () =>
    modal.classList.add("hidden");
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  };

  // Add product from modal
  modal.querySelector(".add-product-modal").onclick = async (e) => {
    const productId = parseInt(e.target.dataset.id);
    const products = await loadProducts();
    const product = products.find((p) => p.id === productId);
    if (!selectedProducts.some((p) => p.id === productId)) {
      selectedProducts.push(product);
      updateSelectedList();
    }
    modal.classList.add("hidden");
  };
}

// Update displayProducts to use modal for details
function displayProducts(products) {
  // Render product cards with Add and Details buttons
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <button class="add-btn" data-id="${product.id}">
          ${isRTL ? arabic.add : english.add}
        </button>
        <button class="details-btn" data-id="${product.id}">
          ${isRTL ? arabic.details : english.details}
        </button>
      </div>
    </div>
  `
    )
    .join("");

  // Add event listeners to Add buttons
  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = parseInt(e.target.dataset.id);
      const allProducts = await loadProducts();
      const product = allProducts.find((p) => p.id === productId);
      if (!selectedProducts.some((p) => p.id === productId)) {
        selectedProducts.push(product);
        updateSelectedList();
      }
    });
  });

  // Add event listeners to Details buttons
  document.querySelectorAll(".details-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = parseInt(e.target.dataset.id);
      const allProducts = await loadProducts();
      const product = allProducts.find((p) => p.id === productId);

      // Fill modal with product info
      document.getElementById("modalTitle").textContent = product.name;
      document.getElementById("modalImage").src = product.image;
      document.getElementById("modalImage").alt = product.name;
      document.getElementById("modalDescription").textContent = product.description;

      // Show the modal
      document.getElementById("productModal").classList.remove("hidden");
    });
  });

  // Add event listener to the close button in the modal
  document.getElementById("closeModalBtn").onclick = () => {
    document.getElementById("productModal").classList.add("hidden");
  };
}

/* RTL toggle: switch direction and language */
document.getElementById("toggleRTL").addEventListener("click", () => {
  isRTL = !isRTL;
  document.body.classList.toggle("rtl", isRTL);

  // Update all static text
  updateStaticText();

  // Re-render products to update button text and direction
  const selectedCategory = categoryFilter.value;
  if (selectedCategory) {
    loadProducts().then((products) => {
      displayProducts(products.filter((p) => p.category === selectedCategory));
    });
  }
  updateSelectedList();
});

// Update static text on page load
window.addEventListener("DOMContentLoaded", updateStaticText);

// Update selected products list when the page loads
window.addEventListener("load", updateSelectedList);

// This function searches the L'Oréal web using your Cloudflare Worker.
// It takes a search query as input and returns an array of results.
async function searchLorealWeb(query) {
  // Send a GET request to your Cloudflare Worker with the search query
  const response = await fetch(
    `https://your-cloudflare-worker.com/search?q=${encodeURIComponent(query)}`
  );
  // Parse the JSON response
  const data = await response.json();
  // Return the results array (each result should have title, snippet, and url)
  return data.results; // Example: [{ title, snippet, url }]
}
