import {
useState
}
from "react";


import {
FaPaperPlane
}
from "react-icons/fa";



export default function ChatInput({
onSend
}){


const [text,setText]
=
useState("");



const send=()=>{


if(!text.trim())
return;


onSend(text);


setText("");


}



return (

<div

className="
border-t
border-slate-800
p-5
"

>


<div className="
flex
gap-4
">


<input

value={text}

onChange={
e=>setText(e.target.value)
}

onKeyDown={
e=>
e.key==="Enter"&&send()
}

placeholder="
Ask DevHelper AI...
"

className="
flex-1
bg-slate-900
rounded-xl
px-5
py-4
outline-none
"


/>



<button

onClick={send}

className="
bg-cyan-500
px-6
rounded-xl
"

>

<FaPaperPlane/>

</button>


</div>


</div>

)

}