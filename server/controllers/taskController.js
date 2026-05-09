const Task = require("../models/Task")

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      projectId,
    } = req.body

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      projectId,
      createdBy: req.user.id,
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({
      projectId: req.params.projectId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name")

    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      })
    }

    task.status = status

    await task.save()

    res.status(200).json(task)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      })
    }

    await task.deleteOne()

    res.status(200).json({
      message: "Task deleted",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  deleteTask,
}