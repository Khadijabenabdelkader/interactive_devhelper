
const {
    chatAI,
    reviewCode,
    debugCodeError,
    generateReadme,
    analyzePortfolio,
    saveHistory
} = require("../services/aiService");
 
const { extractText } = require("../services/fileService");
 
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
 
const express = require("express");
const multer = require("multer");
 
 
// ==========================================
// BODY PARSING FOR CHAT (JSON or file upload)
// ==========================================
 
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});
 
const jsonParser = express.json({ limit: "1mb" });
 
// Si personne n'a lu le body, on lit le JSON nous-mêmes
const parseBody = (req, res, next) => {
    if (req.body !== undefined) return next();
    return jsonParser(req, res, next);
};
 
const uploadFile = (req, res, next) => {
 
    // Body déjà lu (multer dans routes/ai.js, ou express.json) : ne rien refaire
    if (req._multerDone || req.body !== undefined) return next();
 
    upload.single("file")(req, res, (err) => {
 
        req._multerDone = true;
 
        if (err) {
            return res.status(400).json({
                message:
                    err.code === "LIMIT_FILE_SIZE"
                        ? "File too large (10 MB max)."
                        : err.message
            });
        }
 
        parseBody(req, res, next);
    });
};
 
 
// ==========================================
// HELPERS
// ==========================================
 
// Réponse d'erreur commune
const sendAIError = (res, error, fallbackMessage) => {
 
    // Erreur de fichier (type non supporté, PDF scanné, etc.)
    if (error.status === 400) {
        return res.status(400).json({
            message: error.message
        });
    }
 
    // Gemini surchargé ou quota atteint
    if (error.status === 503 || error.status === 429) {
        return res.status(503).json({
            message: "The AI service is busy right now. Please try again in a moment."
        });
    }
 
    return res.status(500).json({
        message: fallbackMessage,
        error: error.message
    });
};
 
// Sauvegarde dans History sans jamais faire échouer la requête
const saveHistorySafe = async (data) => {
    try {
        await saveHistory(data);
    } catch (err) {
        console.error("HISTORY SAVE ERROR:", err.message);
    }
};
 
// Ajoute le contenu du document au message (document d'abord, question ensuite)
const buildPrompt = (question, attachment) =>
    attachment?.text
        ? `--- DOCUMENT: ${attachment.name} ---\n${attachment.text}\n--- END DOCUMENT ---\n\n${question}`
        : question;
 
 
// ==========================================
// CHAT
// ==========================================
 
const chatHandler  = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated."
            });
        }
 
        const body = req.body || {};
        const { conversationId } = body;
 
        
 
        const rawMessage =
            typeof body.message === "string"
                ? body.message.trim()
                : "";
 
        if (!rawMessage && !req.file) {
            return res.status(400).json({
                message: "Message or file is required."
            });
        }
 
        if (!conversationId) {
            return res.status(400).json({
                message: "Conversation ID is required."
            });
        }
 
        const userMessage = rawMessage || "Summarize this document.";
 
        // Extraire le texte du fichier (PDF, DOCX, TXT, code...)
        const attachment = req.file
            ? await extractText(req.file)
            : null;
 
        console.log(
            "CHAT FILE:",
            req.file
                ? `${req.file.originalname} (${attachment.text.length} chars)`
                : "none"
        );
 
        // Conversation appartenant à l'utilisateur connecté
        const conversation = await Conversation.findOne({
            _id: conversationId,
            userId: req.user._id
        });
 
        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found."
            });
        }
 
        // 1. Charger l'historique AVANT d'enregistrer le nouveau message
        const previous = await Message.find({
            conversationId: conversation._id,
            userId: req.user._id
        })
            .sort({ createdAt: -1 }) // les plus récents d'abord
            .limit(8);
 
        // Les anciens documents sont réinjectés pour que l'IA les « retienne »
        const geminiHistory = previous.reverse().map(msg => ({
            role: msg.role,
            content: buildPrompt(msg.content, msg.attachment)
        }));
 
        // 2. Générer la réponse
        const answer = await chatAI(
            buildPrompt(userMessage, attachment),
            geminiHistory
        );
 
        if (!answer || !answer.trim()) {
            throw new Error("The AI returned an empty response.");
        }
 
        // 3. Répondre tout de suite à l'utilisateur
        res.json({
            success: true,
            response: answer,
            conversationId: conversation._id,
            fileTruncated: attachment?.truncated || false
        });
 
        // 4. Sauvegarder en arrière-plan
        try {
            await Message.create({
                conversationId: conversation._id,
                userId: req.user._id,
                role: "user",
                content: userMessage,
                ...(attachment && {
                    attachment: {
                        name: attachment.name,
                        text: attachment.text
                    }
                })
            });
 
            await Message.create({
                conversationId: conversation._id,
                userId: req.user._id,
                role: "assistant",
                content: answer
            });
 
            conversation.updatedAt = new Date();
 
            if (conversation.title === "New Chat") {
                const title = rawMessage || attachment?.name || "New Chat";
 
                conversation.title =
                    title.length > 40
                        ? title.substring(0, 40) + "..."
                        : title;
            }
 
            await conversation.save();
 
            await saveHistorySafe({
                userId: req.user._id,
                tool: "AI_CHAT",
                action: "MESSAGE_SENT",
                title: conversation.title || "AI Chat",
                input: {
                    message: userMessage,
                    file: attachment?.name || null
                },
                result: { response: answer },
                conversationId: conversation._id
            });
        } catch (saveError) {
            console.error("CHAT SAVE ERROR:", saveError.message);
        }
 
    } catch (error) {
        console.error("CHAT CONTROLLER ERROR:", error.message);
 
        if (res.headersSent) return;
 
        return sendAIError(res, error, "Unable to process chat request.");
    }
};
 
 
// ==========================================
// CODE REVIEW
// ==========================================

