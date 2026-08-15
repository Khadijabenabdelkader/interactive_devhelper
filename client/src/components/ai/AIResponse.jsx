import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function AIResponse({text}){


return (

<div
className="
mt-6
bg-slate-900
rounded-xl
p-6
border
border-slate-800
"
>


<ReactMarkdown
remarkPlugins={[remarkGfm]}
>


{text}


</ReactMarkdown>


</div>

);


}