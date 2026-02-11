const Conversation = require("../models/conversation.model.js");
const { asyncHandler } = require("../utilities/asyncHandler.utility.js");
const { ErrorHandler } = require("../utilities/errorHandler.utility.js");

exports.createGroup = asyncHandler(async (req, res, next) => {
    const { participants, groupName } = req.body;
    const adminId = req.user._id;

    if (!participants || !groupName) {
        return next(new ErrorHandler("Group name and participants are required", 400));
    }

    // Add the admin to the participants list if not already there
    const allParticipants = JSON.parse(participants);
    if (!allParticipants.includes(adminId.toString())) {
        allParticipants.push(adminId.toString());
    }

    if (allParticipants.length < 2) {
        return next(new ErrorHandler("Group must have at least 2 members", 400));
    }

    const groupConversation = await Conversation.create({
        participants: allParticipants,
        isGroup: true,
        groupName,
        groupAdmin: adminId,
    });

    res.status(201).json({
        success: true,
        responseData: groupConversation,
    });
});

exports.getGroups = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const groups = await Conversation.find({
        participants: userId,
        isGroup: true,
    }).populate("participants", "-password");

    res.status(200).json({
        success: true,
        responseData: groups,
    });
});
