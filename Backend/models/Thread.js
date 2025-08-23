// import mongoose from 'mongoose';

// const messageSchema = new mongoose.Schema({
//     role: {
//         type: String,
//         enum: ['user', 'assistant'],
//         required: true
//     },
//     content: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// const ThreadSchema = new mongoose.Schema({
//     threadId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     title: {
//         type: String,
//         default: "New Chat"
//     },
//     message: [messageSchema],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// export default mongoose.model('Thread', ThreadSchema);

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ThreadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    message: [messageSchema],

    // ✅ Link thread to a specific user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // must match User model name
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Thread', ThreadSchema);
