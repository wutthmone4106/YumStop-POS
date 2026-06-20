import axios from 'axios'; // Create an Axios instance with the base URL of the API and a timeout of 10 seconds

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Set the base URL for the API from environment variables
  withCredentials: true, // Include credentials (like cookies) in cross-site requests
  headers: {
    'Content-Type': 'application/json', // Set the default content type for requests to JSON
    Accept: 'application/json', // Set the default accept header to expect JSON responses
  },
});

// API Endpoints
// Authentication
export const login = (data) => instance.post('/api/user/login', data);
export const register = (data) => instance.post('/api/user/register', data);
export const logout = () => instance.post('/api/user/logout');
export const getUserData = () => instance.get('/api/user');

// DASHBOARD
export const getDashboardStats = () => instance.get('/api/dashboard/stats');

// MENU
export const createMenu = (formData) => instance.post('/api/menu', formData, {
    headers: {
        'Content-Type': 'multipart/form-data' // Tells Axios to manage multi-part image structures
    }
});
export const getMenus = () => instance.get('/api/menu');
export const updateMenu = (id, formData) => instance.put(`/api/menu/${id}`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
export const deleteMenu = (id) => instance.delete(`/api/menu/${id}`);

// CATEGORY
export const createCategory = (data) => instance.post('/api/category', data);
export const getCategories = () => instance.get('/api/category');
export const updateCategory = (id, data) => instance.put(`/api/category/${id}`, data);
export const deleteCategory = (id) => instance.delete(`/api/category/${id}`);

// TABLE
export const createTable = (data) => instance.post('/api/table', data);
export const getTables = () => instance.get('/api/table');
export const updateTable = (id, data) => instance.put(`/api/table/${id}`, data);
export const deleteTable = (id) => instance.delete(`/api/table/${id}`);
export const releaseTable = (id) => instance.put(`/api/table/${id}/release`);

// EMPLOYEES 
export const getEmployees = () => instance.get('/api/user/employees');
export const updateEmployee = (id, data) => instance.put(`/api/user/employees/${id}`, data);
export const deleteEmployee = (id) => instance.delete(`/api/user/employees/${id}`);

// Orders
export const addOrder = (orderData) => instance.post('/api/order', orderData);
export const getOrders = () => instance.get('/api/order');
export const updateOrderStatus = (id, orderStatus) => instance.put(`/api/order/${id}`, { orderStatus });

// Workspace
export const getPerformanceMetrics = () => instance.get('/api/user/performance-tracking');
export const getStaffPerformanceData = () => instance.get('/api/user/performance');

