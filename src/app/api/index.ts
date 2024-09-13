import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type',
        
    }
});

api.defaults.withCredentials = true;

export default api; 