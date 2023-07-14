const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const canUpdate = asyncHandler( async (req, res, next) => {

    if (req.user?.email === req.body?.email || req.user?.role === "Admin") {
        if (req.user?.mobile === req.body?.mobile || req.user?.role === "Admin") {
            next();
        } else {
            const oldMobile = await User.findOne({mobile: req.body.mobile});
            if (!oldMobile) {
                next();
            } else {
                throw new Error("Mobile No. Already in Use!");
            }
        }
    } else {
        const oldEmail = await User.findOne({email: req.body.email});
        if (!oldEmail) {
            if (req.user?.mobile === req.body?.mobile || req.user?.role === "Admin") {
                next();
            } else {
                const oldMobile = await User.findOne({mobile: req.body.mobile});
                if (!oldMobile) {
                    next();
                } else {
                    throw new Error("Mobile No. Already in Use!");
                }
            }
        } else {
            throw new Error("Email Already in Use!");
        }
    }
});

module.exports = {canUpdate}