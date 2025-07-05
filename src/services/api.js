import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Node backend ka base URL
});

export default api;