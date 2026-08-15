import axios from "axios";


const API =
"http://localhost:5000/api/auth";



export async function register(userData){

const response =
await axios.post(
`${API}/register`,
userData
);

return response.data;

}



export async function login(userData){

const response =
await axios.post(
`${API}/login`,
userData
);

return response.data;

}