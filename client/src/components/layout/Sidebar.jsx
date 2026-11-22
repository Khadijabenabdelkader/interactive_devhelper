import {
NavLink
}
from "react-router-dom";


import {

FaRobot,
FaCode,
FaBug,
FaFileAlt,
FaUser

}
from "react-icons/fa";
import { Clock } from "lucide-react";


import { Sparkles } from "lucide-react";
const menu=[


{
name:"AI Chat",
path:"/chat",
icon:<FaRobot/>
},


{
name:"Code Review",
path:"code-review",
icon:<FaCode/>
},


{
name:"Debug Assistant",
path:"debug",
icon:<FaBug/>
},


{
name:"README Generator",
path:"readme",
icon:<FaFileAlt/>
},


{
name:"Portfolio Analyzer",
path:"portfolio",
icon:<FaUser/>
},
{
    name: "History",
    path: "/history",
    icon: <Clock/>
},
{
    name: "AI Center",
    path: "/ai",
    icon: <Sparkles/>
}

];



export default function Sidebar(){


return (

<aside
className="
w-72
bg-slate-900
border-r
border-slate-800
p-6
"
>


<h1
className="
text-3xl
font-bold
text-cyan-400
mb-10
"
>
DevHelper AI
</h1>



<div
className="space-y-3"
>


{

menu.map(item=>(


<NavLink

key={item.name}

to={item.path}

className={({isActive})=>

`
flex
items-center
gap-4
px-4
py-3
rounded-xl
transition

${isActive?
"bg-cyan-500 text-white":
"text-slate-300 hover:bg-slate-800"
}

`

}


>


{item.icon}

{item.name}


</NavLink>


))


}



</div>



</aside>

);

}