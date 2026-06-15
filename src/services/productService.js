import api from "./api";

// ── Liste des produits avec filtres ──
export const getProducts = async (params = {}) => {
  // params: { category, color, size, badge, min_price, max_price, search, ordering, page }
  const response = await api.get("/products/", { params });
  return response.data;
  // Retourne: { count, next, previous, results: [...] }
};

// ── Détail d'un produit par slug ──
export const getProduct = async (slug) => {
  const response = await api.get(`/products/${slug}/`);
  return response.data;
};

// ── Produits similaires ──
export const getSimilarProducts = async (slug) => {
  const response = await api.get(`/products/${slug}/similar/`);
  return response.data;
};

// ── Catégories ──
export const getCategories = async () => {
  const response = await api.get("/products/categories/list/");
  return response.data;
};

// ── Couleurs ──
export const getColors = async () => {
  const response = await api.get("/products/colors/list/");
  return response.data;
};

// ── Tailles ──
export const getSizes = async () => {
  const response = await api.get("/products/sizes/list/");
  return response.data;
};
