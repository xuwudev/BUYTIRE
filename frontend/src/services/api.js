import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Інтерсептор для додавання токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Інтерсептор для обробки помилок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Товари
export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });
  const response = await api.get(`/products?${params.toString()}`);
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getBrands = async () => {
  const response = await api.get("/products/filters/brands");
  return response.data;
};

export const getPopularProducts = async () => {
  const response = await api.get("/products/featured/popular");
  return response.data;
};

// Автентифікація
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Корзина
export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCartAPI = async (productId, quantity = 1) => {
  const response = await api.post("/cart/add", { productId, quantity });
  return response.data;
};

export const updateCartItemAPI = async (productId, quantity) => {
  const response = await api.put(`/cart/update/${productId}`, { quantity });
  return response.data;
};

export const removeFromCartAPI = async (productId) => {
  const response = await api.delete(`/cart/remove/${productId}`);
  return response.data;
};

export const clearCartAPI = async () => {
  const response = await api.delete("/cart/clear");
  return response.data;
};

// Замовлення
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};

export const getOrderDetails = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/cancel`);
  return response.data;
};

export default api;
