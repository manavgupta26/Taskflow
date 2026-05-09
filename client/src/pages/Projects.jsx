import { useEffect, useState } from "react"
import API from "../services/api"

function Projects() {
  const [projects, setProjects] = useState([])
  const [formData, setFormData] = useState({ title: "", description: "" })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects")
      setProjects(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post("/projects", formData)
      setFormData({ title: "", description: "" })
      setShowForm(false)
      fetchProjects()
    } catch (error) {
      alert(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .proj-root { min-height: 100vh; background: #f7f6f3; font-family: 'Sora', sans-serif; }

        .topbar {
          background: #fff; border-bottom: 1px solid #ebebeb;
          padding: 0 40px; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .topbar-logo { font-family: 'JetBrains Mono', monospace; font-size: 14px; letter-spacing: 0.08em; color: #0e0e0e; }
        .topbar-back {
          font-size: 13px; color: #666; text-decoration: none;
          display: flex; align-items: center; gap: 6px;
          transition: color 0.2s;
        }
        .topbar-back:hover { color: #0e0e0e; }

        .proj-main { padding: 48px 40px; max-width: 1100px; margin: 0 auto; animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .proj-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 40px; }
        .proj-header h1 { font-size: 30px; font-weight: 600; color: #0e0e0e; letter-spacing: -0.02em; }
        .proj-header p { font-size: 14px; color: #999; margin-top: 4px; }

        .btn-new {
          background: #0e0e0e; color: #fff; border: none;
          padding: 11px 20px; border-radius: 10px; font-size: 13px;
          font-family: 'Sora', sans-serif; font-weight: 500; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-new:hover { opacity: 0.85; transform: translateY(-1px); }

        /* CREATE FORM */
        .form-panel {
          background: #fff; border: 1px solid #ebebeb; border-radius: 14px;
          padding: 28px 32px; margin-bottom: 32px;
          animation: slideDown 0.25s ease both;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

        .form-panel h2 { font-size: 16px; font-weight: 600; color: #0e0e0e; margin-bottom: 20px; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .field-group label { display: block; font-size: 11px; font-weight: 500; color: #555; margin-bottom: 7px; letter-spacing: 0.05em; text-transform: uppercase; }
        .field-group input, .field-group textarea {
          width: 100%; border: 1.5px solid #e2e2e2; background: #fff;
          padding: 11px 14px; border-radius: 10px; font-size: 14px;
          font-family: 'Sora', sans-serif; color: #0e0e0e;
          transition: border-color 0.2s, box-shadow 0.2s; outline: none; resize: none;
        }
        .field-group input:focus, .field-group textarea:focus {
          border-color: #0e0e0e; box-shadow: 0 0 0 3px rgba(14,14,14,0.06);
        }
        .field-group input::placeholder, .field-group textarea::placeholder { color: #bbb; }

        .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }
        .btn-cancel {
          background: none; border: 1.5px solid #e2e2e2; color: #666;
          padding: 10px 20px; border-radius: 10px; font-size: 13px;
          font-family: 'Sora', sans-serif; cursor: pointer; transition: border-color 0.2s;
        }
        .btn-cancel:hover { border-color: #aaa; }
        .btn-submit {
          background: #0e0e0e; color: #fff; border: none;
          padding: 10px 22px; border-radius: 10px; font-size: 13px;
          font-family: 'Sora', sans-serif; font-weight: 500; cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-submit:disabled { opacity: 0.5; }

        /* PROJECT GRID */
        .proj-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        .proj-card {
          background: #fff; border: 1px solid #ebebeb; border-radius: 14px;
          padding: 28px 24px; display: flex; flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
          animation: fadeUp 0.4s ease both;
        }
        .proj-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.07); transform: translateY(-2px); }

        .proj-card-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: #f0f0f0; display: flex; align-items: center; justify-content: center;
          font-size: 18px; margin-bottom: 18px;
        }

        .proj-card h2 { font-size: 16px; font-weight: 600; color: #0e0e0e; margin-bottom: 8px; }
        .proj-card p { font-size: 13px; color: #888; line-height: 1.6; flex: 1; }

        .btn-open {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 22px; font-size: 13px; font-weight: 500;
          color: #0e0e0e; text-decoration: none;
          border-top: 1px solid #f0f0f0; padding-top: 18px;
          transition: gap 0.2s;
        }
        .btn-open:hover { gap: 10px; }

        .empty-state {
          grid-column: 1/-1; text-align: center; padding: 80px 40px;
          background: #fff; border: 1px solid #ebebeb; border-radius: 14px;
        }
        .empty-state p { color: #bbb; font-size: 15px; }
      `}</style>

      <div className="proj-root">
        <header className="topbar">
          <div className="topbar-logo">TASKFLOW</div>
          <a href="/dashboard" className="topbar-back">← Dashboard</a>
        </header>

        <main className="proj-main">
          <div className="proj-header">
            <div>
              <h1>Projects</h1>
              <p>{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
            </div>
            {user.role === "admin" && (
              <button className="btn-new" onClick={() => setShowForm(!showForm)}>
                {showForm ? "✕ Cancel" : "+ New Project"}
              </button>
            )}
          </div>

          {showForm && (
            <div className="form-panel">
              <h2>New Project</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="field-group">
                    <label>Project Title</label>
                    <input
                      type="text" name="title" placeholder="e.g. Website Redesign"
                      value={formData.title} onChange={handleChange} required
                    />
                  </div>
                  <div className="field-group">
                    <label>Description</label>
                    <input
                      type="text" name="description" placeholder="Brief overview…"
                      value={formData.description} onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Creating…" : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="proj-grid">
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>No projects yet. {user.role === "admin" ? "Create your first one above." : "Check back soon."}</p>
              </div>
            ) : projects.map((project, i) => (
              <div className="proj-card" key={project._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="proj-card-icon">📁</div>
                <h2>{project.title}</h2>
                <p>{project.description || "No description provided."}</p>
                <a href={`/projects/${project._id}`} className="btn-open">
                  Open project →
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

export default Projects