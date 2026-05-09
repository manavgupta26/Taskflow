const express = require("express")
const cors = require("cors")
require("dotenv").config()
const authRoutes = require("./routes/authRoutes")
const connectDB = require("./config/db")
const projectRoutes = require("./routes/projectRoutes")
const taskRoutes = require("./routes/taskRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const app = express()

connectDB()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.get("/", (req, res) => {
  res.send("API Running")
})
const protect = require("./middleware/authMiddleware")

app.get("/api/test", protect, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  })
})
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})