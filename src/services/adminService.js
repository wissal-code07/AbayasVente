// src/services/adminService.js
import api from "./api";

// ── Dashboard ──
export const getAdminStats = async () => {
  const response = await api.get("/admin/stats/");
  return response.data;
};

export const getRevenueData = async () => {
  const response = await api.get("/admin/revenue/");
  return response.data;
};

// ── Commandes ──
export const getAdminOrders = async (params = {}) => {
  const response = await api.get("/admin/orders/", { params });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/admin/orders/${orderId}/`, { status });
  return response.data;
};

// ── Produits ──
export const getAdminProducts = async (params = {}) => {
  const response = await api.get("/admin/products/", { params });
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("/admin/products/", productData);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.patch(`/admin/products/${productId}/`, productData);
  return response.data;
};

export const toggleProductStatus = async (productId, isActive) => {
  const response = await api.patch(`/admin/products/${productId}/`, { is_active: isActive });
  return response.data;
};

// ── Clients ──
export const getAdminClients = async (params = {}) => {
  const response = await api.get("/admin/users/", { params });
  return response.data;
};

export const toggleClientStatus = async (userId, isActive) => {
  const response = await api.patch(`/admin/users/${userId}/toggle/`, { is_active: isActive });
  return response.data;
};

// ── Images produit ──
export const getProductImages = async (productId) => {
  const response = await api.get(`/admin/products/${productId}/images/`);
  return response.data;
};

export const uploadProductImage = async (productId, imageFile, isPrimary = false) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('is_primary', isPrimary.toString());
  const response = await api.post(`/admin/products/${productId}/images/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProductImage = async (imageId) => {
  const response = await api.delete(`/admin/images/${imageId}/delete/`);
  return response.data;
};

// ── Catégories, Couleurs, Tailles ──
export const getCategories = async () => {
  const response = await api.get("/products/categories/list/");
  return response.data;
};

export const getColors = async () => {
  const response = await api.get("/products/colors/list/");
  return response.data;
};

export const getSizes = async () => {
  const response = await api.get("/products/sizes/list/");
  return response.data;
};