const Message = require("../models/message.model.js");
const Conversation = require("../models/conversation.model.js");
const { asyncHandler } = require("../utilities/asyncHandler.utility.js");
const { ErrorHandler } = require("../utilities/errorHandler.utility.js");
const { getSocketId, io } = require("../socket/socket.js");

exports.sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  const message = req.body.message;

  if (!senderId || !receiverId || !message) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  let conversation;
  // First, check if receiverId is a conversation ID (for groups)
  conversation = await Conversation.findOne({ _id: receiverId });

  if (!conversation || !conversation.isGroup) {
    // If not a group conversation by ID, or doesn't exist, try finding/creating private conversation
    conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      isGroup: false,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
  }

  const newMessage = await Message.create({
    senderId,
    receiverId: conversation.isGroup ? null : receiverId,
    message,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }

  // Populate sender info for real-time UI
  const populatedMessage = await Message.findById(newMessage._id).populate("senderId", "username avatar");

  // socket.io logic for group vs private
  if (conversation.isGroup) {
    conversation.participants.forEach(participantId => {
      // Don't emit back to sender (optional, but usually handled by frontend)
      if (participantId.toString() === senderId.toString()) return;

      const socketId = getSocketId(participantId);
      if (socketId) io.to(socketId).emit("newMessage", populatedMessage);
    });
  } else {
    const socketId = getSocketId(receiverId);
    if (socketId) io.to(socketId).emit("newMessage", populatedMessage);
  }

  res.status(200).json({
    success: true,
    responseData: populatedMessage,
  });
});

exports.getMessages = asyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const otherParticipantId = req.params.otherParticipantId;

  if (!myId || !otherParticipantId) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  let conversation;

  // Try finding by conversation ID first (useful for groups)
  conversation = await Conversation.findById(otherParticipantId).populate({
    path: 'messages',
    populate: {
      path: 'senderId',
      select: 'username avatar'
    }
  });

  if (!conversation) {
    // Fallback to finding by participants (for private chats)
    conversation = await Conversation.findOne({
      participants: { $all: [myId, otherParticipantId] },
      isGroup: false,
    }).populate({
      path: 'messages',
      populate: {
        path: 'senderId',
        select: 'username avatar'
      }
    });
  }

  res.status(200).json({
    success: true,
    responseData: conversation,
  });
});
