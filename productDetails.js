import { ProductService } from './productService.js';

class ProductDetailsPage {
    constructor() {
        this.productService = new ProductService();
        this.initPage();
    }

    async initPage() {
        const loader = document.getElementById('loading-indicator');
        try {
            // Show loader
            loader.style.display = 'flex';
    
            // Get product ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
    
            if (!productId) {
                this.showErrorMessage('No product ID provided');
                return;
            }
    
            // Fetch product details
            const product = await this.productService.getProductById(productId);
    
            // Populate page with product details
            this.renderProductDetails(product);
        } catch (error) {
            console.error('Error loading product details:', error);
            this.showErrorMessage('Failed to load product details');
        } finally {
            // Hide loader
            loader.style.display = 'none';
        }
    }
    

    renderProductDetails(product) {
        // Update image
        const productImg = document.getElementById('product-img');
        productImg.src = product.image;
        productImg.alt = product.title;

        // Update text details
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('product-category').textContent = `Category: ${product.category}`;
        document.getElementById('product-description').textContent = product.description;

        // Update rating
        document.getElementById('rating-value').innerHTML = `
            ${this.generateStarRating(product.rating.rate)} ${product.rating.rate}
        `;
        document.getElementById('rating-count').textContent = `(${product.rating.count} reviews)`;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        let starHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starHTML += '<i class="fas fa-star text-yellow-500"></i>';
        }

        // Half star
        if (halfStar) {
            starHTML += '<i class="fas fa-star-half-alt text-yellow-500"></i>';
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starHTML += '<i class="far fa-star text-yellow-500"></i>';
        }

        return starHTML;
    }

    showErrorMessage(message) {
        const productDetails = document.getElementById('product-details');
        productDetails.innerHTML = `
            <div class="text-center text-red-600 text-xl">
                <p>${message}</p>
                <a href="index.html" class="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded">Back to Products</a>
            </div>
        `;
    }
}

// Initialize the page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetailsPage();
});