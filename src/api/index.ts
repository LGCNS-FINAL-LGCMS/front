import axios from "axios";
import qs from "qs";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({});

export default apiClient;
