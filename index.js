import { ProductService } from './productService.js';

class ProductApp {
    constructor() {
        this.productService = new ProductService();
        this.productList = document.getElementById('product-list');
        this.prevPageBtn = document.getElementById('prev-page');
        this.nextPageBtn = document.getElementById('next-page');

        this.currentPage = 1;
        this.productsPerPage = 10;
        this.allProducts = [];

        this.initEventListeners();
        this.loadProducts();
    }

    initEventListeners() {
        this.prevPageBtn.addEventListener('click', () => this.changePage(-1));
        this.nextPageBtn.addEventListener('click', () => this.changePage(1));
    }

    async loadProducts() {
        try {
            this.allProducts = await this.productService.getProducts();
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    renderProducts() {
        // Clear previous products
        this.productList.innerHTML = '';

        // Calculate start and end index for current page
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.allProducts.slice(startIndex, endIndex);

        // Render products
        productsToShow.forEach(product => {
            const productCard = this.createProductCard(product);
            this.productList.appendChild(productCard);
        });

        // Update pagination buttons
        this.updatePaginationButtons();
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'overflow-hidden', 'hover:scale-105', 'transition-transform');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-xl font-bold text-primary mb-2">${product.title}</h3>
                <p class="text-gray-600 font-bold mb-4">$${product.price.toFixed(2)}</p>
                <div class="flex justify-between items-center">
                    <a href="product-details.html?id=${product.id}" class="view-btn px-3 py-2 bg-primary text-white rounded">View Details</a>
                    <button class="delete-btn text-red-500 hover:text-red-700" data-id="${product.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;

        // Add event listener for delete
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            this.deleteProduct(product.id);
        });

        return card;
    }

    async deleteProduct(productId) {
        try {
            await this.productService.deleteProduct(productId);
            
            // Remove the product from the local array
            this.allProducts = this.allProducts.filter(p => p.id !== productId);
            
            // Re-render products
            this.renderProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.allProducts.length / this.productsPerPage);
        
        this.currentPage += direction;
        
        // Ensure page stays within bounds
        this.currentPage = Math.max(1, Math.min(this.currentPage, totalPages));
        
        this.renderProducts();
    }

    updatePaginationButtons() {
        const totalPages = Math.ceil(this.allProducts.length / this.productsPerPage);
        
        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = this.currentPage === totalPages;
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductApp();
});