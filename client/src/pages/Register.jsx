import {
useState
}
from "react";


import {
register
}
from "../services/authService";


import {
useNavigate
}
from "react-router-dom";



export default function Register(){


const navigate=useNavigate();



const [form,setForm]=useState({

name:"",
email:"",
password:""

});



const submit=async(e)=>{


e.preventDefault();



await register(form);


navigate("/login");
};



return (

<div className="
min-h-screen
flex
justify-center
items-center
bg-slate-950
">


<form

onSubmit={submit}

className="
bg-slate-900
p-8
rounded-2xl
space-y-4
w-96
"

>


<h1 className="
text-3xl
font-bold
text-cyan-400
">

Create Account

</h1>



<input

className="
bg-slate-800
p-3
rounded-xl
w-full
"

placeholder="Name"

onChange={
e=>
setForm({
...form,
name:e.target.value
})
}

/>



<input

className="
bg-slate-800
p-3
rounded-xl
w-full
"

placeholder="Email"

onChange={
e=>
setForm({
...form,
email:e.target.value
})
}

/>



<input

className="
bg-slate-800
p-3
rounded-xl
w-full
"

placeholder="Password"

type="password"

onChange={
e=>
setForm({
...form,
password:e.target.value
})
}

/>



<button

className="
bg-cyan-500
p-3
rounded-xl
w-full
"

>

Register

</button>


</form>


</div>

);


}