// src/services/authService.js
import axios from 'axios'
import { API_BASE_URL } from '../config'

export const login = async (credentials) => {
  return await axios.post(`${API_BASE_URL}/auth/login`, credentials)
}

export const register = async (userData) => {
  return await axios.post(`${API_BASE_URL}/auth/register`, userData)
}
