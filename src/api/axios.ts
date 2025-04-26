import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// TODO: Add a response interceptor here to navigate to login on unauthorized calls

export default apiClient;