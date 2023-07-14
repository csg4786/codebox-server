const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
    {
        language: {
            type: String,
            required: true,
            enum: ["c", "cpp", "java", "js", "php", "py", ],
        },
        code: {
            type: String,
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        startedAt: {
            type: Date,
        },
        finishedAt: {
            type: Date,
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "success", "error"],
        },
        output: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

// default export
module.exports = mongoose.model("Task", TaskSchema);