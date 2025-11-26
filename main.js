document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("productList");
  const searchInput = document.getElementById("searchInput");
  const categoryList = document.getElementById("categoryList");
  const heroSection = document.getElementById("hero-section");
  const categoryHeader = document.getElementById("category-header");
  const categoryTitle = document.getElementById("category-title");
  const prodModal = document.getElementById("productDetailsModal");
  const modalName = document.getElementById("modalProductName");
  const modalImg = document.getElementById("modalProductImage");
  const modalDesc = document.getElementById("modalProductDescription");
  const modalPrice = document.getElementById("modalProductPrice");
  const modalCategory = document.getElementById("modalProductCategory");
  const closeProdModal = document.getElementById("closeModal");

  let allProducts = [];
  let selectedCategory = "all";

  const renderProducts = (products) => {
    productList.innerHTML = "";
    if (products.length === 0) {
        productList.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">No products found.</p>`;
        return;
    }
    products.forEach((p) => {
      const card = document.createElement("div");
      card.className = "product-card bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 flex flex-col items-center text-center group border border-gray-100 cursor-pointer";
      const r = Math.round(p.rating.rate);
      const stars = Array(5).fill(0).map((_, i) => 
        `<svg class="w-4 h-4 ${i < r ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.817 2.05a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.817-2.05a1 1 0 00-1.175 0l-2.817 2.05c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`
      ).join('');
      card.innerHTML = `
        <div class="h-48 w-full flex items-center justify-center mb-4 p-2 bg-gray-50 rounded-lg group-hover:bg-white transition">
            <img src="${p.image}" alt="${p.title}" loading="lazy" class="h-full object-contain mix-blend-multiply">
        </div>
        <h3 class="text-sm font-bold text-gray-800 line-clamp-2 h-10 w-full mb-1">${p.title}</h3>
        <p class="text-xs text-gray-500 capitalize mb-2">${p.category}</p>
        <div class="flex items-center justify-center mb-3">${stars}<span class="ml-1 text-xs text-gray-400">(${p.rating.count})</span></div>
        <p class="font-bold text-lg text-indigo-600 mt-auto">$${p.price.toFixed(2)}</p>
      `;
      card.onclick = () => {
        modalName.textContent = p.title;
        modalImg.src = p.image;
        modalDesc.textContent = p.description;
        modalPrice.textContent = `$${p.price.toFixed(2)}`;
        modalCategory.textContent = p.category;
        prodModal.classList.remove("hidden");
      };
      productList.appendChild(card);
    });
  };

  const renderCategories = (categories) => {
    categoryList.innerHTML = "";
    const list = ['all', ...categories];
    // Uses Flowbite's data-modal-hide attribute on this button to trigger close
    const closeBtn = document.querySelector('[data-modal-hide="categorySelectionModal"]');
    list.forEach(cat => {
      const isAll = cat === 'all';
      const label = isAll ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1);
      const isSelected = selectedCategory === cat;
      const li = document.createElement("li");
      li.innerHTML = `
        <input type="radio" id="${cat}" name="category" value="${cat}" class="hidden peer" ${isSelected ? 'checked' : ''}>
        <label for="${cat}" class="inline-flex items-center justify-between w-full p-4 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-indigo-600 peer-checked:text-indigo-600 peer-checked:bg-indigo-50 hover:bg-gray-100 transition-all">
            <div class="block w-full text-md font-medium">${label}</div>
            <svg class="w-5 h-5 text-indigo-600 opacity-0 peer-checked:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/></svg>
        </label>`;
      li.querySelector('input').addEventListener('change', () => {
        selectedCategory = cat;
        applyFilters(); 
        if(closeBtn) closeBtn.click(); // Manually triggers Flowbite modal close
      });
      categoryList.appendChild(li);
    });
  };

  const applyFilters = () => {
    const term = searchInput.value.toLowerCase().trim();
    const filtered = allProducts.filter(p => 
      p.title.toLowerCase().startsWith(term) && (selectedCategory === "all" || p.category === selectedCategory)
    );
    renderProducts(filtered);
    const isSearching = term.length > 0;
    const isCategorySelected = selectedCategory !== "all";
    if (isCategorySelected) {
        heroSection.classList.add("hidden");
        categoryHeader.classList.remove("hidden");
        categoryTitle.textContent = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    } else if (isSearching) {
        heroSection.classList.add("hidden");
        categoryHeader.classList.add("hidden");
    } else {
        heroSection.classList.remove("hidden");
        categoryHeader.classList.add("hidden");
    }
  };

  productList.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-20 gap-4">
    <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
    <p class="text-gray-500">Loading amazing products...</p>
  </div>`;

  try {
    const [products, categories] = await Promise.all([
        fetch("https://fakestoreapi.com/products").then(res => res.json()),
        fetch("https://fakestoreapi.com/products/categories").then(res => res.json())
    ]);
    allProducts = products;
    renderProducts(products);
    renderCategories(categories);
  } catch (err) {
    productList.innerHTML = `<p class="col-span-full text-center text-red-500">Failed to load data. Please check your connection.</p>`;
    console.error(err);
  }

  searchInput.addEventListener("input", applyFilters);
  closeProdModal.addEventListener("click", () => prodModal.classList.add("hidden"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") prodModal.classList.add("hidden");
  });
  prodModal.addEventListener("click", (e) => {
      if (e.target === prodModal) prodModal.classList.add("hidden");
  });
});