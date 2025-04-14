import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// 🔐 Fonction d'inscription
export const register = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData)
  return response.data
}

// 🔑 Fonction de connexion
export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials)
  return response.data
}
