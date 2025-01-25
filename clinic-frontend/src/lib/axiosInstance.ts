// lib/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_BASEURL ||"http://allo-api.roopsagar.tech"
});
export default axiosInstance;
