const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "User",
        },
        isBlocked : {
            type: Boolean,
            default: false,
        },
        refreshToken: String,
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

userSchema.pre('save', async function(next) {
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALTROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.checkPassword = async function (passWord) {
    return await bcrypt.compare(passWord, this.password);
}
userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  return resettoken;
};

module.exports = mongoose.model("User", userSchema);