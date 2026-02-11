const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.middlware.js");
const {
  getMessages,
  sendMessage,
} = require("../controllers/message.controller.js");

const router = express.Router();

router.post("/send/:receiverId", isAuthenticated, sendMessage);
router.get("/get-messages/:otherParticipantId", isAuthenticated, getMessages);

module.exports = router;
