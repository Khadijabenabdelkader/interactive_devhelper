import {motion}
from "framer-motion";

export default function TypingIndicator() {
    return (
        <div className="flex items-center gap-2 px-4 py-3 text-slate-400">
            <span className="text-sm">
                AI is thinking
            </span>

            <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
            </span>
        </div>
    );
}