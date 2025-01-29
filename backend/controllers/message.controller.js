import { Conversation } from "../models/conversation.model.js";

// for chatting.


// send Massage.
export const sendMassage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        // set participants.
        let conversation = await Conversation.findOne({
            participants: { $all: { senderId, receiverId } }
        });

        // establish the conversation if not started yet.
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if (newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        // implement socket io for real time data transfer.

        return res.status(200).json({
            success: true,
            newMessage
        })

    } catch (error) {
        console.log(error);
    }
}

// get Message.
export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.find({
            participants: { $all: [senderId, receiverId] }
        });
        if (!conversation) return res.status(404).json({ success: true, messages: [] });

        return res.status(200).json({ success: true, messages: conversation?.messages });
    } catch (error) {
        console.log(error);
    }
}