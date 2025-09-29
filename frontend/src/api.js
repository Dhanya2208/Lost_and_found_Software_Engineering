import axios from 'axios';

const API_BASE = "http://localhost:5000/api";

// 🔹 Authentication
export const login = (email, password) => {
  return axios.post(`${API_BASE}/auth/login`, { email, password });
};

export const signup = (name, email, password) => {
  return axios.post(`${API_BASE}/auth/signup`, { name, email, password });
};

// 🔹 Lost & Found Item Reporting
export const reportLostItem = (formData) => {
  return axios.post(`${API_BASE}/items/lost`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const reportFoundItem = (formData) => {
  return axios.post(`${API_BASE}/items/found`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

// 🔹 Dashboard Data
export const getUserLostItems = (userId) => {
  return axios.get(`${API_BASE}/items/lost/${userId}`);
};

export const getUserFoundItems = (userId) => {
  return axios.get(`${API_BASE}/items/found/${userId}`);
};


// ✅ Fetch matches for a lost item
export const getLostItemMatches = (itemId) =>
  axios.get(`${API_BASE}/items/lost/${itemId}/matches`);

// ✅ Fetch matches for a found item
export const getFoundItemMatches = (itemId) =>
  axios.get(`${API_BASE}/items/found/${itemId}/matches`);

export const confirmMatch = (lostId, foundId) => {
  return axios.post(`${API_BASE}/items/match/confirm`, { 
    lost_id: lostId, 
    found_id: foundId 
  });
};

export const markGot = (itemId) => {
  return axios.post(`${API_BASE}/items/markGot`, { 
    id: itemId 
  });
};