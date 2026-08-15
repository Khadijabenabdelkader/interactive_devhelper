import { useState } from "react";
import Editor from "@monaco-editor/react";

import { reviewCode } from "../services/aiService";
import ReviewSection from "../components/ai/ReviewSection";

export default function CodeReviewer(){


const [code,setCode] = useState(
`function hello(){
 console.log("Hello World");
}`
);


const [language,setLanguage] = useState("javascript");


const [result,setResult] = useState(null);

const [loading,setLoading] = useState(false);



async function analyze() {

    if (!code.trim()) {
        setResult({
            score: 0,
            summary: "Please enter some code to review.",
            bugs: [],
            security: [],
            performance: [],
            improvements: [],
            optimizedCode: ""
        });

        return;
    }

    try {

        setLoading(true);
        setResult(null);

        const response = await reviewCode({
            code,
            language
        });

        console.log("CODE REVIEW RESPONSE:", response);

        let review = response;

        // If backend returned JSON as a string
        if (typeof review === "string") {

            try {

                review = JSON.parse(review);

            } catch {

                review = {
                    score: 0,
                    summary: review,
                    bugs: [],
                    security: [],
                    performance: [],
                    improvements: [],
                    optimizedCode: ""
                };

            }
        }

        setResult({
            score: review.score ?? 0,

            summary:
                review.summary ||
                "No summary was returned.",

            bugs:
                Array.isArray(review.bugs)
                    ? review.bugs
                    : [],

            security:
                Array.isArray(review.security)
                    ? review.security
                    : [],

            performance:
                Array.isArray(review.performance)
                    ? review.performance
                    : [],

            improvements:
                Array.isArray(review.improvements)
                    ? review.improvements
                    : [],

            optimizedCode:
                review.optimizedCode ||
                ""
        });

    } catch (error) {

        console.error(
            "Code Review Error:",
            error
        );

        console.error(
            "Status:",
            error.response?.status
        );

        console.error(
            "Backend:",
            error.response?.data
        );

        setResult({
            error:
                error.response?.data?.message ||
                "Unable to analyze code."
        });

    } finally {

        setLoading(false);

    }
}



return (

<div className="
text-white
space-y-8
">


<h1 className="
text-4xl
font-bold
text-cyan-400
">

🤖 AI Code Reviewer

</h1>



<div className="
grid
lg:grid-cols-2
gap-6
">


{/* Editor */}

<div className="
bg-slate-900
rounded-xl
p-4
">


<div className="
flex
justify-between
mb-4
">


<select

value={language}

onChange={
(e)=>setLanguage(e.target.value)
}

className="
bg-slate-800
p-2
rounded
"

>


<option value="javascript">
Javascript
</option>


<option value="python">
Python
</option>


<option value="java">
Java
</option>


<option value="cpp">
C++
</option>


</select>


<button

onClick={analyze}

className="
bg-cyan-500
text-black
px-5
py-2
rounded-lg
font-bold
hover:bg-cyan-400
"

>


{
loading
?
"Analyzing..."
:
"Analyze Code 🚀"
}


</button>


</div>



<Editor

height="500px"

language={language}

value={code}

theme="vs-dark"

onChange={
(value)=>setCode(value)
}

/>


</div>





{/* AI Result */}


<div className="
bg-slate-900
rounded-xl
p-6
overflow-auto
">


<h2 className="
text-2xl
font-bold
mb-4
text-green-400
">

AI Review

</h2>


{result?.error ? (

    <div className="
        bg-red-500/10
        border
        border-red-500/30
        text-red-400
        p-5
        rounded-xl
    ">
        {result.error}
    </div>

) : result ? (

    <div className="space-y-5">

        <div className="
            bg-slate-800
            p-5
            rounded-xl
        ">

            <h3 className="
                text-2xl
                font-bold
                text-cyan-400
            ">
                Score: {result.score}/10
            </h3>

            <p className="mt-3 text-slate-300">
                {result.summary}
            </p>

        </div>

        <ReviewSection
            title="🐞 Bugs"
            items={result.bugs}
        />

        <ReviewSection
            title="🔐 Security"
            items={result.security}
        />

        <ReviewSection
            title="⚡ Performance"
            items={result.performance}
        />

        <ReviewSection
            title="✨ Improvements"
            items={result.improvements}
        />

        <div>

            <h3 className="
                text-xl
                font-bold
                mb-3
            ">
                Optimized Code
            </h3>

            <pre className="
    bg-black
    p-4
    rounded-xl
    overflow-auto
    text-sm
    text-green-300
">
    {
        typeof result.optimizedCode === "string"
            ? result.optimizedCode
            : JSON.stringify(
                result.optimizedCode,
                null,
                2
            )
    }
</pre>

        </div>

    </div>

) : (

    <p className="text-slate-400">
        Your AI analysis will appear here...
    </p>

)}

</div>



</div>



</div>


);


}