import axios from 'axios'
import { API_BASE_URL } from '../../../BackMoodify/src/config'

export const login = async (credentials) => {
  return await axios.post(`${API_BASE_URL}/auth/login`, credentials)
}
