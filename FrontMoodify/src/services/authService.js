// src/services/authService.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api' // 🔁 change si tu es en production

export const login = async (credentials) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
  return res.data // ✅ très important pour simplifier la gestion du token
}

export const register = async (userData) => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, userData)
  return res.data
}
