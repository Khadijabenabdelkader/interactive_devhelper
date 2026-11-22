import {
    MessageSquare,
    Code2,
    Bug,
    FileText,
    BarChart3,
    Sparkles
} from "lucide-react";

import { useNavigate } from "react-router-dom";


const tools = [

    {
        title: "AI Chat",
        description: "Discuss programming ideas with your AI assistant.",
        icon: MessageSquare,
        path: "/chat"
    },

    {
        title: "Code Reviewer",
        description: "Analyze your code and detect real problems.",
        icon: Code2,
        path: "/code-review"
    },

    {
        title: "Debug Assistant",
        description: "Explain errors and get AI-powered solutions.",
        icon: Bug,
        path: "/debug"
    },

    {
        title: "README Generator",
        description: "Generate professional README files automatically.",
        icon: FileText,
        path: "/readme"
    },

    {
        title: "Portfolio Analyzer",
        description: "Analyze your developer portfolio and improve it.",
        icon: BarChart3,
        path: "/portfolio"
    },
    {
        title: "History",
        description: "Keep track of everything you have done with DevHelper AI.",
        icon: BarChart3,
        path: "/history"
    }

];


export default function AICenter() {

    const navigate = useNavigate();


    return (

<div className="min-h-screen bg-slate-950 text-white
                px-4 py-6 sm:px-6 sm:py-8 lg:p-8">
            <div className="max-w-7xl mx-auto">


                <div className="mb-10">

                    <div className="flex items-center gap-3 mb-3">

                        <div className="p-3 rounded-xl bg-violet-500/20">

                            <Sparkles
                                className="text-violet-400"
                                size={28}
                            />

                        </div>

<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">                            AI Developer Center
                        </h1>

                    </div>


                    <p className="text-slate-400 text-lg">

                        Your intelligent assistant for coding,
                        debugging and portfolio improvement.

                    </p>

                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">


                    {tools.map((tool) => {

                        const Icon = tool.icon;


                        return (

                            <button
                                key={tool.title}
                                onClick={() => navigate(tool.path)}
                                className="
                                text-left
                                p-6
                                rounded-2xl
                                border
                                border-slate-800
                                bg-slate-900
                                hover:bg-slate-800
                                hover:border-violet-500/50
                                transition
                                group
                                "
                            >

                                <div className="
                                w-12
                                h-12
                                rounded-xl
                                bg-violet-500/10
                                flex
                                items-center
                                justify-center
                                mb-5
                                group-hover:bg-violet-500/20
                                ">

                                    <Icon
                                        size={25}
                                        className="text-violet-400"
                                    />

                                </div>


                                <h2 className="text-xl font-semibold mb-2">

                                    {tool.title}

                                </h2>


                                <p className="text-slate-400">

                                    {tool.description}

                                </p>


                                <div className="
                                mt-5
                                text-violet-400
                                text-sm
                                font-medium
                                ">

                                    Open tool →

                                </div>

                            </button>

                        );

                    })}

                </div>

            </div>

        </div>

    );

}