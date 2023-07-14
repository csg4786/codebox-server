const Task = require("../models/Task");
const asyncHandler = require("express-async-handler");
const { generateFile } = require("../utils/generateFile");
const { addTaskToQueue } = require("../utils/taskQueue");
const { validateMongoDbId } = require("../utils/validateMongoDbId");

const createTask = asyncHandler(async (req, res) => {
  const { language = "cpp", code } = req.body;

  console.log(language, "Length:", code.length);

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  
  // console.log(req.user);
  const filePath = await generateFile(language, code);
  
  const task = await new Task({ language, code, filePath, owner: req.user?.id }).save();
  // console.log(task);
  const taskId = task["_id"];
  addTaskToQueue(taskId);
  res.status(201).json({ taskId });
});

const getStatus = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  if (taskId === undefined) {
    return res.status(400).json({ success: false, error: "No task id in params!" });
  }

  const task = await Task.findById(taskId);

  if (task === undefined) {
    return res.status(400).json({ success: false, error: "No task found!" });
  }

  return res.status(200).json({ success: true, task });
});


const getTasks = asyncHandler(async (req, res) => {
  
  try {
    
    //Filtering
    const filter = { ...req.query};
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(element => {delete filter[element]});
    let filterStr = JSON.stringify(filter);
    filterStr = filterStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
    
    //Sorting
    const sortBy = (req.query.sort) ? req.query.sort.split(',').join(' ') : '-finishedAt';
    
    //Field Limiting
    const showFields = (req.query.fields) ? req.query.fields.split(',').join(' ') : '';

    //Pagination
    const page = (req.query.page) ? req.query.page : 1;
    const limit = (req.query.limit) ? req.query.limit : 10;
    const skip = (page - 1)*limit;
    
    const total = await Task.countDocuments(JSON.parse(filterStr));
    // console.log(total);
    // if (skip >= total) throw new Error("Page does not exist!");

    let filterQuery = await Task.find(JSON.parse(filterStr)).sort(sortBy).select(showFields).skip(skip).limit(limit);
    
    const productList = filterQuery;
    
    res.json({
      products: productList,
      count: productList.length,
      total: total,
      status: "success",
      message: "Tasks Fetch Successful!",
    });
        
  } catch (error) {
    throw new Error(error);
  }
});

const getTask = asyncHandler(async (req, res) => {
  try {
    validateMongoDbId(req.params.id);
    const task = await Task.findById(req.params.id);

    res.json({
      task: task._doc,
      status: "success",
      message: "Task Fetch Successful!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createTask, getStatus, getTasks, getTask };