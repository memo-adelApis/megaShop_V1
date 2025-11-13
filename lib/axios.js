import axios from 'axios';

const baseUrl = 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
