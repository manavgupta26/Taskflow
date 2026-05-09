const express = require("express")

const router = express.Router()

const protect = require("../middleware/authMiddleware")
const authorizeRoles = require("../middleware/roleMiddleware")

const {
  createProject,
  getProjects,
  addMember,
  getSingleProject,
  addMemberByEmail,
} = require("../controllers/projectController")

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createProject
)

router.get("/", protect, getProjects)
router.get(
  "/:id",
  protect,
  getSingleProject
)
router.put(
  "/:id/add-member",
  protect,
  authorizeRoles("admin"),
  addMember
)
router.put(
  "/:id/add-member-email",
  protect,
  authorizeRoles("admin"),
  addMemberByEmail
)

module.exports = router