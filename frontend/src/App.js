import { useState } from "react";

const API = "http://localhost:5000";

function App() {
  const [page, setPage] = useState("login");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [appId, setAppId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState(null);
  const [scores, setScores] = useState(null);
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", city: "" });
  const [loginForm, setLoginForm] = useState({ email: "", phone: "" });
  const [service, setService] = useState("birth_certificate");
  const [file, setFile] = useState(null);
  const [uploadCount, setUploadCount] = useState(0);

  async function register() {
    setLoading(true);
    const res = await fetch(`${API}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regForm)
    });
    const data = await res.json();
    setLoading(false);
    if (data.user_id) {
      setUserId(data.user_id);
      setUserName(data.name);
      setPage("dashboard");
      loadDashboard(data.user_id);
    } else {
      setMessage(data.error || "Registration failed");
    }
  }

  async function login() {
    setLoading(true);
    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm)
    });
    const data = await res.json();
    setLoading(false);
    if (data.user_id) {
      setUserId(data.user_id);
      setUserName(data.name);
      setPage("dashboard");
      loadDashboard(data.user_id);
    } else {
      setMessage(data.error || "Login failed");
    }
  }

  async function apply() {
    setLoading(true);
    const res = await fetch(`${API}/api/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, service })
    });
    const data = await res.json();
    setLoading(false);
    if (data.app_id) {
      setAppId(data.app_id);
      setPage("upload");
    } else {
      setMessage(data.error || "Failed");
    }
  }

  async function upload() {
    if (!file) { setMessage("Please select a file first"); return; }
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API}/api/upload/${appId}`, { method: "POST", body: form });
    const data = await res.json();
    setLoading(false);
    if (data.filename) {
      setUploadCount(data.total_docs);
      setMessage("Uploaded! Total files: " + data.total_docs);
      setFile(null);
    } else {
      setMessage(data.error || "Upload failed");
    }
  }

  async function verify() {
    setLoading(true);
    setMessage("AI is verifying your documents...");
    const res = await fetch(`${API}/api/verify/${appId}`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.scores) {
      setScores(data);
      setMessage(data.message);
      setPage("result");
    } else {
      setMessage(data.error || "Verification failed");
    }
  }

  async function loadDashboard(uid) {
    const res = await fetch(`${API}/api/dashboard/${uid || userId}`);
    const data = await res.json();
    if (data.user) setDashboard(data);
  }

  async function checkStatus(aid) {
    const res = await fetch(`${API}/api/status/${aid}`);
    const data = await res.json();
    setStatus(data);
    setPage("status");
  }

  const s = {
    app:     { fontFamily: "Arial, sans-serif", maxWidth: 600, margin: "0 auto", padding: 20, background: "#f9fafb", minHeight: "100vh" },
    card:    { background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    title:   { fontSize: 24, fontWeight: "bold", color: "#1a56db", marginBottom: 4 },
    sub:     { color: "#6b7280", fontSize: 14, marginBottom: 20 },
    input:   { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, marginBottom: 12, boxSizing: "border-box" },
    btn:     { width: "100%", padding: 12, background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: "bold", cursor: "pointer", marginBottom: 8 },
    btnGray: { width: "100%", padding: 12, background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, cursor: "pointer", marginBottom: 8 },
    msg:     { padding: "10px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, color: "#1e40af", marginBottom: 12, fontSize: 14 },
    label:   { fontSize: 13, color: "#374151", fontWeight: "bold", marginBottom: 4, display: "block" },
    nav:     { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, padding: "12px 16px", background: "#1a56db", borderRadius: 10, color: "#fff" },
    badge:   (st) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: "bold",
                background: st === "approved" ? "#d1fae5" : st === "flagged" ? "#fee2e2" : "#fef3c7",
                color: st === "approved" ? "#065f46" : st === "flagged" ? "#991b1b" : "#92400e" }),
  };

  if (page === "login") return (
    <div style={s.app}>
      <div style={s.nav}>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>GovDoc AI</span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>Smart City Portal</span>
      </div>
      <div style={s.card}>
        <div style={s.title}>Welcome back</div>
        <div style={s.sub}>Login with your email and phone number</div>
        {message && <div style={s.msg}>{message}</div>}
        <label style={s.label}>Email</label>
        <input style={s.input} placeholder="your@email.com" value={loginForm.email}
          onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
        <label style={s.label}>Phone number</label>
        <input style={s.input} placeholder="9923689191" value={loginForm.phone}
          onChange={e => setLoginForm({ ...loginForm, phone: e.target.value })} />
        <button style={s.btn} onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <button style={s.btnGray} onClick={() => { setPage("register"); setMessage(""); }}>
          New citizen? Register here
        </button>
      </div>
    </div>
  );

  if (page === "register") return (
    <div style={s.app}>
      <div style={s.nav}>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>GovDoc AI</span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>Register</span>
      </div>
      <div style={s.card}>
        <div style={s.title}>Create account</div>
        <div style={s.sub}>Register as a citizen</div>
        {message && <div style={s.msg}>{message}</div>}
        {["name","email","phone","city"].map(f => (
          <div key={f}>
            <label style={s.label}>{f.charAt(0).toUpperCase()+f.slice(1)}</label>
            <input style={s.input} placeholder={f} value={regForm[f]}
              onChange={e => setRegForm({ ...regForm, [f]: e.target.value })} />
          </div>
        ))}
        <button style={s.btn} onClick={register} disabled={loading}>
          {loading ? "Registering..." : "Create account"}
        </button>
        <button style={s.btnGray} onClick={() => setPage("login")}>Back to login</button>
      </div>
    </div>
  );

  if (page === "dashboard") return (
    <div style={s.app}>
      <div style={s.nav}>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>GovDoc AI</span>
        <span style={{ fontSize: 13 }}>👤 {userName}</span>
      </div>
      <div style={s.card}>
        <div style={s.title}>Welcome, {userName}!</div>
        <div style={s.sub}>Citizen ID: {userId}</div>
        {dashboard && (
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {[["Total", dashboard.total], ["Approved", dashboard.approved], ["Pending", dashboard.total - dashboard.approved]].map(([l, v]) => (
              <div key={l} style={{ flex: 1, background: "#f0f9ff", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: "bold", color: "#1a56db" }}>{v}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{l}</div>
              </div>
            ))}
          </div>
        )}
        <button style={s.btn} onClick={() => setPage("apply")}>+ New Application</button>
        {dashboard?.applications?.map(a => (
          <div key={a.app_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: "bold" }}>{a.service.replace(/_/g, " ").toUpperCase()}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{a.app_id}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={s.badge(a.status)}>{a.status.replace(/_/g, " ")}</span>
              <button onClick={() => checkStatus(a.app_id)} style={{ fontSize: 11, padding: "4px 8px", background: "#f3f4f6", border: "none", borderRadius: 6, cursor: "pointer" }}>View</button>
            </div>
          </div>
        ))}
        <button style={{ ...s.btnGray, marginTop: 12 }} onClick={() => loadDashboard()}>Refresh</button>
      </div>
    </div>
  );

  if (page === "apply") return (
    <div style={s.app}>
      <div style={s.nav}>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>GovDoc AI</span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>New Application</span>
      </div>
      <div style={s.card}>
        <div style={s.title}>Select service</div>
        <div style={s.sub}>Choose the document you need</div>
        {message && <div style={s.msg}>{message}</div>}
        {[
          ["birth_certificate","Birth Certificate"],
          ["domicile_certificate","Domicile Certificate"],
          ["income_certificate","Income Certificate"],
          ["driving_license","Driving License"],
          ["business_permit","Business Permit"],
          ["building_permit","Building Permit"],
        ].map(([val, label]) => (
          <div key={val} onClick={() => setService(val)} style={{
            padding: "12px 16px", border: `2px solid ${service === val ? "#1a56db" : "#e5e7eb"}`,
            borderRadius: 8, marginBottom: 8, cursor: "pointer",
            background: service === val ? "#eff6ff" : "#fff",
            color: service === val ? "#1a56db" : "#374151",
            fontWeight: service === val ? "bold" : "normal"
          }}>{label}</div>
        ))}
        <button style={{ ...s.btn, marginTop: 8 }} onClick={apply} disabled={loading}>
          {loading ? "Starting..." : "Start Application"}
        </button>
        <button style={s.btnGray} onClick={() => setPage("dashboard")}>Back</button>
      </div>
    </div>
  );

  if (page === "upload") return (
    <div style={s.app}>
      <div style={s.nav}>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>GovDoc AI</span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>Upload Documents</span>
      </div>
      <div style={s.card}>
        <div style={s.title}>Upload documents</div>
        <div style={s.sub}>Application: {appId}</div>
        {message && <div style={s.msg}>{message}</div>}
        <div style={{ background: "#f9fafb", border: "2px dashed #d1d5db", borderRadius: 10, padding: 24, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 12 }}>Select file (PDF, JPG, PNG)</div>
          <input type="file" onChange={e => setFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
        </div>
        {file && <div style={s.msg}>Selected: {file.name}</div>}
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>Files uploaded: {uploadCount}</div>
        <button style={s.btn} onClick={upload} disabled={loading || !file}>
          {loading ? "Uploading..." : "Upload File"}
        </button>
        {uploadCount > 0 && (
          <button style={{ ...s.btn, background: "#059669" }} onClick={verify} disabled={loading}>
            {loading ? "AI Verifying..." : "Run AI Verification"}
          </button>
        )}
        <button style={s.btnGray} onClick={() => setPage("apply")}>Back</button>
      </div>
    </div>
  );

  if (page === "result") return (
    <div style={s.app}>
      <div style={s.nav}>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>GovDoc AI</span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>AI Result</span>
      </div>
      <div style={s.card}>
        <div style={s.title}>Verification Result</div>
        <div style={s.sub}>{appId}</div>
        {message && <div style={s.msg}>{message}</div>}
        {scores && (
          <div>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 56, fontWeight: "bold", color: scores.scores?.overall >= 90 ? "#059669" : scores.scores?.overall >= 75 ? "#d97706" : "#dc2626" }}>
               {scores.scores?.overall}%
              </div>
              <div style={{ fontSize: 14, color: "#6b7280" }}>AI Confidence Score</div>
            </div>
            {[["OCR Extraction", scores.scores?.ocr_extraction],
              ["Doc Authenticity", scores.scores?.document_authentic],
              ["Biometric Match", scores.scores?.biometric_match],
              ["Fraud Detection", scores.scores?.fraud_detection]
            ].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span>{label}</span><span style={{ fontWeight: "bold" }}>{val}%</span>
                </div>
                <div style={{ height: 8, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${val}%`, height: "100%", background: val >= 90 ? "#059669" : "#d97706", borderRadius: 99 }} />
                </div>
              </div>
            ))}
            {scores.officer && <div style={s.msg}>Assigned to: {scores.officer}</div>}
          </div>
        )}
        <button style={s.btn} onClick={() => { setPage("dashboard"); loadDashboard(); }}>Go to Dashboard</button>
      </div>
    </div>
  );

  if (page === "status") return (
    <div style={s.app}>
      <div style={s.nav}>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>GovDoc AI</span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>Status</span>
      </div>
      <div style={s.card}>
        <div style={s.title}>Application Status</div>
        {status && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <span style={s.badge(status.status)}>{status.status?.replace(/_/g, " ").toUpperCase()}</span>
            </div>
            {[["Application ID", status.app_id],
              ["Service", status.service?.replace(/_/g, " ")],
              ["AI Score", status.ai_score ? status.ai_score + "%" : "Pending"],
              ["Documents", status.documents],
              ["Officer", status.officer || "None"],
              ["Applied on", status.created_at?.slice(0, 10)]
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: 14 }}>
                <span style={{ color: "#6b7280" }}>{l}</span>
                <span style={{ fontWeight: "bold" }}>{v}</span>
              </div>
            ))}
          </div>
        )}
        <button style={{ ...s.btn, marginTop: 16 }} onClick={() => setPage("dashboard")}>Back to Dashboard</button>
      </div>
    </div>
  );
}

export default App;