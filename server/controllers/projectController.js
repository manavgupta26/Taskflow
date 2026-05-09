const User = require("../models/User")

const Project = require("../models/Project")

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body

    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
      members: [req.user.id],
    })

    res.status(201).json(project)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    }).populate("members", "name email role")

    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    ).populate(
      "members",
      "name email role"
    )

    res.status(200).json(project)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const addMember = async (req, res) => {
  try {
    const { userId } = req.body

    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      })
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId)
    }

    await project.save()

    res.status(200).json({
      message: "Member added",
      project,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const addMemberByEmail = async (
  req,
  res
) => {
  try {
    const { email } = req.body

    const user = await User.findOne({
      email,
    })

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    const project = await Project.findById(
      req.params.id
    )

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      })
    }

    if (
      !project.members.includes(user._id)
    ) {
      project.members.push(user._id)
    }

    await project.save()

    res.status(200).json({
      message: "Member added",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  createProject,
  getProjects,
  addMember,
  getSingleProject,
  addMemberByEmail,
}