const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


// ==========================================
// CREATE CONVERSATION
// ==========================================

const createConversation = async (req, res) => {

    try {

        const conversation =
            await Conversation.create({
                userId: req.user._id,
                title: "New Chat"
            });

        res.status(201).json({
            success: true,
            conversation
        });

    } catch (error) {

        console.error(
            "CREATE CONVERSATION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to create conversation."
        });
    }
};


// ==========================================
// GET USER CONVERSATIONS
// ==========================================

const getConversations = async (req, res) => {

    try {

        const conversations =
            await Conversation.find({
                userId: req.user._id
            })
            .sort({
                updatedAt: -1
            });


        res.json({
            success: true,
            conversations
        });

    } catch (error) {

        console.error(
            "GET CONVERSATIONS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to load conversations."
        });
    }
};


// ==========================================
// GET MESSAGES
// ==========================================

const getMessages = async (req, res) => {

    try {

        const { conversationId } = req.params;


        // Make sure conversation belongs
        // to the authenticated user

        const conversation =
            await Conversation.findOne({
                _id: conversationId,
                userId: req.user._id
            });


        if (!conversation) {

            return res.status(404).json({
                success: false,
                message: "Conversation not found."
            });

        }


        const messages =
            await Message.find({
                conversationId,
                userId: req.user._id
            })
            .sort({
                createdAt: 1
            });


        res.json({
            success: true,
            messages
        });

    } catch (error) {

        console.error(
            "GET MESSAGES ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to load messages."
        });
    }
};


// ==========================================
// DELETE CONVERSATION
// ==========================================

const deleteConversation = async (req, res) => {

    try {

        const { conversationId } = req.params;


        const conversation =
            await Conversation.findOneAndDelete({
                _id: conversationId,
                userId: req.user._id
            });


        if (!conversation) {

            return res.status(404).json({
                success: false,
                message: "Conversation not found."
            });

        }


        await Message.deleteMany({
            conversationId,
            userId: req.user._id
        });


        res.json({
            success: true,
            message: "Conversation deleted."
        });

    } catch (error) {

        console.error(
            "DELETE CONVERSATION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to delete conversation."
        });
    }
};


module.exports = {
    createConversation,
    getConversations,
    getMessages,
    deleteConversation
};