// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//     {
//         roomId: {
//             type: String,
//             required: true,
//             index: true,
//         },
//         senderEmail: {
//             type: String,
//             required: true,
//         },
//         senderName: {
//             type: String,
//             required: true,
//         },
//         receiverEmail: {
//             type: String,
//             required: true,
//         },
//         text: {
//             type: String,
//             required: true,
//             trim: true,
//             maxlength: 1000,
//         },
//         isRead: {
//             type: Boolean,
//             default: false,
//         },
//     },
//     { timestamps: true }
// );

// // Room ID always sorted so A->B and B->A give same room
// messageSchema.statics.getRoomId = (emailA, emailB) => {
//     return [emailA, emailB].sort().join("__");
// };

// const Message = mongoose.model("Message", messageSchema);
// export default Message;






import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
            index: true,
        },
        senderEmail: {
            type: String,
            required: true,
        },
        senderName: {
            type: String,
            required: true,
        },
        receiverEmail: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
        // ✅ NEW: image support
        imageUrl: {
            type: String,
            default: null,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        // Emails for whom this message is hidden (delete-for-me)
        hiddenFor: {
            type: [String],
            default: [],
        },
        // Sender unsent the message for everyone
        deletedForEveryone: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Room ID always sorted so A->B and B->A give same room
messageSchema.statics.getRoomId = (emailA, emailB) => {
    return [emailA, emailB].sort().join("__");
};

const Message = mongoose.model("Message", messageSchema);
export default Message;