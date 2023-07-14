const express = require("express");
const { createTask, getStatus, getTasks, getTask } = require("../controllers/taskCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/run', authMiddleware, createTask);
router.get('/status/:id', authMiddleware, getStatus);
router.get('/tasks', authMiddleware, getTasks);
router.get('/task/:id', authMiddleware, getTask);

module.exports = router;