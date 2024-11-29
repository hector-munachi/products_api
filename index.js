import { ProductService } from './productService.js';

class ProductApp {
    constructor() {
        this.productService = new ProductService();
        this.productList = document.getElementById('product-list');
        this.productDetailsModal = document.getElementById('product-details');
        this.singleProductDetails = document.getElementById('single-product-details');
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
        
        this.productDetailsModal.querySelector('.product-details-close')
            .addEventListener('click', () => this.hideProductDetails());
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
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-card-image">
            <div class="product-card-content">
                <h3 class="product-card-title">${product.title}</h3>
                <p class="product-card-price">$${product.price.toFixed(2)}</p>
                <div class="product-card-actions">
                    <a href="#" class="btn btn-view" data-id="${product.id}">View Details</a>
                    <button class="btn-delete" data-id="${product.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;

        // Add event listeners for view and delete
        const viewBtn = card.querySelector('.btn-view');
        const deleteBtn = card.querySelector('.btn-delete');

        viewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showProductDetails(product.id);
        });

        deleteBtn.addEventListener('click', () => {
            this.deleteProduct(product.id);
        });

        return card;
    }

    async showProductDetails(productId) {
        try {
            const product = await this.productService.getProductById(productId);
            
            this.singleProductDetails.innerHTML = `
                <h2>${product.title}</h2>
                <img src="${product.image}" alt="${product.title}" style="max-width: 200px; margin: 20px 0;">
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Description:</strong> ${product.description}</p>
                <p><strong>Rating:</strong> ${product.rating.rate} (${product.rating.count} reviews)</p>
            `;

            this.productDetailsModal.style.display = 'flex';
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    hideProductDetails() {
        this.productDetailsModal.style.display = 'none';
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