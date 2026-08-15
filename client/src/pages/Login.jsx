import {
useState
}
from "react";


import {
login
}
from "../services/authService";


import {
useAuth
}
from "../context/AuthContext";


import {
useNavigate
}
from "react-router-dom";



export default function Login(){


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");



const {
login:saveLogin
}
=
useAuth();



const navigate =
useNavigate();




const submit=async(e)=>{


e.preventDefault();



try{


const data =
await login({

email,

password

});



saveLogin(data);


navigate("/ai");


}

catch(error){

alert(
"Login failed"
);

}


};





return (

<div className="
min-h-screen
flex
items-center
justify-center
bg-slate-950
">


<form

onSubmit={submit}

className="
bg-slate-900
p-8
rounded-2xl
w-96
space-y-5
"

>


<h1 className="
text-3xl
font-bold
text-cyan-400
">

Login

</h1>



<input

className="
w-full
bg-slate-800
p-3
rounded-xl
"

placeholder="Email"

onChange={
e=>setEmail(e.target.value)
}

/>




<input

className="
w-full
bg-slate-800
p-3
rounded-xl
"

placeholder="Password"

type="password"

onChange={
e=>setPassword(e.target.value)
}

/>




<button

className="
bg-cyan-500
w-full
p-3
rounded-xl
"

>

Login

</button>



</form>


</div>

);

}