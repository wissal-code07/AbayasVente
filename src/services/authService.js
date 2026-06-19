import api from "./api";

// ── Inscription ──
export const register = async (data) => {
  const response = await api.post("/users/register/", {
    email:      data.email,
    first_name: data.firstName,
    last_name:  data.lastName,
    phone:      data.phone || "",
    password:   data.password,
    password2:  data.confirmPassword,
  });
  return response.data;
};

// ── Connexion ──
export const login = async (email, password) => {
  const response = await api.post("/users/login/", { email, password });
  const { access, refresh } = response.data;

  // Sauvegarder les tokens
  localStorage.setItem("access_token",  access);
  localStorage.setItem("refresh_token", refresh);

  // Décoder le token pour récupérer les infos user
  const payload = JSON.parse(atob(access.split(".")[1]));
  const user = {
    id:         payload.user_id,
    email:      payload.email,
    firstName:  payload.first_name,
    lastName:   payload.last_name,
    is_staff:   payload.is_staff,   // ← corrigé
  };
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

// ── Déconnexion ──
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

// ── Récupérer l'utilisateur connecté ──
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ── Vérifier si connecté ──
export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

// ── Récupérer le profil depuis l'API ──
export const getProfile = async () => {
  const response = await api.get("/users/profile/");
  return response.data;
};

// ── Mettre à jour le profil ──
export const updateProfile = async (data) => {
  const response = await api.patch("/users/profile/", {
    first_name: data.firstName,
    last_name:  data.lastName,
    phone:      data.phone,
  });
  return response.data;
};

// ── Changer le mot de passe ──
export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.post("/users/change-password/", {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return response.data;
};

// ── Adresses ──
export const getAddresses = async () => {
  const response = await api.get("/users/addresses/");
  return response.data;
};

export const createAddress = async (data) => {
  const response = await api.post("/users/addresses/", data);
  return response.data;
};

export const updateAddress = async (id, data) => {
  const response = await api.patch(`/users/addresses/${id}/`, data);
  return response.data;
};

export const deleteAddress = async (id) => {
  await api.delete(`/users/addresses/${id}/`);
};

export const setDefaultAddress = async (id) => {
  const response = await api.post(`/users/addresses/${id}/set-default/`);
  return response.data;
};