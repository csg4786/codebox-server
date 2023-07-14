const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const {validateMongoDbId} = require("../utils/validateMongoDbId");
const crypto = require("crypto");

const registerUser = asyncHandler( async (req, res) => {
  
    //To check if the user already exists
    const oldUser = await User.findOne({ email: req.body.email });
    
    if (oldUser) {
        
        //The user already exists
        throw new Error("User already exists!");
        
    } else {
        
        // Its a new user
        const newUser = await User.create(req.body);
        delete newUser._doc.password; //To remove the password from the object
        
        res.json({
            ...newUser._doc, 
            status: "success", 
            message: "New user added!"
        });
    }
});

const loginUser  = asyncHandler( async (req, res) => {
    
    //To check if the user already exists
    const user = await User.findOne({ email: req.body.email });
    
    if (user && (await user.checkPassword(req.body.password))) {
        
        //The user exists
        delete user._doc.password; //To remove the password from the object
        const refreshToken = await generateRefreshToken(user?._id);
        const updatedUser = await User.findByIdAndUpdate(user.id,{refreshToken: refreshToken,},{ new: true });
        res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
        });

        res.json({
            ...updatedUser._doc, 
            token: generateToken(user._id), 
            status: "success",
            message: "Login Successful!", 
        });
    
    } else {

      //wrong email or password.
      throw new Error("Invalid Credentials!");
    }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies!");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("Refresh Token not found!");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Something went wrong with refresh token!");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies!");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (user) {
    await User.findOneAndUpdate(refreshToken, {
      refreshToken: "",
    });
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});


//To get a list of users
const getUsers = asyncHandler( async (req, res) => {

    try {

        const usersList = await User.find();

        usersList.forEach(user => {
            delete user._doc.password;
        });

        res.json({
            users : usersList, 
            status : "success",
            message : "Users Fetch Successful!",
        });

    } catch (error) {
        throw new Error(error);
    }
});

//To get a specific user
const getUser = asyncHandler( async (req, res) => {

    try {

        validateMongoDbId(req.params.id);
        const target = await User.findById(req.params.id);
        delete target._doc.password;
        res.json({
            user : target._doc,
            status : "success",
            message : "User Fetch Successful!"
        });
        
    } catch (error) {
        throw new Error(error);
    }
})

//To remove a specific user
const removeUser = asyncHandler( async (req, res) => {
    
    try {
        
        validateMongoDbId(req.params.id);
        const target = await User.findByIdAndDelete(req.params.id);
        delete target._doc.password;
        res.json({
            user : target._doc,
            status : "success",
            message : "User Deleted!"
        });
        
    } catch (error) {
        throw new Error(error);
    }
})

//To update a specific user
const updateUser = asyncHandler( async (req, res) => {
    
    try {
        
        validateMongoDbId(req.params.id);
        const target = await User.findOneAndUpdate({_id : req.params.id}, {$set : req.body});
        delete target._doc.password;
        res.json({
            user : target._doc,
            status : "success",
            message : "User Updated!"
        });
        
    } catch (error) {
        // console.log(error);
        throw new Error(error);
    }
});

//To toggle block and unblock
const toggleBlock = asyncHandler( async (req, res) => {
    
    try {
        
        validateMongoDbId(req.params.id);
        const target = await User.findById(req.params.id);
        
        const toggle = await User.findOneAndUpdate({_id: req.params.id}, {$set: {isBlocked : !target._doc.isBlocked}});
        res.json({
            status : "success",
            message : `User ${toggle._doc.isBlocked ? "un" : ""}blocked!`,
        });
        
    } catch (error) {
        throw new Error(error);
    }
});

//To grant and revoke admin status
const changeRole = asyncHandler( async (req, res) => {
    
    try {
        
        validateMongoDbId(req.params.id);
        const target = await User.findById(req.params.id);

        const toggle = await User.findOneAndUpdate({_id: req.params.id}, {$set: {role : ((target._doc.role === "Admin") ? "User" : "Admin")}});
        res.json({
          status: "success",
          message: `Role changed to ${(toggle._doc.role === "Admin") ? "User" : "Admin"}!`,
        });
        
    } catch (error) {
        throw new Error(error);
    }
});

//To change password
const changePassword = asyncHandler( async (req, res) => {
    
    try {
        
        validateMongoDbId(req.user.id);
        const target = await User.findById(req.user.id);

        target.password = req.body.password;
        const changed = await target.save();
        
        res.json({
            user: changed._doc,
          status: "success",
          message: `Password Changed!`,
        });
        
    } catch (error) {
        throw new Error(error);
    }
});

//To enable Forgot-Password


module.exports = {registerUser, loginUser, getUsers, getUser, removeUser, updateUser, toggleBlock, changeRole, handleRefreshToken, logoutUser, changePassword};