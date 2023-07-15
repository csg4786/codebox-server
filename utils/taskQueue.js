const Queue = require("bull");
const asyncHandler = require("express-async-handler");

const Task = require("../models/Task");
const { executeCpp, executePy, executeC, executeJS, executePhp } = require("../controllers/codeCtrl");

const taskQueue = new Queue("task-runner-queue", process.env.REDIS_URL);
const NUM_WORKERS = 5;

taskQueue.process(NUM_WORKERS, async ({ data }) => {
    // console.log(data);
    const taskId = data.id;
    const task = await Task.findById(taskId);
    if (task === undefined) {
        throw Error(`cannot find Task with id ${taskId}`);
    }
    task["startedAt"] = new Date();
    try {
        let output;
        // console.log(task);
        if (task.language === "cpp") {
            output = await executeCpp(task.filePath);
        } else if (task.language === "py") {
            output = await executePy(task.filePath);
        } else if (task.language === "c") {
            output = await executeC(task.filePath);
        } else if (task.language === "js") {
            output = await executeJS(task.filePath);
        } else if (task.language === "php") {
            output = await executePhp(task.filePath);
        }
        task["finishedAt"] = new Date();
        task["output"] = output;
        task["status"] = "success";

        await task.save();
        return true;
    } catch (err) {
        task["finishedAt"] = new Date();
        task["output"] = JSON.stringify(err);
        task["status"] = "error";
        await task.save();
        throw Error(JSON.stringify(err));
    }
});

taskQueue.on("failed", (error) => {
    console.error(error.data.id, error.failedReason);
});

const addTaskToQueue = asyncHandler( async (taskId) => {
    taskQueue.add({ id: taskId });
});

module.exports = { addTaskToQueue };