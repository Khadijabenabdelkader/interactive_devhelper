import {
useEffect,
useState
}
from "react";


import {
getProjects,
deleteProject
}
from "../services/projectService";


import {
Link
}
from "react-router-dom";



export default function Projects(){


const [projects,setProjects]=useState([]);



useEffect(()=>{

load();

},[]);



async function load(){

const data=
await getProjects();

setProjects(data);

}



async function remove(id){

await removeProject(id);

load();

}



return (

<div>


<div className="
flex
justify-between
mb-8
">


<h1 className="
text-4xl
font-bold
">

My Projects 🚀

</h1>



<Link

to="/dashboard/add-project"

className="
bg-cyan-500
px-5
py-3
rounded-xl
"

>

+ Add Project

</Link>


</div>



<div className="
grid
md:grid-cols-3
gap-6
">


{

projects.map(project=>(


<div

key={project._id}

className="
bg-slate-900
rounded-xl
p-6
"

>


<h2 className="
text-xl
font-bold
text-cyan-400
">

{project.title}

</h2>


<p className="
text-slate-400
mt-3
">

{project.description}

</p>



<button

onClick={()=>remove(project._id)}

className="
bg-red-500
mt-5
px-4
py-2
rounded
"

>

Delete

</button>


</div>


))


}



</div>


</div>

);

}