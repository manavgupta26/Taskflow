import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "member" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post("/auth/signup", formData)
      navigate("/")
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root { min-height: 100vh; display: flex; font-family: 'Sora', sans-serif; background: #f7f6f3; }

        .auth-left {
          flex: 1; background: #0e0e0e;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 48px; position: relative; overflow: hidden;
        }
        .auth-left::before {
          content: ''; position: absolute;
          width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
          top: -80px; left: -80px;
        }
        .auth-logo { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: #fff; letter-spacing: 0.08em; }
        .auth-tagline h2 { font-size: 36px; font-weight: 300; line-height: 1.25; letter-spacing: -0.02em; color: #fff; margin-bottom: 16px; }
        .auth-tagline p { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; max-width: 280px; }

        .auth-right { width: 500px; display: flex; align-items: center; justify-content: center; padding: 48px; }

        .auth-form-wrap { width: 100%; max-width: 380px; animation: fadeUp 0.5s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .auth-form-wrap h1 { font-size: 26px; font-weight: 600; color: #0e0e0e; margin-bottom: 6px; letter-spacing: -0.02em; }
        .auth-form-wrap .subtitle { font-size: 14px; color: #888; margin-bottom: 36px; }

        .field-group { margin-bottom: 16px; }
        .field-group label { display: block; font-size: 12px; font-weight: 500; color: #555; margin-bottom: 7px; letter-spacing: 0.04em; text-transform: uppercase; }
        .field-group input, .field-group select {
          width: 100%; border: 1.5px solid #e2e2e2; background: #fff;
          padding: 12px 14px; border-radius: 10px; font-size: 14px;
          font-family: 'Sora', sans-serif; color: #0e0e0e;
          transition: border-color 0.2s, box-shadow 0.2s; outline: none;
        }
        .field-group input:focus, .field-group select:focus {
          border-color: #0e0e0e; box-shadow: 0 0 0 3px rgba(14,14,14,0.06);
        }
        .field-group input::placeholder { color: #bbb; }

        .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .role-card {
          border: 1.5px solid #e2e2e2; border-radius: 10px; padding: 14px 16px;
          cursor: pointer; transition: border-color 0.2s, background 0.2s;
          background: #fff;
        }
        .role-card.active { border-color: #0e0e0e; background: #0e0e0e; }
        .role-card .role-label { font-size: 13px; font-weight: 500; color: #0e0e0e; }
        .role-card.active .role-label { color: #fff; }
        .role-card .role-desc { font-size: 11px; color: #999; margin-top: 2px; }
        .role-card.active .role-desc { color: rgba(255,255,255,0.6); }

        .btn-primary {
          width: 100%; background: #0e0e0e; color: #fff; border: none;
          padding: 13px; border-radius: 10px; font-size: 14px;
          font-family: 'Sora', sans-serif; font-weight: 500; cursor: pointer;
          margin-top: 20px; transition: opacity 0.2s, transform 0.15s; letter-spacing: 0.02em;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-footer { margin-top: 24px; font-size: 13px; color: #888; text-align: center; }
        .auth-footer a { color: #0e0e0e; font-weight: 500; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-root">
        <div className="auth-left">
          <div className="auth-logo">TASKFLOW</div>
          <div className="auth-tagline">
            <h2>Your workspace<br />starts here.</h2>
            <p>Set up your account and start managing projects in minutes.</p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrap">
            <h1>Create account</h1>
            <p className="subtitle">Join your team's workspace</p>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="Jane Smith" onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="you@example.com" onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Min. 8 characters" onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Role</label>
                <div className="role-grid">
                  {[
                    { value: "member", label: "Member", desc: "View & update tasks" },
                    { value: "admin",  label: "Admin",  desc: "Full project access" },
                  ].map((r) => (
                    <div
                      key={r.value}
                      className={`role-card${formData.role === r.value ? " active" : ""}`}
                      onClick={() => setFormData({ ...formData, role: r.value })}
                    >
                      <div className="role-label">{r.label}</div>
                      <div className="role-desc">{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn-primary" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup