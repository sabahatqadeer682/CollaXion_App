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
        // Media URLs
        imageUrl: { type: String, default: null },
        videoUrl: { type: String, default: null },
        audioUrl: { type: String, default: null },
        audioDuration: { type: Number, default: 0 }, // seconds
        documentUrl: { type: String, default: null },
        documentName: { type: String, default: null },
        documentSize: { type: Number, default: 0 }, // bytes
        documentMime: { type: String, default: null },

        // Call records (logged after a call ends)
        callType: { type: String, enum: ["audio", "video", null], default: null },
        callStatus: {
            type: String,
            enum: ["missed", "answered", "declined", "cancelled", "ended", null],
            default: null,
        },
        callDuration: { type: Number, default: 0 }, // seconds

        isRead: { type: Boolean, default: false },
        hiddenFor: { type: [String], default: [] },
        deletedForEveryone: { type: Boolean, default: false },

        // Forwarded flag (WhatsApp-style label)
        isForwarded: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Room ID always sorted so A->B and B->A give same room
messageSchema.statics.getRoomId = (emailA, emailB) => {
    return [emailA, emailB].sort().join("__");
};

const Message = mongoose.model("Message", messageSchema);
export default Message;