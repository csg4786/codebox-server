const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler( async (req, res, next) => {
    let token;
    // console.log(req)
    if (req?.headers?.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(' ')[1];
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(verified?.id);
            req.user = user;
            next();
        } catch (error) {
            throw new Error(error);
        }
    } else {
        throw new Error("No token attached to header!")
    }
});

const isAuthorised = asyncHandler( async (req, res, next) => {
    if (req.user.role !== "Admin") {
        if (req.user.id === req.params.id) {
            if (!req.user.isBlocked) {
                next();
            } else {
                throw new Error("Permission Denied! User is Blocked!");
            }
        } else {
            throw new Error("Permission Denied! Unauthorised Access!");
        }
    } else {
        next();
    }
});

const isAdmin = asyncHandler( async (req, res, next) => {
    if (req.user.role !== "Admin") {
        throw new Error("Permission Denied! Admin Access Required!");
    } else {
        next();
    }
});

module.exports = {authMiddleware, isAuthorised, isAdmin};