import {
Outlet
}
from "react-router-dom";


import Sidebar from "./Sidebar";
import Navbar from "./Navbar";


export default function MainLayout(){


return (

<div
className="
flex
h-screen
bg-slate-950
"
>


<Sidebar/>


<div
className="
flex-1
flex
flex-col
"
>


<Navbar/>


<main
className="
flex-1
overflow-auto
p-8
"
>

<Outlet/>


</main>


</div>


</div>

);

}