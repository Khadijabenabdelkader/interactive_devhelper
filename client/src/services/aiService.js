import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: `${API_URL}/api/ai`
});

const chatApi = axios.create({
    baseURL: `${API_URL}/api/chat`
});

const addToken = (config) => {

    const token =
        localStorage.getItem("token");

    if (token) {

        config.headers.Authorization =
            `Bearer ${token}`;

    }

    return config;
};

api.interceptors.request.use(addToken);
chatApi.interceptors.request.use(addToken);


// ==========================================
// CREATE CONVERSATION
// ==========================================

export const createConversation = async () => {

    const res =
        await chatApi.post(
            "/conversations"
        );

    return res.data.conversation;
};


// ==========================================
// GET CONVERSATIONS
// ==========================================

export const getConversations = async () => {

    const res =
        await chatApi.get(
            "/conversations"
        );

    return res.data.conversations;
};


// ==========================================
// GET MESSAGES
// ==========================================

export const getMessages = async (
    conversationId
) => {

    const res =
        await chatApi.get(
            `/conversations/${conversationId}/messages`
        );

    return res.data.messages;
};


// ==========================================
// DELETE CONVERSATION
// ==========================================

export const deleteConversation = async (
    conversationId
) => {

    const res =
        await chatApi.delete(
            `/conversations/${conversationId}`
        );

    return res.data;
};


// ==========================================
// AI CHAT
// ==========================================
export const chatAI = async (message, conversationId, file = null) => {

    console.log("3. chatAI file:", file, file instanceof File);

    if (file instanceof File) {

        const formData = new FormData();
        formData.append("message", message);
        formData.append("conversationId", conversationId);
        formData.append("file", file, file.name);

        // Ne mets pas de Content-Type à la main : le navigateur ajoute le bon (avec boundary)
        const res = await api.post("/chat", formData);
        return res.data;
    }

    const res = await api.post("/chat", { message, conversationId });
    return res.data;
};
// ==========================================
// DEBUG
// ==========================================

export const debugError = async (data) => {

    const res =
        await api.post(
            "/debug",
            data
        );

    return res.data;
};


// ==========================================
// README
// ==========================================

export const generateReadme = async (project) => {

    const res =
        await api.post(
            "/readme",
            project
        );

    return res.data;
};


// ==========================================
// CODE REVIEW
// ==========================================

export const reviewCode = async (data) => {

    const res =
        await api.post(
            "/review",
            data
        );

    return res.data;
};


// ==========================================
// PORTFOLIO ANALYZER
// ==========================================

export const analyzePortfolio = async (portfolio) => {

    const res = await api.post(
        "/portfolio",
        portfolio
    );

    return res.data;
};