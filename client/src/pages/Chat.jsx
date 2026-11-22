
import { useEffect, useRef, useState } from "react";

import ChatInput from "./ChatInput";

import {
    chatAI,
    createConversation,
    getConversations,
    getMessages,
    deleteConversation
} from "../services/aiService";

import ChatWindow from "../components/chat/ChatWindow";

const INITIAL_MESSAGE = {
    role: "assistant",
    content: "👋 Hello! I'm DevHelper AI. How can I help you today?"
};

const withAttachment = (content, name) =>
    name ? `📎 ${name}\n\n${content}` : content;

export default function Chat() {

    // ==========================================
    // STATES
    // ==========================================

    const [conversations, setConversations] = useState([]);

    const [currentConversation, setCurrentConversation] = useState(null);

    const [messages, setMessages] = useState([
        {
            id: "welcome",
            ...INITIAL_MESSAGE
        }
    ]);

    const [loading, setLoading] = useState(false);

    const [loadingHistory, setLoadingHistory] = useState(false);

    // Mobile sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Prevent updates after component unmount
    const messagesEndRef = useRef(null);

    // ==========================================
    // AUTO SCROLL
    // ==========================================

    const scrollToBottom = (smooth = true) => {

        requestAnimationFrame(() => {

            messagesEndRef.current?.scrollIntoView({
                behavior: smooth ? "smooth" : "auto",
                block: "end"
            });

        });

    };

    useEffect(() => {

        scrollToBottom();

    }, [messages, loading]);

    // ==========================================
    // MOBILE SIDEBAR
    // ==========================================

    useEffect(() => {

        if (!sidebarOpen) return;

        const handleEscape = (event) => {

            if (event.key === "Escape") {
                setSidebarOpen(false);
            }

        };

        document.addEventListener("keydown", handleEscape);

        // Prevent background scrolling while drawer is open
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow = previousOverflow;

        };

    }, [sidebarOpen]);

    // ==========================================
    // LOAD CONVERSATIONS
    // ==========================================

    useEffect(() => {

        loadConversations();

    }, []);

    const loadConversations = async () => {

        try {

            setLoadingHistory(true);

            const data = await getConversations();

            setConversations(data || []);

        } catch (error) {

            console.error("Load conversations error:", error);

        } finally {

            setLoadingHistory(false);

        }

    };

    // ==========================================
    // NEW CHAT
    // ==========================================

    const handleNewChat = async () => {

        if (loading) return;

        try {

            const conversation = await createConversation();

            setConversations(prev => [
                conversation,
                ...prev.filter(
                    item => item._id !== conversation._id
                )
            ]);

            setCurrentConversation(conversation);

            setMessages([
                {
                    id: Date.now(),
                    ...INITIAL_MESSAGE
                }
            ]);

            setSidebarOpen(false);

            scrollToBottom(false);

        } catch (error) {

            console.error("Create conversation error:", error);

        }

    };

    // ==========================================
    // OPEN CHAT
    // ==========================================

    const handleSelectConversation = async (conversation) => {

        if (loadingHistory) return;

        try {

            setLoadingHistory(true);

            setCurrentConversation(conversation);

            setSidebarOpen(false);

            const history = await getMessages(conversation._id);

            const formattedMessages = (history || []).map(item => ({
                id: item._id,
                role: item.role,
                content: withAttachment(
                    item.content,
                    item.attachment?.name
                )
            }));

            setMessages(formattedMessages);

            scrollToBottom(false);

        } catch (error) {

            console.error("Load conversation error:", error);

        } finally {

            setLoadingHistory(false);

        }

    };

    // ==========================================
    // DELETE CHAT
    // ==========================================

    const handleDeleteConversation = async (conversationId) => {

        try {

            await deleteConversation(conversationId);

            setConversations(prev =>
                prev.filter(
                    conversation =>
                        conversation._id !== conversationId
                )
            );

            if (currentConversation?._id === conversationId) {

                setCurrentConversation(null);

                setMessages([
                    {
                        id: Date.now(),
                        role: "assistant",
                        content: "👋 Start a new conversation with DevHelper AI."
                    }
                ]);

            }

        } catch (error) {

            console.error("Delete conversation error:", error);

        }

    };

    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const sendMessage = async (text, attachedFile = null) => {

        const userMessage = (text || "").trim();

        if ((!userMessage && !attachedFile) || loading) {
            return;
        }

        setLoading(true);

        try {

            let conversation = currentConversation;

            // Create conversation automatically if needed
            if (!conversation) {

                conversation = await createConversation();

                setCurrentConversation(conversation);

                setConversations(prev => [
                    conversation,
                    ...prev.filter(
                        item => item._id !== conversation._id
                    )
                ]);

            }

            // Display user message immediately
            setMessages(prev => [
                ...prev,
                {
                    id: `user-${Date.now()}`,
                    role: "user",
                    content: withAttachment(
                        userMessage || "Summarize this document.",
                        attachedFile?.name
                    )
                }
            ]);

            scrollToBottom();

            // Send message to backend / AI
            const data = await chatAI(
                userMessage,
                conversation._id,
                attachedFile
            );

            const answer =
                data.response ||
                data.answer ||
                "No response received.";

            // Display AI response
            setMessages(prev => [
                ...prev,
                {
                    id: `assistant-${Date.now()}`,
                    role: "assistant",
                    content: answer
                }
            ]);

            // Refresh conversation history
            await loadConversations();

        } catch (error) {

            console.error("Chat Error:", error);

            console.error("Status:", error.response?.status);

            console.error("Backend response:", error.response?.data);

            setMessages(prev => [
                ...prev,
                {
                    id: `error-${Date.now()}`,
                    role: "assistant",
                    content:
                        error.response?.data?.message ||
                        "❌ Sorry, I couldn't process your request."
                }
            ]);

        } finally {

            setLoading(false);

        }

    };

    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div
            className="
                relative
                flex
                w-full
                h-full
                min-h-0
                overflow-hidden
                bg-slate-950
                text-white
            "
        >

            {/* ======================================
                MOBILE OVERLAY
            ====================================== */}

            {sidebarOpen && (

                <button
                    type="button"
                    aria-label="Close chat history"
                    onClick={() => setSidebarOpen(false)}
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/60
                        backdrop-blur-sm
                        md:hidden
                    "
                />

            )}

            {/* ======================================
                SIDEBAR
            ====================================== */}

            <aside
                id="chat-sidebar"
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    flex
                    w-[85%]
                    max-w-72
                    min-h-0
                    flex-col
                    border-r
                    border-slate-800
                    bg-slate-900
                    shadow-2xl
                    transition-transform
                    duration-300
                    ease-in-out

                    ${sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }

                    md:relative
                    md:z-0
                    md:w-72
                    md:max-w-none
                    md:shrink-0
                    md:translate-x-0
                    md:shadow-none
                `}
            >

                {/* Sidebar Header */}

                <div className="
                    flex
                    items-center
                    justify-between
                    p-4
                    shrink-0
                ">

                    <h2 className="
                        text-sm
                        font-semibold
                        text-slate-300
                    ">
                        DevHelper AI
                    </h2>

                    {/* Close button - Mobile */}

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="
                            md:hidden
                            rounded-lg
                            p-2
                            text-slate-400
                            hover:bg-slate-800
                            hover:text-white
                        "
                        aria-label="Close sidebar"
                    >
                        ✕
                    </button>

                </div>

                {/* New Chat */}

                <div className="px-4 pb-4 shrink-0">

                    <button
                        onClick={handleNewChat}
                        disabled={loading}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-cyan-500
                            py-3
                            font-semibold
                            text-slate-950
                            transition
                            hover:bg-cyan-400
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        <span className="text-xl">
                            +
                        </span>

                        New Chat

                    </button>

                </div>

                {/* History Title */}

                <div className="
                    shrink-0
                    px-4
                    pb-3
                ">

                    <h3 className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                    ">
                        Chat History
                    </h3>

                </div>

                {/* Conversations List */}

                <div className="
                    custom-scrollbar
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overscroll-contain
                    px-3
                    pb-4
                ">

                    {loadingHistory && (

                        <p className="
                            p-3
                            text-sm
                            text-slate-500
                        ">
                            Loading chats...
                        </p>

                    )}

                    {!loadingHistory && conversations.length === 0 && (

                        <p className="
                            p-3
                            text-center
                            text-sm
                            text-slate-500
                        ">
                            No conversations yet.
                        </p>

                    )}

                    {!loadingHistory && conversations.map(conversation => (

                        <div
                            key={conversation._id}
                            className={`
                                group
                                mb-1
                                flex
                                items-center
                                gap-1
                                rounded-xl
                                transition

                                ${currentConversation?._id === conversation._id
                                    ? "bg-slate-800"
                                    : "hover:bg-slate-800/70"
                                }
                            `}
                        >

                            {/* Select Conversation */}

                            <button
                                onClick={() =>
                                    handleSelectConversation(conversation)
                                }
                                className="
                                    min-w-0
                                    flex-1
                                    px-3
                                    py-3
                                    text-left
                                "
                            >

                                <div className="
                                    truncate
                                    text-sm
                                    text-slate-200
                                ">
                                    {conversation.title || "New Chat"}
                                </div>

                                <div className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                ">
                                    {conversation.updatedAt
                                        ? new Date(
                                            conversation.updatedAt
                                        ).toLocaleDateString()
                                        : ""
                                    }
                                </div>

                            </button>

                            {/* Delete Conversation */}

                            <button
                                onClick={() =>
                                    handleDeleteConversation(
                                        conversation._id
                                    )
                                }
                                className="
                                    shrink-0
                                    rounded-lg
                                    px-3
                                    py-3
                                    text-slate-500
                                    transition
                                    hover:bg-red-500/10
                                    hover:text-red-400
                                    opacity-100
                                    md:opacity-0
                                    md:group-hover:opacity-100
                                    focus:opacity-100
                                "
                                title="Delete conversation"
                                aria-label="Delete conversation"
                            >
                                🗑
                            </button>

                        </div>

                    ))}

                </div>

            </aside>

            {/* ======================================
                MAIN CHAT
            ====================================== */}

            <main className="
                flex
                min-w-0
                min-h-0
                flex-1
                flex-col
                overflow-hidden
            ">

                {/* Header */}

                <header className="
                    flex
                    h-16
                    shrink-0
                    items-center
                    gap-3
                    border-b
                    border-slate-800
                    bg-slate-900/70
                    px-3
                    sm:px-4
                    md:px-6
                ">

                    {/* Mobile Menu Button */}

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="
                            flex
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            p-2
                            text-slate-300
                            transition
                            hover:bg-slate-800
                            hover:text-white
                            md:hidden
                        "
                        aria-label="Open chat history"
                        aria-expanded={sidebarOpen}
                        aria-controls="chat-sidebar"
                    >

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>

                    </button>

                    {/* Conversation Title */}

                    <div className="min-w-0 flex-1">

                        <h1 className="
                            truncate
                            text-base
                            font-semibold
                            sm:text-lg
                        ">
                            {currentConversation?.title || "DevHelper AI"}
                        </h1>

                        <p className="
                            truncate
                            text-xs
                            text-slate-500
                        ">
                            AI Developer Assistant
                        </p>

                    </div>

                </header>

                {/* ==================================
                    SCROLLABLE MESSAGES
                ================================== */}

                <div className="
                    custom-scrollbar
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overscroll-contain
                ">

                    <div className="
                        mx-auto
                        w-full
                        max-w-5xl
                        px-3
                        py-4
                        sm:px-4
                        sm:py-6
                        md:px-6
                    ">

                        <ChatWindow
                            messages={messages}
                            loading={loading}
                        />

                        {/* Auto Scroll Reference */}

                        <div
                            ref={messagesEndRef}
                            className="h-px"
                        />

                    </div>

                </div>

                {/* ==================================
                    INPUT AREA
                ================================== */}

                <div className="
                    shrink-0
                    border-t
                    border-slate-800
                    bg-slate-950
                    pb-[env(safe-area-inset-bottom)]
                ">

                    <div className="
                        mx-auto
                        w-full
                        max-w-5xl
                        px-3
                        py-3
                        sm:px-4
                        sm:py-4
                        md:px-6
                    ">

                        <ChatInput
                            onSend={sendMessage}
                            disabled={loading}
                        />

                        <p className="
                            mt-2
                            hidden
                            text-center
                            text-[11px]
                            text-slate-600
                            sm:block
                        ">
                            DevHelper AI can make mistakes.
                            Verify important information.
                        </p>

                    </div>

                </div>

            </main>

        </div>

    );

}
