import { useEffect, useRef, useState } from "react";

import {
    chatAI,
    createConversation,
    getConversations,
    getMessages,
    deleteConversation
} from "../services/aiService";

import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";

export default function Chat() {

    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);

    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            content:
                "👋 Hello! I'm DevHelper AI. How can I help you today?"
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // ==========================================
    // AUTO SCROLL
    // ==========================================

    const messagesEndRef = useRef(null);

    const scrollToBottom = (smooth = true) => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: smooth ? "smooth" : "auto",
                block: "end"
            });
        }, 50);
    };

    // Scroll whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

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

            console.error(
                "Load conversations error:",
                error
            );

        } finally {

            setLoadingHistory(false);

        }
    };

    // ==========================================
    // NEW CHAT
    // ==========================================

    const handleNewChat = async () => {

        try {

            const conversation =
                await createConversation();

            setConversations(prev => [
                conversation,
                ...prev
            ]);

            setCurrentConversation(conversation);

            setMessages([
                {
                    id: Date.now(),
                    role: "assistant",
                    content:
                        "👋 Hello! I'm DevHelper AI. How can I help you today?"
                }
            ]);

            scrollToBottom(false);

        } catch (error) {

            console.error(
                "Create conversation error:",
                error
            );

        }
    };

    // ==========================================
    // OPEN CHAT
    // ==========================================

    const handleSelectConversation = async (conversation) => {

        try {

            setLoadingHistory(true);

            setCurrentConversation(conversation);

            const history =
                await getMessages(
                    conversation._id
                );

            const formattedMessages =
                history.map(item => ({
                    id: item._id,
                    role: item.role,
                    content: item.content
                }));

            setMessages(formattedMessages);

            // Go to bottom after history loads
            setTimeout(() => {
                scrollToBottom(false);
            }, 100);

        } catch (error) {

            console.error(
                "Load conversation error:",
                error
            );

        } finally {

            setLoadingHistory(false);

        }
    };

    // ==========================================
    // DELETE CHAT
    // ==========================================

    const handleDeleteConversation =
        async (conversationId) => {

        try {

            await deleteConversation(
                conversationId
            );

            setConversations(prev =>
                prev.filter(
                    conversation =>
                        conversation._id !== conversationId
                )
            );

            if (
                currentConversation?._id ===
                conversationId
            ) {

                setCurrentConversation(null);

                setMessages([
                    {
                        id: Date.now(),
                        role: "assistant",
                        content:
                            "👋 Start a new conversation with DevHelper AI."
                    }
                ]);
            }

        } catch (error) {

            console.error(
                "Delete conversation error:",
                error
            );

        }
    };

    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const sendMessage = async (text) => {

        if (
            !text ||
            !text.trim() ||
            loading
        ) {
            return;
        }

        const userMessage = text.trim();

        setLoading(true);

        try {

            let conversation =
                currentConversation;

            // Create conversation if needed
            if (!conversation) {

                conversation =
                    await createConversation();

                setCurrentConversation(
                    conversation
                );

                setConversations(prev => [
                    conversation,
                    ...prev
                ]);
            }

            // Add user message immediately
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    role: "user",
                    content: userMessage
                }
            ]);

            // Scroll to user message
            scrollToBottom();

            // Call AI
            const data =
                await chatAI(
                    userMessage,
                    conversation._id
                );

            const answer =
                data.response ||
                data.answer ||
                "No response received.";

            // Add AI response
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: answer
                }
            ]);

            // Refresh history
            await loadConversations();

        } catch (error) {

            console.error(
                "Chat Error:",
                error
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
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

        <div className="
            flex
            h-full
            min-h-0
            bg-slate-950
            text-white
            overflow-hidden
        ">

            {/* ======================================
                SIDEBAR
            ====================================== */}

            <aside className="
                w-72
                shrink-0
                bg-slate-900
                border-r
                border-slate-800
                flex
                flex-col
                min-h-0
            ">

                {/* New Chat */}

                <div className="p-4 shrink-0">

                    <button
                        onClick={handleNewChat}
                        className="
                            w-full
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-cyan-500
                            hover:bg-cyan-400
                            text-slate-950
                            font-semibold
                            py-3
                            rounded-xl
                            transition
                        "
                    >
                        <span className="text-xl">
                            +
                        </span>

                        New Chat
                    </button>

                </div>

                {/* History title */}

                <div className="px-4 pb-3 shrink-0">

                    <h2 className="
                        text-xs
                        uppercase
                        tracking-wider
                        text-slate-500
                        font-semibold
                    ">
                        Chat History
                    </h2>

                </div>

                {/* Scrollable history */}

                <div className="
                    flex-1
                    min-h-0
                    overflow-y-auto
                    px-3
                    pb-4
                    custom-scrollbar
                ">

                    {loadingHistory && (

                        <p className="
                            text-slate-500
                            text-sm
                            p-3
                        ">
                            Loading chats...
                        </p>

                    )}

                    {!loadingHistory &&
                        conversations.length === 0 && (

                            <p className="
                                text-slate-500
                                text-sm
                                p-3
                                text-center
                            ">
                                No conversations yet.
                            </p>

                        )}

                    {!loadingHistory &&
                        conversations.map(conversation => (

                            <div
                                key={conversation._id}
                                className={`
                                    group
                                    flex
                                    items-center
                                    gap-1
                                    mb-1
                                    rounded-xl
                                    transition
                                    ${
                                        currentConversation?._id ===
                                        conversation._id
                                            ? "bg-slate-800"
                                            : "hover:bg-slate-800/70"
                                    }
                                `}
                            >

                                <button
                                    onClick={() =>
                                        handleSelectConversation(
                                            conversation
                                        )
                                    }
                                    className="
                                        flex-1
                                        min-w-0
                                        text-left
                                        px-3
                                        py-3
                                    "
                                >

                                    <div className="
                                        truncate
                                        text-sm
                                        text-slate-200
                                    ">
                                        {conversation.title ||
                                            "New Chat"}
                                    </div>

                                    <div className="
                                        text-xs
                                        text-slate-500
                                        mt-1
                                    ">
                                        {conversation.updatedAt
                                            ? new Date(
                                                conversation.updatedAt
                                            ).toLocaleDateString()
                                            : ""}
                                    </div>

                                </button>

                                <button
                                    onClick={() =>
                                        handleDeleteConversation(
                                            conversation._id
                                        )
                                    }
                                    className="
                                        opacity-0
                                        group-hover:opacity-100
                                        text-slate-500
                                        hover:text-red-400
                                        px-3
                                        transition
                                    "
                                    title="Delete conversation"
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
                flex-1
                min-w-0
                min-h-0
                flex
                flex-col
                overflow-hidden
            ">

                {/* Header */}

                <header className="
                    h-16
                    shrink-0
                    flex
                    items-center
                    px-6
                    border-b
                    border-slate-800
                    bg-slate-900/70
                ">

                    <div className="min-w-0">

                        <h1 className="
                            font-semibold
                            text-lg
                            truncate
                        ">
                            {currentConversation?.title ||
                                "DevHelper AI"}
                        </h1>

                        <p className="
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
                    flex-1
                    min-h-0
                    overflow-y-auto
                    overscroll-contain
                    custom-scrollbar
                ">

                    <div className="
                        w-full
                        max-w-5xl
                        mx-auto
                        px-4
                        md:px-6
                        py-6
                    ">

                        <ChatWindow
                            messages={messages}
                            loading={loading}
                        />

                        {/* Invisible element used
                            for automatic scrolling */}

                        <div
                            ref={messagesEndRef}
                            className="h-px"
                        />

                    </div>

                </div>


                {/* ==================================
                    FIXED INPUT AREA
                ================================== */}

                <div className="
                    shrink-0
                    border-t
                    border-slate-800
                    bg-slate-950
                ">

                    <div className="
                        max-w-5xl
                        mx-auto
                        w-full
                        px-4
                        md:px-6
                        py-4
                    ">

                        <ChatInput
                            onSend={sendMessage}
                            disabled={loading}
                        />

                        <p className="
                            text-center
                            text-[11px]
                            text-slate-600
                            mt-2
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