const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('jwt');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('jwt', token);
        } else {
            localStorage.removeItem('jwt');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth APIs
    async login(credentials) {
        return this.request('/auth/signin', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async register(userData) {
        return this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getUserProfile() {
        return this.request('/api/users/profile');
    }

    // Shop APIs
    async getAllShops() {
        return this.request('/api/shops');
    }

    async searchShops(keyword) {
        return this.request(`/api/shops/search?keyword=${encodeURIComponent(keyword)}`);
    }

    async getShopById(id) {
        return this.request(`/api/shops/${id}`);
    }

    async addToFavorites(shopId) {
        return this.request(`/api/shops/${shopId}/add-favourites`, {
            method: 'PUT',
        });
    }

    // Computer APIs
    async getShopComputers(shopId, filters = {}) {
        const queryParams = new URLSearchParams();
        
        // Add filter parameters
        queryParams.append('gamer', filters.gamer || false);
        queryParams.append('designer', filters.designer || false);
        queryParams.append('developer', filters.developer || false);
        queryParams.append('homeUser', filters.homeUser || false);
        queryParams.append('bussinessPerson', filters.businessUser || false);
        queryParams.append('seasonal', filters.seasonal || false);
        
        if (filters.computer_category) {
            queryParams.append('computer_category', filters.computer_category);
        }

        return this.request(`/api/computer/shop/${shopId}?${queryParams.toString()}`);
    }    async searchComputers(query) {
        return this.request(`/api/computers/search?q=${encodeURIComponent(query)}`);
    }

    // TechGadget APIs
    async getAllTechGadgets() {
        return this.request('/api/techgadget');
    }

    async getTechGadgetsByShop(shopId) {
        return this.request(`/api/techgadget/shop/${shopId}`);
    }

    async getTechGadgetsByCompatibility(type) {
        return this.request(`/api/techgadget/compatibility/${type}`);
    }

    // Cart APIs
    async getCart() {
        return this.request('/api/cart');
    }

    async addToCart(cartItem) {
        return this.request('/api/cart/add', {
            method: 'PUT',
            body: JSON.stringify(cartItem),
        });
    }

    async updateCartItem(updateData) {
        return this.request('/api/cart-item/update', {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    }

    async removeFromCart(itemId) {
        return this.request(`/api/cart-item/${itemId}/remove`, {
            method: 'DELETE',
        });
    }

    async clearCart() {
        return this.request('/api/cart/clear', {
            method: 'PUT',
        });
    }

    // Order APIs
    async createOrder(orderData) {
        return this.request('/api/order', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async getUserOrders() {
        return this.request('/api/order/user');
    }

    // Category APIs
    async getShopCategories() {
        return this.request('/api/category/shop');
    }

    // Admin APIs (for shop owners)
    async createShop(shopData) {
        return this.request('/api/admin/shop', {
            method: 'POST',
            body: JSON.stringify(shopData),
        });
    }

    async updateShop(shopId, shopData) {
        return this.request(`/api/admin/shop/${shopId}`, {
            method: 'PUT',
            body: JSON.stringify(shopData),
        });
    }

    async deleteShop(shopId) {
        return this.request(`/api/admin/shop/${shopId}`, {
            method: 'DELETE',
        });
    }

    async getShopByUserId() {
        return this.request('/api/admin/shop/user');
    }

    async createComputer(computerData) {
        return this.request('/api/admin/computer', {
            method: 'POST',
            body: JSON.stringify(computerData),
        });
    }

    async deleteComputer(computerId) {
        return this.request(`/api/admin/computer/${computerId}`, {
            method: 'DELETE',
        });
    }

    async updateComputerStatus(computerId) {
        return this.request(`/api/admin/computer/${computerId}`, {
            method: 'PUT',
        });
    }

    // Component APIs
    async createComponentCategory(categoryData) {
        return this.request('/api/admin/components/category', {
            method: 'POST',
            body: JSON.stringify(categoryData),
        });
    }

    async createComponent(componentData) {
        return this.request('/api/admin/components', {
            method: 'POST',
            body: JSON.stringify(componentData),
        });
    }

    async getShopComponents(shopId) {
        return this.request(`/api/admin/components/shop/${shopId}`);
    }

    async getShopComponentCategories(shopId) {
        return this.request(`/api/admin/components/shop/${shopId}/category`);
    }

    async updateComponentStock(componentId) {
        return this.request(`/api/admin/components/${componentId}/stock`, {
            method: 'PUT',
        });
    }

    // Order management (for shop owners)
    async getShopOrders(shopId, orderStatus = null) {
        const url = `/api/admin/order/shop/${shopId}${orderStatus ? `?order_status=${orderStatus}` : ''}`;
        return this.request(url);
    }

    async updateOrderStatus(orderId, orderStatus) {
        return this.request(`/api/admin/order/${orderId}/${orderStatus}`, {            method: 'PUT',
        });
    }

    // Search APIs
    async searchComputers(query) {
        return this.request(`/api/computers/search?q=${encodeURIComponent(query)}`);
    }

    // User Profile APIs
    async getUserProfile() {
        return this.request('/api/users/profile');
    }

    async updateUserProfile(profileData) {
        return this.request('/api/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async changePassword(passwordData) {
        return this.request('/api/users/change-password', {
            method: 'PUT',
            body: JSON.stringify(passwordData),
        });
    }

    // Tech Gadgets APIs
    async getAllTechGadgets(params = {}) {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== '') {
                queryParams.append(key, params[key]);
            }
        });
        return this.request(`/api/tech-gadgets?${queryParams.toString()}`);
    }

    async getTechGadgetById(id) {
        return this.request(`/api/tech-gadgets/${id}`);
    }

    async createTechGadget(gadgetData) {
        return this.request('/api/tech-gadgets', {
            method: 'POST',
            body: JSON.stringify(gadgetData),
        });
    }

    async updateTechGadget(id, gadgetData) {
        return this.request(`/api/tech-gadgets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(gadgetData),
        });
    }

    async deleteTechGadget(id) {
        return this.request(`/api/tech-gadgets/${id}`, {
            method: 'DELETE',
        });
    }

    // Shop Owner APIs
    async getShopByOwner() {
        return this.request('/api/shops/my-shop');
    }

    async getShopComputers(shopId) {
        return this.request(`/api/shops/${shopId}/computers`);
    }

    async getShopOrders(shopId) {
        return this.request(`/api/shops/${shopId}/orders`);
    }

    async createComputer(computerData) {
        return this.request('/api/computers', {
            method: 'POST',
            body: JSON.stringify(computerData),
        });
    }

    async updateComputer(id, computerData) {
        return this.request(`/api/computers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(computerData),
        });
    }

    async deleteComputer(id) {
        return this.request(`/api/computers/${id}`, {
            method: 'DELETE',
        });
    }

    // Admin APIs
    async getAllUsers() {
        return this.request('/api/admin/users');
    }

    async getAllOrders() {
        return this.request('/api/admin/orders');
    }

    async getAllCategories() {
        return this.request('/api/categories');
    }

    async blockUser(userId) {
        return this.request(`/api/admin/users/${userId}/block`, {
            method: 'PUT',
        });
    }

    async approveShop(shopId) {
        return this.request(`/api/admin/shops/${shopId}/approve`, {
            method: 'PUT',
        });
    }

    async createCategory(categoryData) {
        return this.request('/api/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData),
        });
    }

    async updateCategory(id, categoryData) {
        return this.request(`/api/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
        });
    }    async deleteCategory(id) {
        return this.request(`/api/categories/${id}`, {
            method: 'DELETE',
        });
    }
}

export const apiService = new ApiService();
export default apiService;
