import axios from "axios";

export const axiosReq = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});
