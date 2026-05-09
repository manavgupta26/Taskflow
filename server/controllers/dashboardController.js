const Task = require("../models/Task")

const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments()

    const completedTasks = await Task.countDocuments({
      status: "completed",
    })

    const pendingTasks = await Task.countDocuments({
      status: {
        $ne: "completed",
      },
    })

    const overdueTasks = await Task.countDocuments({
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