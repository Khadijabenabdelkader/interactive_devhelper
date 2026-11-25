import axios from "axios";


const API = `${import.meta.env.VITE_API_URL}/api/projects`;



function config(){

return {

headers:{

Authorization:
`Bearer ${localStorage.getItem("token")}`

}

};

}




export async function getProjects(){

const res=
await axios.get(
API,
config()
);


return res.data;

}




export async function addProject(data){


const res=
await axios.post(
API,
data,
config()
);


return res.data;


}





export async function deleteProject(id){


return axios.delete(

`${API}/${id}`,

config()

);


}