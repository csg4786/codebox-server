const express = require("express");
const { registerUser, loginUser, getUsers, getUser, removeUser, updateUser, toggleBlock, changeRole, changePassword, handleRefreshToken, logoutUser } = require("../controllers/userCtrl");
const {authMiddleware, isAdmin, isAuthorised} = require("../middlewares/authMiddleware");
const { canUpdate } = require("../middlewares/updateUserMiddleware");
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/change-password', authMiddleware, changePassword);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logoutUser);
router.get('/', authMiddleware, isAdmin, getUsers);
router.get('/:id', authMiddleware, isAuthorised, getUser);
router.delete("/remove/:id", authMiddleware, isAdmin, removeUser);
router.patch("/update/:id", authMiddleware, isAuthorised, canUpdate, updateUser);
router.patch("/toggle-block/:id", authMiddleware, isAdmin, toggleBlock);
router.patch("/change-role/:id", authMiddleware, isAdmin, changeRole);

module.exports = router;