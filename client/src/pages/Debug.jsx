import {useState} from "react";

import {debugError} from "../services/aiService";

import AIResponse from "../components/ai/AIResponse";


export default function Debug(){


const [error,setError]=useState("");

const [answer,setAnswer]=useState("");



return (

<div>

<h1 className="text-4xl mb-8 font-bold">
🐞 Debug Assistant
</h1>


<textarea

className="w-full h-40 bg-slate-900 p-5 rounded-xl"

placeholder="Paste error..."

onChange={
e=>setError(e.target.value)
}

/>


<button

className="bg-cyan-500 px-6 py-3 mt-4 rounded-xl"

onClick={async()=>{

setAnswer(
await debugError(error)
);

}}

>
Debug

</button>


{
answer &&
<AIResponse text={answer}/>
}


</div>


);


}