const review = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated."
            });
        }

        const { code, language } = req.body || {};

        if (typeof code !== "string" || !code.trim()) {
            return res.status(400).json({
                message: "Code is required."
            });
        }

        const result = await reviewCode({
            code,
            language: language || "javascript"
        });

        // Répondre d'abord, sauvegarder ensuite
        res.json({
            success: true,
            ...(result && typeof result === "object" ? result : { result })
        });

        await saveHistorySafe({
            userId: req.user._id,
            tool: "CODE_REVIEWER",
            action: "REVIEW_COMPLETED",
            title: "Code Review",
            input: { code, language },
            result
        });

    } catch (error) {
        console.error("CODE REVIEW ERROR:", error.message);

        if (res.headersSent) return;

        return sendAIError(res, error, "Code review failed.");
    }
};


// ==========================================
// README GENERATOR
// ==========================================

const readme = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated."
            });
        }

        const project = req.body;

        if (!project || typeof project !== "object") {
            return res.status(400).json({
                message: "Project information is required."
            });
        }

        if (typeof project.name !== "string" || !project.name.trim()) {
            return res.status(400).json({
                message: "Project name is required."
            });
        }

        const generatedReadme = await generateReadme(project);

        res.status(200).json({
            success: true,
            readme: generatedReadme
        });

        await saveHistorySafe({
            userId: req.user._id,
            tool: "README_GENERATOR",
            action: "README_GENERATED",
            title: project.name.trim(),
            input: project,
            result: { readme: generatedReadme }
        });

    } catch (error) {
        console.error("README GENERATOR ERROR:", error.message);

        if (res.headersSent) return;

        return sendAIError(res, error, "Unable to generate README.");
    }
};


// ==========================================
// PORTFOLIO ANALYZER
// ==========================================

const portfolio = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated."
            });
        }

        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({
                message: "Portfolio data is required."
            });
        }

        const result = await analyzePortfolio(req.body);

        res.status(200).json(result);

        await saveHistorySafe({
            userId: req.user._id,
            tool: "PORTFOLIO_ANALYZER",
            action: "ANALYSIS_COMPLETED",
            title: `${req.body.name || "Portfolio"} - Analysis`,
            input: req.body,
            result
        });

    } catch (error) {
        console.error("PORTFOLIO ANALYZER ERROR:", error.message);

        if (res.headersSent) return;

        return sendAIError(res, error, "Portfolio analysis failed.");
    }
};


// ==========================================
// DEBUG ASSISTANT
// ==========================================

const debugError = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated."
            });
        }

        const errorText = req.body?.error;

        if (typeof errorText !== "string" || !errorText.trim()) {
            return res.status(400).json({
                message: "Error text is required."
            });
        }

        const result = await debugCodeError(errorText.trim());

        res.json({
            success: true,
            ...(result && typeof result === "object" ? result : { result })
        });

        await saveHistorySafe({
            userId: req.user._id,
            tool: "DEBUG_ASSISTANT",
            action: "DEBUG_COMPLETED",
            title: "Debug Assistant",
            input: { error: errorText.trim() },
            result
        });

    } catch (error) {
        console.error("DEBUG ASSISTANT ERROR:", error.message);

        if (res.headersSent) return;

        return sendAIError(res, error, "Debug analysis failed.");
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    chat: [uploadFile, chatHandler],   // multer s'exécute toujours avant le chat
    review,
    readme,
    portfolio,
    debugError
};