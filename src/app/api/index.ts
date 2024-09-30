import axios from "axios";

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type',
        
    }
});

api.defaults.withCredentials = true;

export default api; 
