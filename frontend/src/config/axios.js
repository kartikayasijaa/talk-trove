import axios from "axios";

export const ENDPOINT = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const axiosReq = axios.create({
  baseURL: ENDPOINT,
});
