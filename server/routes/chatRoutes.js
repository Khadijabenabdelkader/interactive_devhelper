const express = require("express");

const router = express.Router();

const {
    createConversation,
    getConversations,
    getMessages,
    deleteConversation
} = require("../controllers/chatController");

const authMiddleware =
    require("../middlewares/authMiddleware");


router.post(
    "/conversations",
    authMiddleware,
    createConversation
);


router.get(
    "/conversations",
    authMiddleware,
    getConversations
);


router.get(
    "/conversations/:conversationId/messages",
    authMiddleware,
    getMessages
);


router.delete(
    "/conversations/:conversationId",
    authMiddleware,
    deleteConversation
);


module.exports = router;