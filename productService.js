// Product class representing the schema of a product
class Product {
  constructor({
    id,
    title,
    price,
    description,
    category,
    image,
    rating
  }) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.category = category;
    this.image = image;
    this.rating = rating;
  }
   
  // Method to display product details
  displayDetails() {
    return `
      Product Details:
      - ID: ${this.id}
      - Title: ${this.title}
      - Price: $${this.price}
      - Category: ${this.category}
      - Rating: ${this.rating.rate} (${this.rating.count} reviews)
    `;
  }
}

// ProductService class to interact with the Fake Store API
class ProductService {
  #baseUrl = 'https://fakestoreapi.com/products';
   
  // Private method to handle fetch requests
  async #fetchData(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.#baseUrl}${endpoint}`, options);
       
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
       
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }
   
  // Method to get all products
  async getProducts() {
    const products = await this.#fetchData('');
    return products.map(productData => new Product(productData));
  }
   
  // Method to get a product by its ID
  async getProductById(id) {
    if (!id) {
      throw new Error('Product ID is required');
    }
     
    const productData = await this.#fetchData(`/${id}`);
    return new Product(productData);
  }
   
  // Method to delete a product
  async deleteProduct(id) {
    if (!id) {
      throw new Error('Product ID is required');
    }
     
    return await this.#fetchData(`/${id}`, {
      method: 'DELETE'
    });
  }
}

export { Product, ProductService };