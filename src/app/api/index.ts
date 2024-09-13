import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

console.log('Environment variable BASE_URL:', process.env.BASE_URL);
console.log('BASE_URL being used:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type',
        
    }
});

api.defaults.withCredentials = true;

export default api; 