import { useEffect, useState } from "react"
import API from "../services/api"

const STATS = [
  { key: "totalTasks",     label: "Total Tasks",  icon: "◈", accent: "#0e0e0e" },
  { key: "completedTasks", label: "Completed",    icon: "✓", accent: "#16a34a" },
  { key: "pendingTasks",   label: "In Progress",  icon: "◷", accent: "#d97706" },
  { key: "overdueTasks",   label: "Overdue",      icon: "!", accent: "#dc2626" },
]

function Dashboard() {
  const [data, setData] = useState({})
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard")
      setData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDashboard()
    const interval = setInterval(fetchDashboard, 5000)
    return () => clearInterval(interval)
  }, [])

  const logout = () => {
    localStorage.clear()
    window.location.href = "/"
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root { min-height: 100vh; background: #f7f6f3; font-family: 'Sora', sans-serif; }

        /* TOPBAR */
        .topbar {
          background: #fff; border-bottom: 1px solid #ebebeb;
          padding: 0 40px; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .topbar-logo { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500; color: #0e0e0e; letter-spacing: 0.08em; }
        .topbar-right { display: flex; align-items: center; gap: 20px; }
        .topbar-user { font-size: 13px; color: #666; }
        .topbar-user span { color: #0e0e0e; font-weight: 500; }

        .btn-logout {
          font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500;
          color: #888; background: none; border: 1.5px solid #e2e2e2;
          padding: 7px 16px; border-radius: 8px; cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-logout:hover { border-color: #dc2626; color: #dc2626; }

        /* MAIN */
        .dash-main { padding: 48px 40px; max-width: 1100px; margin: 0 auto; animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .dash-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 40px; }
        .dash-header h1 { font-size: 30px; font-weight: 600; color: #0e0e0e; letter-spacing: -0.02em; }
        .dash-header p { font-size: 14px; color: #999; margin-top: 4px; }

        .btn-projects {
          background: #0e0e0e; color: #fff; border: none;
          padding: 11px 22px; border-radius: 10px; font-size: 13px;
          font-family: 'Sora', sans-serif; font-weight: 500; cursor: pointer;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-projects:hover { opacity: 0.85; transform: translateY(-1px); }

        /* STAT CARDS */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 48px; }

        .stat-card {
          background: #fff; border: 1px solid #ebebeb;
          border-radius: 14px; padding: 28px 24px;
          animation: fadeUp 0.5s ease both;
        }
        .stat-card:nth-child(1) { animation-delay: 0.05s; }
        .stat-card:nth-child(2) { animation-delay: 0.1s; }
        .stat-card:nth-child(3) { animation-delay: 0.15s; }
        .stat-card:nth-child(4) { animation-delay: 0.2s; }

        .stat-icon {
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; margin-bottom: 20px;
          background: #f7f6f3;
        }

        .stat-value { font-size: 38px; font-weight: 600; color: #0e0e0e; letter-spacing: -0.03em; line-height: 1; }
        .stat-label { font-size: 13px; color: #888; margin-top: 6px; font-weight: 400; }

        .stat-bar { height: 3px; background: #f0f0f0; border-radius: 99px; margin-top: 20px; overflow: hidden; }
        .stat-fill { height: 100%; border-radius: 99px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }

        /* EMPTY STATE */
        .empty-state {
          text-align: center; padding: 80px 40px;
          background: #fff; border: 1px solid #ebebeb; border-radius: 14px;
        }
        .empty-state p { color: #bbb; font-size: 15px; }
      `}</style>

      <div className="dash-root">
        <header className="topbar">
          <div className="topbar-logo">TASKFLOW</div>
          <div className="topbar-right">
            <span className="topbar-user">
              Hello, <span>{user.name || "User"}</span>
            </span>
            <button className="btn-logout" onClick={logout}>Logout</button>
          </div>
        </header>

        <main className="dash-main">
          <div className="dash-header">
            <div>
              <h1>Dashboard</h1>
              <p>Live overview — updates every 5 seconds</p>
            </div>
            <a href="/projects" className="btn-projects">
              → View Projects
            </a>
          </div>

          <div className="stats-grid">
            {STATS.map(({ key, label, icon, accent }) => {
              const total = data.totalTasks || 1
              const val = data[key] ?? 0
              const pct = Math.round((val / total) * 100)
              return (
                <div className="stat-card" key={key}>
                  <div className="stat-icon" style={{ color: accent }}>{icon}</div>
                  <div className="stat-value">{val}</div>
                  <div className="stat-label">{label}</div>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: `${pct}%`, background: accent }} />
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

export default Dashboard