const Task = require("../models/Task")
const Project = require("../models/Project")

const getDashboardData = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    })

    const projectIds = projects.map(
      (project) => project._id
    )

    const totalTasks = await Task.countDocuments({
      projectId: {
        $in: projectIds,
      },
    })

    const completedTasks = await Task.countDocuments({
      projectId: {
        $in: projectIds,
      },
      status: "completed",
    })

    const pendingTasks = await Task.countDocuments({
      projectId: {
        $in: projectIds,
      },
      status: {
        $ne: "completed",
      },
    })

    const overdueTasks = await Task.countDocuments({
      projectId: {
        $in: projectIds,
      },
      dueDate: {
        $lt: new Date(),
      },
      status: {
        $ne: "completed",
      },
    })

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  getDashboardData,
}