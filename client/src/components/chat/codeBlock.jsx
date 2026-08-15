import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";


export default function CodeBlock({
    children,
    language = "javascript"
}) {

    const [copied, setCopied] = useState(false);


    const code = String(children).replace(/\n$/, "");


    const copyCode = async () => {

        try {

            await navigator.clipboard.writeText(code);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {

            console.error(
                "Copy error:",
                error
            );

        }
    };


    return (
        <div className="relative my-4">

            <button
                type="button"
                onClick={copyCode}
                className="
                    absolute
                    right-3
                    top-3
                    z-10
                    bg-slate-700
                    hover:bg-slate-600
                    px-3
                    py-1.5
                    rounded-lg
                    text-sm
                    text-white
                    transition
                "
            >
                {copied ? "Copied ✓" : "Copy"}
            </button>


            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    paddingTop: "3.5rem"
                }}
                wrapLongLines={true}
            >
                {code}
            </SyntaxHighlighter>

        </div>
    );
}