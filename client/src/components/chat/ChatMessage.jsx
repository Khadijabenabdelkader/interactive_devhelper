import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";


export default function ChatMessage({ message }) {

    const isUser =
        message.role === "user";


    return (
        <div
            className={`
                flex
                ${isUser ? "justify-end" : "justify-start"}
                mb-6
            `}
        >

            <div
                className={`
                    max-w-3xl
                    rounded-2xl
                    p-5

                    ${
                        isUser
                            ? "bg-cyan-500 text-white"
                            : "bg-slate-900 border border-slate-800"
                    }
                `}
            >

                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}

                    components={{

                        code({
                            node,
                            className,
                            children,
                            ...props
                        }) {

                            /*
                             * Inline code:
                             *
                             * `const x = 10`
                             *
                             * No className.
                             */
                            if (!className) {

                                return (
                                    <code
                                        className="
                                            bg-slate-800
                                            px-1.5
                                            py-0.5
                                            rounded
                                            text-cyan-300
                                            font-mono
                                            text-sm
                                        "
                                        {...props}
                                    >
                                        {children}
                                    </code>
                                );
                            }


                            /*
                             * Fenced code:
                             *
                             * ```javascript
                             * const a = 10;
                             * const b = 20;
                             * console.log(a + b);
                             * ```
                             */

                            const match =
                                /language-(\w+)/.exec(
                                    className || ""
                                );


                            const language =
                                match
                                    ? match[1]
                                    : "javascript";


                            return (
                                <CodeBlock
                                    language={language}
                                >
                                    {children}
                                </CodeBlock>
                            );
                        }

                    }}
                >

                    {message.content}

                </ReactMarkdown>

            </div>

        </div>
    );
}