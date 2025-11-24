document.addEventListener("DOMContentLoaded", () => {
  const productListElement = document.getElementById("productList");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const productDetailsModal = document.getElementById("productDetailsModal");
  const closeModalButton = document.getElementById("closeModal");
  const modalProductName = document.getElementById("modalProductName");
  const modalProductImage = document.getElementById("modalProductImage");
  const modalProductDescription = document.getElementById("modalProductDescription");
  const modalProductPrice = document.getElementById("modalProductPrice");
  const modalProductCategory = document.getElementById("modalProductCategory");
  let allProducts = [];
  let allCategories = [];
  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      allProducts = await response.json();
      renderProducts(allProducts);
    } catch (error) {
      productListElement.innerHTML =
        '<p class="text-red-500">Failed to load products. Please try again later.</p>';
    }
  }
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products/categories");
      allCategories = await response.json();
      renderCategories(allCategories);
    } catch (error) {}
  }
  const renderProducts = (products) => {
    productListElement.innerHTML = "";
    if (products.length === 0) {
      productListElement.innerHTML =
        '<p class="text-gray-600 col-span-full text-center">No products found matching your criteria.</p>';
      return;
    }
    products.forEach((product) => {
      const productCard = `
        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow duration-200" data-id="${product.id}">
          <img src="${product.image}" alt="${product.title}" class="w-32 h-32 object-contain mb-4">
          <h3 class="text-lg font-semibold text-center mb-2">${product.title}</h3>
          <p class="text-gray-600 text-sm mb-1 capitalize">${product.category}</p>
          <p class="text-xl font-bold text-gray-800">$${product.price.toFixed(
            2
          )}</p>
        </div>
      `;
      productListElement.innerHTML += productCard;
    });

    attachProductCardListeners();
  };

  const renderCategories = (categories) => {
    categories.forEach((category) => {
      const option = `<option value="${category}">${
        category.charAt(0).toUpperCase() + category.slice(1)
      }</option>`;
      categoryFilter.innerHTML += option;
    });
  };

  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    let filteredProducts = allProducts;

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    renderProducts(filteredProducts);
  }
  const showProductDetails = (product) => {
    modalProductName.textContent = product.title;
    modalProductImage.src = product.image;
    modalProductImage.alt = product.title;
    modalProductDescription.textContent = product.description;
    modalProductPrice.textContent = `$${product.price.toFixed(2)}`;
    modalProductCategory.textContent = `Category: ${
      product.category.charAt(0).toUpperCase() + product.category.slice(1)
    }`;
    productDetailsModal.classList.remove("hidden");
  };
  const attachProductCardListeners = () => {
    document.querySelectorAll("#productList div[data-id]").forEach((card) => {
      card.addEventListener("click", (event) => {
        const productId = event.currentTarget.dataset.id;
        const product = allProducts.find((p) => p.id == productId);
        if (product) {
          showProductDetails(product);
        }
      })
    })
  }
  const initializeApp = () => {
    fetchProducts();
    fetchCategories();
    searchInput.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
    closeModalButton.addEventListener("click", () => {
      productDetailsModal.classList.add("hidden");
    })
    productDetailsModal.addEventListener("click", (event) => {
      if (event.target === productDetailsModal) {
        productDetailsModal.classList.add("hidden");
      }
    })
  }
  initializeApp()
})
