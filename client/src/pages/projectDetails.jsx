import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../services/api"

const PRIORITY_COLORS = {
  low:    { bg: "#f0fdf4", text: "#16a34a", dot: "#16a34a" },
  medium: { bg: "#fffbeb", text: "#d97706", dot: "#d97706" },
  high:   { bg: "#fef2f2", text: "#dc2626", dot: "#dc2626" },
}

const STATUS_COLUMNS = [
  { key: "todo",        label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed",   label: "Completed" },
]

function projectDetails() {
  const { id } = useParams()
  const [tasks, setTasks] = useState([])
  const [project, setProject] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", priority: "medium", dueDate: "", assignedTo: "" })
  const [memberEmail, setMemberEmail] = useState("")

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`)
      setProject(res.data)
      if (res.data.members?.length > 0) {
        setFormData((prev) => ({ ...prev, assignedTo: res.data.members[0]._id }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/project/${id}`)
      setTasks(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { fetchTasks(); fetchProject() }, [])

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const createTask = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post("/tasks", { ...formData, projectId: id })
      setFormData({ title: "", description: "", priority: "medium", dueDate: "" })
      setShowForm(false)
      fetchTasks()
    } catch (error) {
      alert(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}/status`, { status })
      fetchTasks()
    } catch (error) {
      console.log(error)
    }
  }

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status)

  const addMember = async (e) => {
    e.preventDefault()
    try {
      await API.put(`/projects/${id}/add-member-email`, { email: memberEmail })
      setMemberEmail("")
      fetchProject()
      alert("Member added")
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pd-root { min-height: 100vh; background: #f7f6f3; font-family: 'Sora', sans-serif; }

        .topbar {
          background: #fff; border-bottom: 1px solid #ebebeb;
          padding: 0 40px; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .topbar-logo { font-family: 'JetBrains Mono', monospace; font-size: 14px; letter-spacing: 0.08em; color: #0e0e0e; }
        .topbar-back { font-size: 13px; color: #666; text-decoration: none; transition: color 0.2s; }
        .topbar-back:hover { color: #0e0e0e; }

        .pd-main { padding: 40px; max-width: 1200px; margin: 0 auto; animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .pd-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px; }
        .pd-header h1 { font-size: 28px; font-weight: 600; color: #0e0e0e; letter-spacing: -0.02em; }
        .pd-header p { font-size: 13px; color: #999; margin-top: 4px; }

        .btn-new {
          background: #0e0e0e; color: #fff; border: none;
          padding: 10px 18px; border-radius: 10px; font-size: 13px;
          font-family: 'Sora', sans-serif; font-weight: 500; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-new:hover { opacity: 0.85; transform: translateY(-1px); }

        /* FORM */
        .form-panel {
          background: #fff; border: 1px solid #ebebeb; border-radius: 14px;
          padding: 28px 28px; margin-bottom: 28px;
          animation: slideDown 0.25s ease both;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

        .form-panel h2 { font-size: 15px; font-weight: 600; color: #0e0e0e; margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .form-full { margin-bottom: 14px; }

        .field-group label { display: block; font-size: 11px; font-weight: 500; color: #666; margin-bottom: 6px; letter-spacing: 0.05em; text-transform: uppercase; }
        .field-group input, .field-group textarea, .field-group select {
          width: 100%; border: 1.5px solid #e2e2e2; background: #fff;
          padding: 10px 13px; border-radius: 9px; font-size: 13px;
          font-family: 'Sora', sans-serif; color: #0e0e0e;
          transition: border-color 0.2s, box-shadow 0.2s; outline: none; resize: none;
        }
        .field-group input:focus, .field-group textarea:focus, .field-group select:focus {
          border-color: #0e0e0e; box-shadow: 0 0 0 3px rgba(14,14,14,0.06);
        }
        .field-group input::placeholder, .field-group textarea::placeholder { color: #bbb; }

        .member-panel {
          background: #fff; border: 1px solid #ebebeb; border-radius: 14px;
          padding: 24px 28px; margin-bottom: 16px;
          display: flex; align-items: flex-end; gap: 12px;
        }
        .member-panel .field-group { flex: 1; margin: 0; }
        .btn-add-member {
          background: #0e0e0e; color: #fff; border: none;
          padding: 10px 20px; border-radius: 9px; font-size: 13px;
          font-family: 'Sora', sans-serif; font-weight: 500; cursor: pointer;
          white-space: nowrap; transition: opacity 0.2s;
          flex-shrink: 0;
        }
        .btn-add-member:hover { opacity: 0.85; }
        .btn-cancel {
          background: none; border: 1.5px solid #e2e2e2; color: #666;
          padding: 9px 18px; border-radius: 9px; font-size: 13px;
          font-family: 'Sora', sans-serif; cursor: pointer;
        }
        .btn-submit {
          background: #0e0e0e; color: #fff; border: none;
          padding: 9px 20px; border-radius: 9px; font-size: 13px;
          font-family: 'Sora', sans-serif; font-weight: 500; cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-submit:disabled { opacity: 0.5; }

        /* KANBAN */
        .kanban { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: start; }

        .column { background: #fff; border: 1px solid #ebebeb; border-radius: 14px; overflow: hidden; }

        .col-header {
          padding: 16px 20px; border-bottom: 1px solid #f0f0f0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .col-header-left { display: flex; align-items: center; gap: 10px; }
        .col-dot { width: 8px; height: 8px; border-radius: 50%; }
        .col-title { font-size: 13px; font-weight: 600; color: #0e0e0e; }
        .col-count { font-size: 12px; color: #aaa; background: #f7f6f3; padding: 2px 8px; border-radius: 99px; }

        .col-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }

        .task-card {
          background: #fafafa; border: 1px solid #f0f0f0; border-radius: 10px;
          padding: 16px;
          animation: fadeUp 0.3s ease both;
        }

        .task-title { font-size: 14px; font-weight: 600; color: #0e0e0e; margin-bottom: 6px; }
        .task-desc { font-size: 12px; color: #888; line-height: 1.5; margin-bottom: 12px; }

        .task-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }

        .assigned-chip {
          font-size: 11px; color: #666; background: #f0f0f0;
          padding: 3px 9px; border-radius: 99px; white-space: nowrap;
        }

        .priority-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 99px;
        }
        .priority-dot { width: 5px; height: 5px; border-radius: 50%; }

        .status-select {
          font-size: 11px; font-family: 'Sora', sans-serif; font-weight: 500;
          border: 1.5px solid #e2e2e2; background: #fff; color: #555;
          padding: 5px 10px; border-radius: 7px; cursor: pointer; outline: none;
          transition: border-color 0.2s;
        }
        .status-select:hover { border-color: #aaa; }

        .empty-col { padding: 32px 20px; text-align: center; }
        .empty-col p { font-size: 13px; color: #ccc; }
      `}</style>

      <div className="pd-root">
        <header className="topbar">
          <div className="topbar-logo">TASKFLOW</div>
          <a href="/projects" className="topbar-back">← Projects</a>
        </header>

        <main className="pd-main">
          <div className="pd-header">
            <div>
              <h1>Project Tasks</h1>
              <p>{tasks.length} task{tasks.length !== 1 ? "s" : ""} across {STATUS_COLUMNS.length} stages</p>
            </div>
            {user.role === "admin" && (
              <button className="btn-new" onClick={() => setShowForm(!showForm)}>
                {showForm ? "✕ Cancel" : "+ Add Task"}
              </button>
            )}
          </div>

          {user.role === "admin" && (
            <form className="member-panel" onSubmit={addMember}>
              <div className="field-group">
                <label>Add Member by Email</label>
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-add-member">+ Add Member</button>
            </form>
          )}

          {showForm && user.role === "admin" && (
            <div className="form-panel">
              <h2>New Task</h2>
              <form onSubmit={createTask}>
                <div className="form-grid">
                  <div className="field-group">
                    <label>Title</label>
                    <input type="text" name="title" placeholder="Task name" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="field-group">
                    <label>Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleChange}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label>Assign To</label>
                    <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                      {project?.members?.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name} ({member.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group">
                    <label>Due Date</label>
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-full field-group">
                  <label>Description</label>
                  <textarea name="description" placeholder="Optional details…" rows={2} value={formData.description} onChange={handleChange} />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Creating…" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="kanban">
            {STATUS_COLUMNS.map(({ key, label }) => {
              const colTasks = getTasksByStatus(key)
              const dotColor = key === "todo" ? "#bbb" : key === "in-progress" ? "#d97706" : "#16a34a"
              return (
                <div className="column" key={key}>
                  <div className="col-header">
                    <div className="col-header-left">
                      <div className="col-dot" style={{ background: dotColor }} />
                      <span className="col-title">{label}</span>
                    </div>
                    <span className="col-count">{colTasks.length}</span>
                  </div>

                  <div className="col-body">
                    {colTasks.length === 0 ? (
                      <div className="empty-col"><p>No tasks</p></div>
                    ) : colTasks.map((task, i) => {
                      const pc = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium
                      return (
                        <div className="task-card" key={task._id} style={{ animationDelay: `${i * 0.05}s` }}>
                          <div className="task-title">{task.title}</div>
                          {task.description && <div className="task-desc">{task.description}</div>}
                          <div className="task-meta">
                            <span className="priority-badge" style={{ background: pc.bg, color: pc.text }}>
                              <span className="priority-dot" style={{ background: pc.dot }} />
                              {task.priority}
                            </span>
                            {task.assignedTo?.name && (
                              <span className="assigned-chip">👤 {task.assignedTo.name}</span>
                            )}
                            <select
                              className="status-select"
                              value={task.status}
                              onChange={(e) => updateStatus(task._id, e.target.value)}
                            >
                              <option value="todo">To Do</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </>
  )
}

export default projectDetails