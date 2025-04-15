import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export const login = async (credentials) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
  localStorage.setItem('token', res.data.token)
  localStorage.setItem('user', JSON.stringify(res.data.user))
  return res.data
}

export const register = async (userData) => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, userData)
  return res.data
}

export const getSpotifyProfile = async (spotifyId) => {
  if (!spotifyId) throw new Error('Spotify ID non fourni')

  const res = await axios.get(`${API_BASE_URL}/users/me/spotify/${spotifyId}`)
  return res.data
}


export const getProfile = async () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Token non disponible')

  const res = await axios.get(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return res.data
}
