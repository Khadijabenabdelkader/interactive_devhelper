const {
    chatAI,
    reviewCode,
    debugCodeError,
    generateReadme,
    analyzePortfolio
} = require("../services/aiService");

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


// ==========================================
// CHAT
// ==========================================

const chat = async (req, res) => {

    try {

        

        // ==========================================
        // VERIFY USER
        // ==========================================

        if (!req.user) {

            return res.status(401).json({
                message: "User not authenticated."
            });

        }


        // ==========================================
        // GET DATA
        // ==========================================

        const {
            message,
            conversationId
        } = req.body;


        if (!message || !message.trim()) {

            return res.status(400).json({
                message: "Message is required."
            });

        }


        if (!conversationId) {

            return res.status(400).json({
                message: "Conversation ID is required."
            });

        }


        // ==========================================
        // FIND CONVERSATION
        // ==========================================

        const conversation =
            await Conversation.findOne({
                _id: conversationId,
                userId: req.user._id
            });


        if (!conversation) {

            return res.status(404).json({
                message: "Conversation not found."
            });

        }


        


        // ==========================================
        // SAVE USER MESSAGE
        // ==========================================

        await Message.create({

            conversationId: conversation._id,

            userId: req.user._id,

            role: "user",

            content: message.trim()

        });


        // ==========================================
        // GET HISTORY
        // ==========================================

        const history =
            await Message.find({

                conversationId:
                    conversation._id,

                userId:
                    req.user._id

            })
            .sort({
                createdAt: 1
            })
            .limit(20);


        // ==========================================
        // FORMAT HISTORY FOR OLLAMA
        // ==========================================

        const ollamaHistory =
            history.map(msg => ({

                role:
                    msg.role,

                content:
                    msg.content

            }));


        


       

        const answer =
            await chatAI(
                message.trim(),
                ollamaHistory
            );


        


        // ==========================================
        // SAVE AI RESPONSE
        // ==========================================

        await Message.create({

            conversationId:
                conversation._id,

            userId:
                req.user._id,

            role:
                "assistant",

            content:
                answer

        });


        // ==========================================
        // UPDATE CONVERSATION
        // ==========================================

        conversation.updatedAt =
            new Date();


        if (
            conversation.title === "New Chat"
        ) {

            conversation.title =
                message.length > 40
                    ? message.substring(0, 40) + "..."
                    : message;

        }


        await conversation.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            success: true,

            response:
                answer,

            conversationId:
                conversation._id

        });


    } catch (error) {

        console.error(
            "===================================="
        );

        console.error(
            "CHAT CONTROLLER ERROR"
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Name:",
            error.name
        );

        console.error(
            "Stack:",
            error.stack
        );

        console.error(
            "===================================="
        );


        return res.status(500).json({

            message:
                "Unable to process chat request.",

            error:
                error.message

        });

    }

};


// ==========================================
// CODE REVIEW
// ==========================================

const review = async (req, res) => {

    try {

        const result =
            await reviewCode(req.body);

        res.json(result);

    } catch (error) {

        console.error(
            "Code Review Error:",
            error
        );

        res.status(500).json({
            message: "Code review failed.",
            error: error.message
        });
    }
};


// ==========================================
// README
// ==========================================

const readme = async (req, res) => {

    try {

        
        const project = req.body;


        if (!project) {
            return res.status(400).json({
                message: "Project information is required."
            });
        }

        if (!project.name || !project.name.trim()) {
            return res.status(400).json({
                message: "Project name is required."
            });
        }

        const readme = await generateReadme(project);

        return res.status(200).json({
            success: true,
            readme
        });

    } catch (error) {

        console.error("====================================");
        console.error("README GENERATOR ERROR");
        console.error(error);
        console.error("====================================");

        return res.status(500).json({
            success: false,
            message: "Unable to generate README.",
            error: error.message
        });
    }
};


// ==========================================
// PORTFOLIO
// ==========================================
// ==========================================
// PORTFOLIO ANALYZER
// ==========================================

const portfolio = async (req, res) => {

    try {

        

        if (!req.body) {

            return res.status(400).json({
                message: "Portfolio data is required."
            });

        }

        const result =
            await analyzePortfolio(req.body);

        

        return res.json(result);

    } catch (error) {

        console.error(
            "===================================="
        );

        console.error(
            "PORTFOLIO ANALYZER ERROR"
        );

        console.error(
            error
        );

        console.error(
            "===================================="
        );

        return res.status(500).json({

            message:
                "Portfolio analysis failed.",

            error:
                error.message

        });

    }

};
// =====================================================
// DEBUG ASSISTANT
// =====================================================

const debugError = async (req, res) => {

    try {

        const { error } = req.body;

        if (!error || !error.trim()) {

            return res.status(400).json({
                message: "Error text is required."
            });

        }

        
        const result =
            await debugCodeError(error);

        

        res.json(result);

    } catch (error) {

        console.error(
            "Debug Controller Error:",
            error
        );

        res.status(500).json({
            message: "Debug analysis failed.",
            error: error.message
        });
    }
};



module.exports = {

    chat,

    review,

    readme,

    portfolio,
    debugError

};