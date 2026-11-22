import { useRef, useState } from "react";

const ACCEPTED =
    ".pdf,.docx,.txt,.md,.json,.csv,.xml,.yml,.yaml,.sql,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.html,.css";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB (same limit as the server)

export default function ChatInput({ onSend, disabled }) {

    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState("");

    const fileInputRef = useRef(null);

    const canSend =
        !disabled && (text.trim().length > 0 || file);

    const handleFileChange = (e) => {

        const selected = e.target.files?.[0];

        // Allow selecting the same file again later
        e.target.value = "";

        if (!selected) return;

        if (selected.size > MAX_SIZE) {
            setFileError("File too large (10 MB max).");
            return;
        }

        setFileError("");
        setFile(selected);
    };

    const handleSend = () => {

        if (!canSend) return;

        onSend(text.trim(), file);

        setText("");
        setFile(null);
        setFileError("");
    };

    const handleKeyDown = (e) => {

        // Enter = send, Shift+Enter = new line
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (

        <div className="space-y-2">

            {/* Attached file chip */}

            {file && (

                <div className="
                    inline-flex
                    items-center
                    gap-2
                    bg-slate-800
                    border
                    border-slate-700
                    text-sm
                    text-slate-200
                    px-3
                    py-1.5
                    rounded-lg
                    max-w-full
                ">

                    <span>📎</span>

                    <span className="truncate max-w-xs">
                        {file.name}
                    </span>

                    <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="
                            text-slate-400
                            hover:text-red-400
                        "
                        title="Remove file"
                    >
                        ✕
                    </button>

                </div>

            )}

            {fileError && (

                <p className="text-sm text-red-400">
                    {fileError}
                </p>

            )}

            <div className="
                flex
                items-end
                gap-2
                bg-slate-900
                border
                border-slate-700
                rounded-2xl
                p-2
            ">

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                    disabled={disabled}
                    className="
                        shrink-0
                        w-10
                        h-10
                        rounded-xl
                        text-xl
                        text-slate-300
                        hover:bg-slate-800
                        disabled:opacity-50
                    "
                    title="Attach a file (PDF, DOCX, TXT, code)"
                >
                    📎
                </button>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={1}
                    placeholder={
                        file
                            ? "Ask something about this file..."
                            : "Type your message..."
                    }
                    className="
                        flex-1
                        resize-none
                        bg-transparent
                        outline-none
                        text-white
                        placeholder-slate-500
                        px-2
                        py-2
                        max-h-40
                    "
                />

                <button
                    type="button"
                    onClick={handleSend}
                    disabled={!canSend}
                    className="
                        shrink-0
                        bg-cyan-500
                        hover:bg-cyan-400
                        text-slate-950
                        font-semibold
                        px-5
                        h-10
                        rounded-xl
                        transition
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                    "
                >
                    {disabled ? "..." : "Send"}
                </button>

            </div>

        </div>
    );
}