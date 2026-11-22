import { useState } from "react";
import {
    Bug,
    Sparkles,
    Loader2,
    Copy,
    Check,
    RotateCcw,
    AlertTriangle,
    Lightbulb,
    Code2,
    ListChecks
} from "lucide-react";

import { debugError } from "../services/aiService";


export default function DebugAssistant() {

    const [error, setError] = useState("");

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);

    const [copied, setCopied] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");


    // ==========================================
    // ANALYZE ERROR
    // ==========================================

    const analyzeError = async () => {

        if (!error.trim()) {

            setErrorMessage(
                "Please paste an error before starting the analysis."
            );

            return;
        }


        try {

            setLoading(true);

            setErrorMessage("");

            setResult(null);


            const data = await debugError({
                    error: error.trim()

        });


            setResult(data);


        } catch (err) {

            console.error(
                "Debug Assistant Error:",
                err
            );


            setErrorMessage(
                "Unable to analyze the error. Make sure the backend and gemini are running."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // COPY CORRECTED CODE
    // ==========================================

    const copyCode = async () => {

        if (!result?.correctedCode) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                result.correctedCode
            );


            setCopied(true);


            setTimeout(() => {

                setCopied(false);

            }, 2000);


        } catch (err) {

            console.error(
                "Copy error:",
                err
            );

        }

    };


    // ==========================================
    // CLEAR
    // ==========================================

    const clearAll = () => {

        setError("");

        setResult(null);

        setErrorMessage("");

        setCopied(false);

    };


    return (

        <div className="
            min-h-screen
            bg-slate-950
            text-white
            px-4
            py-8
            md:px-8
        ">

            <div className="
                max-w-7xl
                mx-auto
            ">


                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-6
                    mb-8
                ">


                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-violet-500/10
                            border
                            border-violet-500/20
                            flex
                            items-center
                            justify-center
                        ">

                            <Bug
                                size={28}
                                className="text-violet-400"
                            />

                        </div>


                        <div>

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <h1 className="
                                    text-3xl
                                    md:text-4xl
                                    font-bold
                                ">
                                    AI Debug Assistant
                                </h1>


                                <Sparkles
                                    size={20}
                                    className="text-violet-400"
                                />

                            </div>


                            <p className="
                                text-slate-400
                                mt-1
                            ">

                                Understand errors, find their cause,
                                and get AI-powered solutions.

                            </p>

                        </div>

                    </div>


                    {/* Clear button */}

                    {(error || result) && (

                        <button
                            onClick={clearAll}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                px-4
                                py-2
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-900
                                hover:bg-slate-800
                                text-slate-300
                                transition
                            "
                        >

                            <RotateCcw size={17} />

                            Clear

                        </button>

                    )}

                </div>



                {/* ======================================
                    MAIN GRID
                ====================================== */}

                <div className="
                    grid
                    grid-cols-1
                    xl:grid-cols-2
                    gap-6
                ">


                    {/* ==================================
                        LEFT SIDE
                    ================================== */}

                    <div className="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-2xl
                        overflow-hidden
                    ">


                        {/* Header */}

                        <div className="
                            px-6
                            py-4
                            border-b
                            border-slate-800
                            flex
                            items-center
                            gap-3
                        ">

                            <Bug
                                size={20}
                                className="text-violet-400"
                            />

                            <div>

                                <h2 className="
                                    font-semibold
                                ">
                                    Paste your error
                                </h2>

                                <p className="
                                    text-xs
                                    text-slate-500
                                    mt-1
                                ">
                                    Stack trace, compiler error or
                                    runtime error
                                </p>

                            </div>

                        </div>



                        {/* Textarea */}

                        <div className="p-6">

                            <textarea

                                value={error}

                                onChange={(e) => {
                                    setError(e.target.value);
                                    setErrorMessage("");
                                }}

                                placeholder={`Example:

ReferenceError: API is not defined
    at reviewCode (aiService.js:95:16)
    at analyze (CodeReview.jsx:38:24)`}

                                className="
    w-full
    min-h-[220px]
    sm:min-h-[280px]
    lg:h-80
    resize-y
    rounded-xl
    border border-slate-700
    bg-slate-950
    text-slate-200
    p-4
    font-mono text-sm
    outline-none
    focus:border-violet-500
    transition
"

                            />



                            {/* Error message */}

                            {errorMessage && (

                                <div className="
                                    mt-4
                                    flex
                                    items-start
                                    gap-3
                                    rounded-xl
                                    border
                                    border-red-500/20
                                    bg-red-500/10
                                    p-4
                                    text-red-300
                                    text-sm
                                ">

                                    <AlertTriangle
                                        size={18}
                                        className="
                                            flex-shrink-0
                                            mt-0.5
                                        "
                                    />

                                    <span>
                                        {errorMessage}
                                    </span>

                                </div>

                            )}



                            {/* Analyze button */}

                            <button

                                onClick={analyzeError}

                                disabled={
                                    loading ||
                                    !error.trim()
                                }

                                className="
                                    w-full
                                    mt-5
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    px-5
                                    py-3
                                    bg-violet-600
                                    hover:bg-violet-500
                                    disabled:bg-slate-800
                                    disabled:text-slate-500
                                    disabled:cursor-not-allowed
                                    font-semibold
                                    transition
                                "

                            >

                                {loading ? (

                                    <>

                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />

                                        Analyzing...

                                    </>

                                ) : (

                                    <>

                                        <Sparkles size={19} />

                                        Analyze Error

                                    </>

                                )}

                            </button>


                        </div>

                    </div>



                    {/* ==================================
                        RIGHT SIDE
                    ================================== */}

                    <div className="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-2xl
                        overflow-hidden
                        min-h-[500px]
                    ">


                        {/* Header */}

                        <div className="
                            px-6
                            py-4
                            border-b
                            border-slate-800
                            flex
                            items-center
                            gap-3
                        ">

                            <Sparkles
                                size={20}
                                className="text-violet-400"
                            />

                            <div>

                                <h2 className="
                                    font-semibold
                                ">
                                    AI Analysis
                                </h2>

                                <p className="
                                    text-xs
                                    text-slate-500
                                    mt-1
                                ">
                                    Your debugging report
                                </p>

                            </div>

                        </div>



                        {/* ==================================
                            EMPTY STATE
                        ================================== */}

                        {!loading && !result && (

                            <div className="
                                min-h-[440px]
                                flex
                                flex-col
                                items-center
                                justify-center
                                text-center
                                px-8
                            ">

                                <div className="
                                    w-16
                                    h-16
                                    rounded-2xl
                                    bg-slate-800
                                    flex
                                    items-center
                                    justify-center
                                    mb-5
                                ">

                                    <Bug
                                        size={30}
                                        className="text-slate-500"
                                    />

                                </div>


                                <h3 className="
                                    text-lg
                                    font-semibold
                                    text-slate-300
                                ">
                                    No analysis yet
                                </h3>


                                <p className="
                                    text-sm
                                    text-slate-500
                                    max-w-sm
                                    mt-2
                                ">

                                    Paste your error on the left
                                    and let the AI identify the
                                    cause and suggest a solution.

                                </p>

                            </div>

                        )}



                        {/* ==================================
                            LOADING
                        ================================== */}

                        {loading && (

                            <div className="
                                min-h-[440px]
                                flex
                                flex-col
                                items-center
                                justify-center
                                text-center
                            ">

                                <Loader2
                                    size={40}
                                    className="
                                        text-violet-400
                                        animate-spin
                                        mb-5
                                    "
                                />


                                <h3 className="
                                    font-semibold
                                    text-slate-300
                                ">

                                    AI is analyzing your error...

                                </h3>


                                <p className="
                                    text-sm
                                    text-slate-500
                                    mt-2
                                ">

                                    Understanding the cause
                                    and preparing a solution.

                                </p>

                            </div>

                        )}



                        {/* ==================================
                            RESULT
                        ================================== */}

                        {!loading && result && (

                            <div className="
                                p-6
                                space-y-5
                            ">


                                {/* Error type */}

                                {result.errorType && (
    <div className="
        rounded-xl
        border
        border-red-500/20
        bg-red-500/10
        p-4
    ">
        <div className="
            flex
            items-center
            gap-2
            text-red-400
            text-sm
            font-semibold
            mb-2
        ">
            <AlertTriangle size={17} />

            Error Type
        </div>

        <p className="text-slate-200 font-mono text-sm">
            {result.errorType}
        </p>
    </div>
)}


                                {/* Summary */}

                                {result.summary && (

                                    <div className="
                                        rounded-xl
                                        border
                                        border-slate-800
                                        bg-slate-950
                                        p-4
                                    ">

                                        <h3 className="
                                            text-sm
                                            font-semibold
                                            text-slate-300
                                            mb-2
                                        ">

                                            Summary

                                        </h3>


                                        <p className="
                                            text-sm
                                            text-slate-400
                                            leading-6
                                        ">

                                            {result.summary}

                                        </p>

                                    </div>

                                )}



                                {/* Cause */}

                                {result.cause && (

                                    <div className="
                                        rounded-xl
                                        border
                                        border-slate-800
                                        bg-slate-950
                                        p-4
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            mb-3
                                        ">

                                            <Bug
                                                size={18}
                                                className="text-orange-400"
                                            />

                                            <h3 className="
                                                font-semibold
                                            ">

                                                Cause

                                            </h3>

                                        </div>


                                        <p className="
                                            text-sm
                                            text-slate-400
                                            leading-6
                                        ">

                                            {result.cause}

                                        </p>

                                    </div>

                                )}



                                {/* Solution */}

                                {result.solution && (

                                    <div className="
                                        rounded-xl
                                        border
                                        border-emerald-500/20
                                        bg-emerald-500/5
                                        p-4
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            mb-3
                                        ">

                                            <Lightbulb
                                                size={18}
                                                className="text-emerald-400"
                                            />

                                            <h3 className="
                                                font-semibold
                                            ">

                                                Solution

                                            </h3>

                                        </div>


                                        <p className="
                                            text-sm
                                            text-slate-300
                                            leading-6
                                        ">

                                            {result.solution}

                                        </p>

                                    </div>

                                )}



                                {/* Steps */}

                                {Array.isArray(result.steps) &&
                                result.steps.length > 0 && (

                                    <div className="
                                        rounded-xl
                                        border
                                        border-slate-800
                                        bg-slate-950
                                        p-4
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            mb-4
                                        ">

                                            <ListChecks
                                                size={18}
                                                className="text-violet-400"
                                            />

                                            <h3 className="
                                                font-semibold
                                            ">

                                                How to fix it

                                            </h3>

                                        </div>


                                        <div className="
                                            space-y-3
                                        ">

                                            {result.steps.map(
                                                (step, index) => (

                                                    <div
                                                        key={index}
                                                        className="
                                                            flex
                                                            items-start
                                                            gap-3
                                                        "
                                                    >

                                                        <div className="
                                                            w-6
                                                            h-6
                                                            rounded-full
                                                            bg-violet-500/10
                                                            text-violet-400
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-xs
                                                            font-bold
                                                            flex-shrink-0
                                                        ">

                                                            {index + 1}

                                                        </div>


                                                        <p className="
                                                            text-sm
                                                            text-slate-400
                                                            leading-6
                                                        ">

                                                            {step}

                                                        </p>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}



                                {/* Corrected code */}

                                {result.correctedCode && (

                                    <div className="
                                        rounded-xl
                                        border
                                        border-slate-800
                                        overflow-hidden
                                    ">


                                        <div className="
                                            px-4
                                            py-3
                                            bg-slate-950
                                            border-b
                                            border-slate-800
                                            flex
                                            items-center
                                            justify-between
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                            ">

                                                <Code2
                                                    size={18}
                                                    className="
                                                        text-blue-400
                                                    "
                                                />

                                                <h3 className="
                                                    font-semibold
                                                    text-sm
                                                ">

                                                    Corrected Code

                                                </h3>

                                            </div>


                                            <button
                                                onClick={copyCode}
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    px-3
                                                    py-1.5
                                                    rounded-lg
                                                    bg-slate-800
                                                    hover:bg-slate-700
                                                    text-xs
                                                    text-slate-300
                                                    transition
                                                "
                                            >

                                                {copied ? (

                                                    <>

                                                        <Check
                                                            size={15}
                                                        />

                                                        Copied

                                                    </>

                                                ) : (

                                                    <>

                                                        <Copy
                                                            size={15}
                                                        />

                                                        Copy

                                                    </>

                                                )}

                                            </button>

                                        </div>


                                        <pre className="
                                            p-5
                                            overflow-x-auto
                                            bg-black
                                            text-sm
                                            text-slate-300
                                            font-mono
                                            leading-6
                                        ">

                                            <code>
                                                {result.correctedCode}
                                            </code>

                                        </pre>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                </div>



                {/* ======================================
                    FOOTER INFO
                ====================================== */}

                <div className="
                    mt-6
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900/50
                    p-5
                    flex
                    items-start
                    gap-4
                ">

                    <div className="
                        w-10
                        h-10
                        rounded-xl
                        bg-violet-500/10
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                    ">

                        <Sparkles
                            size={19}
                            className="text-violet-400"
                        />

                    </div>


                    <div>

                        <h3 className="
                            font-medium
                            text-slate-300
                        ">

                            Powered by your local AI

                        </h3>


                        <p className="
                            text-sm
                            text-slate-500
                            mt-1
                        ">

                            Your error is analyzed locally
                            through gemini, so your code does not
                            need to be sent to an external AI API.

                        </p>

                    </div>

                </div>


            </div>

        </div>

    );

}