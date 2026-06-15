import api from "./api";

// ── Créer une commande ──
export const createOrder = async (orderData) => {
  // orderData: {
  //   items: [{ product_id, quantity, size, color }],
  //   shipping_name, shipping_address, shipping_city,
  //   shipping_wilaya, shipping_phone,
  //   delivery_method, payment_method, notes
  // }
  const response = await api.post("/orders/", orderData);
  return response.data;
};

// ── Liste des commandes de l'utilisateur ──
export const getOrders = async () => {
  const response = await api.get("/orders/");
  return response.data;
};

// ── Détail d'une commande ──
export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}/`);
  return response.data;
};

// ── Annuler une commande ──
export const cancelOrder = async (id) => {
  const response = await api.post(`/orders/${id}/cancel/`);
  return response.data;
};
