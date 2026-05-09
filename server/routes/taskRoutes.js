const express = require("express")

const router = express.Router()

const protect = require("../middleware/authMiddleware")
const authorizeRoles = require("../middleware/roleMiddleware")

const {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController")

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createTask
)

router.get(
  "/project/:projectId",
  protect,
  getTasksByProject
)

router.put(
  "/:id/status",
  protect,
  updateTaskStatus
)

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteTask
)

module.exports = router