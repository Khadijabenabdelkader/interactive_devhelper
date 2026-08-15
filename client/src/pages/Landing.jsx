import { Link } from "react-router-dom";


export default function Landing(){


return (

<div className="
min-h-screen
bg-slate-950
flex
items-center
justify-center
text-white
">


<div className="
text-center
max-w-3xl
">


<h1 className="
text-6xl
font-bold
text-cyan-400
mb-6
">

DevHelper AI

</h1>


<p className="
text-xl
text-slate-300
mb-10
">

The intelligent platform where developers
create portfolios, improve their code,
and get help from AI.

</p>



<div className="
flex
justify-center
gap-6
">


<Link

to="/register"

className="
bg-cyan-500
px-8
py-4
rounded-xl
font-bold
"

>

Create Account

</Link>



<Link

to="/login"

className="
border
border-cyan-400
px-8
py-4
rounded-xl
"

>

Login

</Link>



</div>


</div>


</div>

);


}