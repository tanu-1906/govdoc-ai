import { useState } from "react";

const API = "https://govdoc-ai-backend.onrender.com";

const C = {
  navy: "#003366", dark: "#00234B", orange: "#FF6600",
  white: "#FFFFFF", gray: "#666666", green: "#1a7a4a",
  red: "#cc0000", light: "#F5F5F5",
};

const SERVICES = [
  { id: "birth_certificate", label: "Birth Certificate", icon: "👶" },
  { id: "death_certificate", label: "Death Certificate", icon: "📋" },
  { id: "income_certificate", label: "Income Certificate", icon: "💰" },
  { id: "domicile_certificate", label: "Domicile Certificate", icon: "🏠" },
  { id: "caste_certificate", label: "Caste Certificate", icon: "📄" },
  { id: "marriage_certificate", label: "Marriage Certificate", icon: "💍" },
  { id: "driving_license", label: "Driving License", icon: "🚗" },
  { id: "pan_card", label: "PAN Card", icon: "🪪" },
  { id: "passport", label: "Passport", icon: "✈️" },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [appId, setAppId] = useState("");
  const [scores, setScores] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dash, setDash] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", city: "", state: "Maharashtra", aadhaar: "" });
  const [loginForm, setLoginForm] = useState({ email: "", phone: "" });

  async function register() {
    setLoading(true); setMessage("");
    const res = await fetch(`${API}/api/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(regForm) });
    const data = await res.json();
    setLoading(false);
    if (data.user_id) { setUserId(data.user_id); setUserName(data.name); setPage("dashboard"); loadDash(data.user_id); }
    else setMessage(data.error || "Registration failed");
  }

  async function login() {
    setLoading(true); setMessage("");
    const res = await fetch(`${API}/api/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginForm) });
    const data = await res.json();
    setLoading(false);
    if (data.user_id) { setUserId(data.user_id); setUserName(data.name); setPage("dashboard"); loadDash(data.user_id); }
    else setMessage(data.error || "Invalid credentials");
  }

  async function loadDash(uid) {
    const res = await fetch(`${API}/api/dashboard/${uid || userId}`);
    const data = await res.json();
    setDash(data);
  }

  async function applyService() {
    if (!selectedService) { setMessage("Please select a service"); return; }
    setLoading(true); setMessage("");
    const res = await fetch(`${API}/api/apply`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: userId, service: selectedService }) });
    const data = await res.json();
    setLoading(false);
    if (data.app_id) { setAppId(data.app_id); setPage("upload"); }
    else setMessage(data.error || "Failed");
  }

  async function uploadFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true); setMessage("Uploading...");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API}/api/upload/${appId}`, { method: "POST", body: form });
    const data = await res.json();
    setLoading(false);
    if (data.filename) setMessage("File uploaded! Total: " + data.total_docs);
    else setMessage(data.error || "Upload failed");
  }

  async function verify() {
    setLoading(true); setMessage("AI is verifying your documents...");
    const res = await fetch(`${API}/api/verify/${appId}`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.scores) { setScores(data); setPage("result"); }
    else setMessage(data.error || "Verification failed");
  }

  async function viewStatus(aid) {
    const res = await fetch(`${API}/api/status/${aid}`);
    const data = await res.json();
    setStatusData(data); setPage("status");
  }

  function logout() { setUserId(""); setUserName(""); setDash(null); setPage("home"); }

  function Header() {
    return (
      <div>
        <div style={{ background: C.dark, color: C.white, padding: "6px 20px", display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span>🇮🇳 भारत सरकार | Government of India</span>
          <span>Screen Reader Access | A- A A+</span>
        </div>
        <div style={{ background: "linear-gradient(135deg," + C.navy + "," + C.dark + ")", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "4px solid " + C.orange }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 60, height: 60, background: "rgba(255,102,0,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>⚙️</div>
            <div style={{ color: C.white }}>
              <div style={{ fontSize: 22, fontWeight: "bold" }}>GovDoc AI Portal</div>
              <div style={{ fontSize: 12, color: "#aac4e0" }}>गवर्नमेंट डॉक्यूमेंट वेरिफिकेशन पोर्टल</div>
              <div style={{ fontSize: 11, color: C.orange }}>Ministry of Electronics & IT | Pune Municipal Corporation</div>
            </div>
          </div>
          <div style={{ textAlign: "right", color: C.white }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 6, justifyContent: "flex-end" }}>
              <div style={{ width: 40, height: 8, background: "#FF9933", borderRadius: 1 }} />
              <div style={{ width: 40, height: 8, background: "#FFFFFF", borderRadius: 1 }} />
              <div style={{ width: 40, height: 8, background: "#138808", borderRadius: 1 }} />
            </div>
            {userName && <div style={{ fontSize: 13, color: "#aac4e0" }}>Welcome, {userName}</div>}
            {userName && (
              <button onClick={logout} style={{ background: "transparent", border: "1px solid " + C.orange, color: C.orange, padding: "4px 12px", borderRadius: 3, cursor: "pointer", fontSize: 12, marginTop: 4 }}>
                Logout
              </button>
            )}
          </div>
        </div>
        <div style={{ background: C.orange, display: "flex", padding: "0 24px" }}>
          {[
            { label: "Home", go: "home" },
            { label: "Services", go: userId ? "apply" : "login" },
            { label: "Track Application", go: userId ? "dashboard" : "login" },
            { label: "Help & Support", go: "help" },
            { label: "About", go: "about" },
          ].map(item => (
            <div key={item.label}
              onClick={() => setPage(item.go)}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              style={{ color: C.white, padding: "10px 18px", cursor: "pointer", fontSize: 13, fontWeight: "600", borderRight: "1px solid rgba(255,255,255,0.3)" }}>
              {item.label}
            </div>
          ))}
          {userName && (
            <div onClick={() => { setPage("dashboard"); loadDash(); }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              style={{ color: C.white, padding: "10px 18px", cursor: "pointer", fontSize: 13, fontWeight: "600", marginLeft: "auto" }}>
              My Dashboard
            </div>
          )}
        </div>
      </div>
    );
  }

  function Footer() {
    return (
      <div style={{ background: C.dark, color: "#aac4e0", padding: "20px 24px", marginTop: 40, fontSize: 12, textAlign: "center" }}>
        <div style={{ marginBottom: 8 }}><strong style={{ color: C.white }}>GovDoc AI Portal</strong> — Government of India Initiative</div>
        <div style={{ marginBottom: 8 }}>Ministry of Electronics & Information Technology | Pune Municipal Corporation</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 8 }}>
          {["Privacy Policy", "Terms of Use", "Contact Us", "RTI", "Sitemap"].map(l => (
            <span key={l} style={{ color: C.orange, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <div>2026 Government of India. All Rights Reserved.</div>
      </div>
    );
  }

  function Card({ title, children }) {
    return (
      <div style={{ background: C.white, borderRadius: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.12)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ background: C.navy, color: C.white, padding: "12px 20px", fontSize: 15, fontWeight: "bold", borderLeft: "5px solid " + C.orange }}>{title}</div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    );
  }

  function Btn({ label, onClick, color, disabled }) {
    return (
      <button onClick={onClick} disabled={disabled}
        style={{ background: color || C.navy, color: C.white, border: "none", padding: "11px 28px", borderRadius: 3, fontSize: 14, fontWeight: "bold", cursor: "pointer", width: "100%", marginTop: 8, opacity: disabled ? 0.6 : 1 }}>
        {label}
      </button>
    );
  }

  function Input({ label, value, onChange, placeholder }) {
    return (
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: "bold", color: C.navy, marginBottom: 5 }}>{label}</label>
        <input style={{ width: "100%", padding: "10px 12px", border: "1px solid #ccc", borderRadius: 3, fontSize: 14, boxSizing: "border-box" }}
          placeholder={placeholder} value={value} onChange={onChange} />
      </div>
    );
  }

  function Alert({ msg, type }) {
    if (!msg) return null;
    const bg = type === "error" ? "#f8d7da" : type === "success" ? "#d4edda" : "#cce5ff";
    const col = type === "error" ? "#721c24" : type === "success" ? "#155724" : "#004085";
    return <div style={{ padding: "10px 16px", borderRadius: 3, marginBottom: 14, fontSize: 13, background: bg, color: col, border: "1px solid #ccc" }}>{msg}</div>;
  }

  const main = { maxWidth: 900, margin: "0 auto", padding: "24px 16px" };

  // HOME PAGE
  if (page === "home") return (
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={main}>
        <div style={{ background: "linear-gradient(135deg," + C.navy + "," + C.dark + ")", borderRadius: 4, padding: "30px 24px", marginBottom: 20, borderLeft: "6px solid " + C.orange, color: C.white }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>🇮🇳 Digital India — Document Verification Portal</h2>
          <p style={{ margin: "0 0 16px", color: "#aac4e0", fontSize: 14 }}>AI-powered government document verification system. Apply for certificates, track status, and get instant AI verification.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setPage("register")} style={{ background: C.orange, color: C.white, border: "none", padding: "10px 20px", borderRadius: 3, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>Register as Citizen</button>
            <button onClick={() => setPage("login")} style={{ background: "transparent", border: "2px solid " + C.white, color: C.white, padding: "10px 20px", borderRadius: 3, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>Citizen Login</button>
          </div>
        </div>
        <Card title="Available Services">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {SERVICES.map(s => (
              <div key={s.id} onClick={() => setPage("login")}
                style={{ border: "2px solid #ddd", borderRadius: 4, padding: "14px 10px", textAlign: "center", cursor: "pointer", background: C.white }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: "bold", color: C.navy }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[
            { icon: "🤖", t: "AI Verification", d: "Advanced AI scores your documents instantly with 90%+ accuracy" },
            { icon: "🔒", t: "Secure & Safe", d: "End-to-end encrypted. Protected under IT Act 2000" },
            { icon: "⚡", t: "Fast Processing", d: "Get your documents verified within minutes, not days" },
          ].map(f => (
            <div key={f.t} style={{ background: C.white, borderRadius: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.12)", padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: "bold", color: C.navy, marginBottom: 4 }}>{f.t}</div>
              <div style={{ fontSize: 12, color: C.gray }}>{f.d}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );

  // REGISTER PAGE
  if (page === "register") return (
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={main}>
        <Card title="Citizen Registration — नागरिक पंजीकरण">
          <Alert msg={message} type="error" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Full Name *" value={regForm.name} placeholder="As per Aadhaar" onChange={e => setRegForm({ ...regForm, name: e.target.value })} />
            <Input label="Email Address *" value={regForm.email} placeholder="example@gmail.com" onChange={e => setRegForm({ ...regForm, email: e.target.value })} />
            <Input label="Mobile Number *" value={regForm.phone} placeholder="10-digit mobile" onChange={e => setRegForm({ ...regForm, phone: e.target.value })} />
            <Input label="Aadhaar Number" value={regForm.aadhaar} placeholder="12-digit Aadhaar" onChange={e => setRegForm({ ...regForm, aadhaar: e.target.value })} />
            <Input label="City / District *" value={regForm.city} placeholder="Pune" onChange={e => setRegForm({ ...regForm, city: e.target.value })} />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", color: C.navy, marginBottom: 5 }}>State *</label>
              <select style={{ width: "100%", padding: "10px 12px", border: "1px solid #ccc", borderRadius: 3, fontSize: 14, boxSizing: "border-box" }}
                value={regForm.state} onChange={e => setRegForm({ ...regForm, state: e.target.value })}>
                {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "UP", "MP"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <Btn label={loading ? "Registering..." : "Register Now"} onClick={register} disabled={loading} />
          <Btn label="Already registered? Login here" onClick={() => setPage("login")} color="#888" />
        </Card>
      </div>
      <Footer />
    </div>
  );

  // LOGIN PAGE
  if (page === "login") return (
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={{ maxWidth: 460, margin: "24px auto", padding: "0 16px" }}>
        <Card title="Citizen Login — नागरिक लॉगिन">
          <Alert msg={message} type="error" />
          <Input label="Registered Email *" value={loginForm.email} placeholder="Enter your email" onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
          <Input label="Registered Mobile *" value={loginForm.phone} placeholder="Enter mobile number" onChange={e => setLoginForm({ ...loginForm, phone: e.target.value })} />
          <Btn label={loading ? "Logging in..." : "Login to Portal"} onClick={login} disabled={loading} />
          <Btn label="New citizen? Register here" onClick={() => setPage("register")} color="#888" />
          <Btn label="Back to Home" onClick={() => setPage("home")} color="#555" />
        </Card>
      </div>
      <Footer />
    </div>
  );

  // DASHBOARD PAGE
  if (page === "dashboard") return (
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={main}>
        <div style={{ background: "linear-gradient(135deg," + C.navy + "," + C.dark + ")", borderRadius: 4, padding: "16px 20px", marginBottom: 16, borderLeft: "5px solid " + C.orange, color: C.white, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: "bold" }}>Welcome, {userName}!</div>
            <div style={{ fontSize: 12, color: "#aac4e0", marginTop: 2 }}>Citizen ID: {userId} | Pune Municipal Corporation</div>
          </div>
          <button onClick={() => { setSelectedService(""); setPage("apply"); }}
            style={{ background: C.orange, color: C.white, border: "none", padding: "10px 20px", borderRadius: 3, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>
            + New Application
          </button>
        </div>
        {dash && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
            {[{ n: dash.total, l: "Total Applications", bg: C.navy }, { n: dash.approved, l: "Approved", bg: C.green }, { n: dash.pending, l: "Pending", bg: C.orange }].map(s => (
              <div key={s.l} style={{ background: s.bg, color: C.white, borderRadius: 4, padding: "16px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: "bold" }}>{s.n}</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}
        <Card title="My Applications">
          {dash?.applications?.length === 0 && (
            <div style={{ textAlign: "center", color: C.gray, padding: 20 }}>No applications yet. Click "+ New Application" to start.</div>
          )}
          {dash?.applications?.map(a => (
            <div key={a.app_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eee" }}>
              <div>
                <div style={{ fontWeight: "bold", color: C.navy, fontSize: 14 }}>{a.service?.replace(/_/g, " ").toUpperCase()}</div>
                <div style={{ fontSize: 12, color: C.gray }}>{a.app_id} | Applied: {a.created_at?.slice(0, 10)}{a.ai_score ? " | AI Score: " + a.ai_score + "%" : ""}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: "bold", textTransform: "uppercase", background: a.status === "approved" ? "#d4edda" : "#fff3cd", color: a.status === "approved" ? C.green : "#856404" }}>{a.status}</span>
                <button onClick={() => viewStatus(a.app_id)} style={{ background: C.navy, color: C.white, border: "none", padding: "5px 12px", borderRadius: 3, fontSize: 12, cursor: "pointer" }}>View</button>
              </div>
            </div>
          ))}
          <Btn label="Refresh" onClick={() => loadDash()} color="#888" />
        </Card>
      </div>
      <Footer />
    </div>
  );

  // APPLY PAGE
  if (page === "apply") return (
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={main}>
        <Card title="Apply for Government Service">
          <Alert msg={message} type="error" />
          <p style={{ color: C.gray, fontSize: 13, marginBottom: 16 }}>Select the service you want to apply for:</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
            {SERVICES.map(s => (
              <div key={s.id} onClick={() => setSelectedService(s.id)}
                style={{ border: "2px solid " + (selectedService === s.id ? C.orange : "#ddd"), borderRadius: 4, padding: "14px 10px", textAlign: "center", cursor: "pointer", background: selectedService === s.id ? "#fff3e6" : C.white }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: "bold", color: C.navy }}>{s.label}</div>
              </div>
            ))}
          </div>
          <Btn label={loading ? "Processing..." : "Proceed to Document Upload"} onClick={applyService} disabled={loading || !selectedService} />
          <Btn label="Back to Dashboard" onClick={() => setPage("dashboard")} color="#888" />
        </Card>
      </div>
      <Footer />
    </div>
  );

  // UPLOAD PAGE
  if (page === "upload") return (
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={main}>
        <Card title={"Upload Documents — Application: " + appId}>
          <Alert msg={message} type={message.includes("uploaded") ? "success" : "info"} />
          <div style={{ border: "2px dashed #ccc", borderRadius: 4, padding: 30, textAlign: "center", marginBottom: 16, background: "#fafafa" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📁</div>
            <div style={{ fontSize: 14, color: C.gray, marginBottom: 12 }}>Upload PDF, JPG, or PNG documents</div>
            <input type="file" onChange={uploadFile} accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} id="fileInput" />
            <label htmlFor="fileInput" style={{ background: C.navy, color: C.white, padding: "10px 24px", borderRadius: 3, cursor: "pointer", fontSize: 14, fontWeight: "bold" }}>Choose File</label>
          </div>
          <div style={{ padding: "10px", background: "#fff3cd", borderRadius: 3, fontSize: 12, marginBottom: 16 }}>
            Please upload clear, legible scans. Blurry or damaged documents may fail verification.
          </div>
          <Btn label={loading ? "AI Verifying..." : "Run AI Verification"} onClick={verify} disabled={loading} color={C.green} />
          <Btn label="Back to Dashboard" onClick={() => setPage("dashboard")} color="#888" />
        </Card>
      </div>
      <Footer />
    </div>
  );

  // RESULT PAGE
  if (page === "result" && scores) return (
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={main}>
        <Card title={"AI Verification Result — " + appId}>
          <div style={{ textAlign: "center", padding: "20px 0", borderBottom: "1px solid #eee", marginBottom: 20 }}>
            <div style={{ fontSize: 64, fontWeight: "bold", color: scores.scores?.overall >= 90 ? C.green : scores.scores?.overall >= 75 ? C.orange : C.red }}>
              {scores.scores?.overall}%
            </div>
            <div style={{ fontSize: 14, color: C.gray }}>AI Confidence Score</div>
            <div style={{ marginTop: 8 }}>
              <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: "bold", background: scores.status === "approved" ? "#d4edda" : "#fff3cd", color: scores.status === "approved" ? C.green : "#856404" }}>
                {scores.status?.replace(/_/g, " ")}
              </span>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: C.navy, fontWeight: "bold" }}>{scores.message}</div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: "bold", color: C.navy, marginBottom: 12 }}>Score Breakdown</div>
            {[
              ["OCR Extraction", scores.scores?.ocr_extraction],
              ["Document Authenticity", scores.scores?.document_authentic],
              ["Biometric Match", scores.scores?.biometric_match],
              ["Fraud Detection", scores.scores?.fraud_detection],
            ].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>{label}</span>
                  <span style={{ fontWeight: "bold" }}>{val}%</span>
                </div>
                <div style={{ background: "#eee", borderRadius: 5, height: 10, marginTop: 4 }}>
                  <div style={{ height: 10, borderRadius: 5, background: val >= 90 ? C.green : val >= 75 ? C.orange : C.red, width: val + "%", transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
          {scores.officer && (
            <div style={{ background: "#fff3cd", padding: 12, borderRadius: 3, marginBottom: 16, fontSize: 13 }}>
              <strong>Assigned Officer:</strong> {scores.officer}
            </div>
          )}
          <div style={{ background: "#f8f9fa", padding: 12, borderRadius: 3, fontSize: 12, marginBottom: 16 }}>
            <div><strong>Application ID:</strong> {appId}</div>
            <div><strong>Status:</strong> {scores.status}</div>
            <div><strong>Verdict:</strong> {scores.verdict}</div>
          </div>
          <Btn label="Go to Dashboard" onClick={() => { setPage("dashboard"); loadDash(); }} />
        </Card>
      </div>
      <Footer />
    </div>
  );

  // STATUS PAGE
  if (page === "status" && statusData) return (
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={main}>
        <Card title="Application Status">
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: "bold", background: "#d4edda", color: C.green }}>
              {statusData.status?.replace(/_/g, " ").toUpperCase()}
            </span>
          </div>
          {[
            ["Application ID", statusData.app_id],
            ["Service", statusData.service?.replace(/_/g, " ").toUpperCase()],
            ["Citizen Name", statusData.citizen],
            ["AI Score", statusData.ai_score ? statusData.ai_score + "%" : "Pending"],
            ["Documents", statusData.documents],
            ["Officer", statusData.officer || "Auto-processed"],
            ["Applied On", statusData.created_at?.slice(0, 10)],
            ["Last Updated", statusData.updated_at?.slice(0, 10)],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee", fontSize: 13 }}>
              <span style={{ color: C.gray }}>{label}</span>
              <span style={{ fontWeight: "bold", color: C.navy }}>{val}</span>
            </div>
          ))}
          <Btn label="Back to Dashboard" onClick={() => setPage("dashboard")} />
        </Card>
      </div>
      <Footer />
    </div>
  );

  // HELP PAGE


  if (page === "about") return ( ... );

  if (page === "help") return ( ... );

  if (page === "officer") return ( ... );  // ← officer goes HERE

  return null;   // ← this must be the LAST line
} return (
    <div style={styles.page}>
      <GovHeader />
      <div style={styles.main}>
        {/* Stats Row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Pending Review", value: "12", icon: "⏳", color: "#ff9800" },
            { label: "Approved Today", value: "8", icon: "✅", color: "#4caf50" },
            { label: "Rejected Today", value: "3", icon: "❌", color: "#f44336" },
            { label: "Avg AI Score", value: "82%", icon: "🤖", color: COLORS.navyBlue },
          ].map(stat => (
            <div key={stat.label} style={{ flex: 1, minWidth: 150, background: "#fff", borderRadius: 8, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderTop: `4px solid ${stat.color}` }}>
              <div style={{ fontSize: 28 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: "bold", color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: COLORS.gray }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Applications Table */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>🧑‍💼 Officer Dashboard — Pending Applications</div>
          <div style={styles.cardBody}>
            {[
              { id: "APP001", name: "Rahul Sharma", service: "Income Certificate", score: 78, status: "Pending", doc: "Aadhaar, Salary Slip" },
              { id: "APP002", name: "Priya Patil", service: "Domicile Certificate", score: 91, status: "Auto-Approved", doc: "Aadhaar, Address Proof" },
              { id: "APP003", name: "Amit Desai", service: "Caste Certificate", score: 65, status: "Pending", doc: "Aadhaar, Caste Proof" },
              { id: "APP004", name: "Sneha Kulkarni", service: "Birth Certificate", score: 88, status: "Pending", doc: "Hospital Record" },
              { id: "APP005", name: "Vikram Joshi", service: "Income Certificate", score: 45, status: "Rejected", doc: "Aadhaar (blurry)" },
            ].map(app => (
              <div key={app.id} style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: 16, marginBottom: 16, background: "#fafafa" }}>
                {/* Top Row */}
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  <div>
                    <span style={{ fontWeight: "bold", color: COLORS.navyBlue, fontSize: 15 }}>{app.name}</span>
                    <span style={{ marginLeft: 8, fontSize: 12, color: COLORS.gray }}>#{app.id}</span>
                  </div>
                  <span style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: "bold",
                    background: app.status === "Auto-Approved" ? "#e8f5e9" : app.status === "Rejected" ? "#ffebee" : "#fff3e0",
                    color: app.status === "Auto-Approved" ? "#4caf50" : app.status === "Rejected" ? "#f44336" : "#ff9800"
                  }}>{app.status}</span>
                </div>

                {/* Details */}
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 12, fontSize: 13 }}>
                  <span>📋 <b>Service:</b> {app.service}</span>
                  <span>📄 <b>Docs:</b> {app.doc}</span>
                  <span>🤖 <b>AI Score:</b>
                    <span style={{
                      marginLeft: 6, fontWeight: "bold",
                      color: app.score >= 85 ? "#4caf50" : app.score >= 70 ? "#ff9800" : "#f44336"
                    }}>{app.score}%</span>
                  </span>
                </div>

                {/* AI Score Bar */}
                <div style={{ background: "#e0e0e0", borderRadius: 4, height: 6, marginBottom: 12 }}>
                  <div style={{
                    width: `${app.score}%`, height: 6, borderRadius: 4,
                    background: app.score >= 85 ? "#4caf50" : app.score >= 70 ? "#ff9800" : "#f44336"
                  }} />
                </div>

                {/* Action Buttons */}
                {app.status === "Pending" && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button style={{ ...styles.btnPrimary, background: "#4caf50", padding: "8px 16px", fontSize: 13 }}
                      onClick={() => alert(`✅ APP ${app.id} Approved!`)}>✅ Approve</button>
                    <button style={{ ...styles.btnPrimary, background: "#f44336", padding: "8px 16px", fontSize: 13 }}
                      onClick={() => alert(`❌ APP ${app.id} Rejected!`)}>❌ Reject</button>
                    <button style={{ ...styles.btnPrimary, background: "#ff9800", padding: "8px 16px", fontSize: 13 }}
                      onClick={() => alert(`📄 Requested more documents for ${app.id}`)}>📄 Request Docs</button>
                    <button style={{ ...styles.btnPrimary, background: COLORS.navyBlue, padding: "8px 16px", fontSize: 13 }}
                      onClick={() => {
                        const comment = prompt(`Add review comment for ${app.id}:`);
                        if (comment) alert(`💬 Comment saved for ${app.id}: "${comment}"`);
                      }}>💬 Add Comment</button>
                    <button style={{ ...styles.btnPrimary, background: "#9c27b0", padding: "8px 16px", fontSize: 13 }}
                      onClick={() => alert(`👤 ${app.id} assigned to Rajesh Kumar, PMC`)}>👤 Assign Officer</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button style={styles.btnPrimary} onClick={() => setPage("home")}>← Back to Home</button>
      </div>
      <GovFooter />
    </div>
  );
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={main}>
        <Card title="Help & Support — सहायता केंद्र">
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: "bold", color: C.navy, fontSize: 16, marginBottom: 12 }}>Frequently Asked Questions</div>
            {[
              ["How do I apply for a certificate?", "Register as a citizen, login, click New Application, select your service, upload documents and run AI verification."],
              ["What documents do I need to upload?", "Upload clear scans of Aadhaar card, address proof, and any service-specific documents in PDF, JPG or PNG format."],
              ["How long does verification take?", "AI verification is instant. If sent for manual review, officer will process within 3-5 working days."],
              ["What is the AI Confidence Score?", "It is a score from 0-100 showing how authentic your documents are. Score above 90% means auto-approved."],
              ["Who is the assigned officer?", "If your score is between 75-90%, it is assigned to Rajesh Kumar, Pune Municipal Corporation for manual review."],
              ["Is my data safe?", "Yes. All data is encrypted and protected under IT Act 2000 and Personal Data Protection Act."],
            ].map(([q, a]) => (
              <div key={q} style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}>
                <div style={{ fontWeight: "bold", color: C.navy, fontSize: 13, marginBottom: 4 }}>Q: {q}</div>
                <div style={{ fontSize: 13, color: C.gray }}>A: {a}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#f0f4ff", padding: 16, borderRadius: 4, marginBottom: 16 }}>
            <div style={{ fontWeight: "bold", color: C.navy, marginBottom: 12 }}>Contact Us</div>
            {[
              ["Helpline", "1800-111-555 (Toll Free)"],
              ["Email", "support@govdocai.gov.in"],
              ["Office", "Pune Municipal Corporation, Shivajinagar, Pune - 411005"],
              ["Working Hours", "Monday to Friday, 9:00 AM to 6:00 PM"],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", gap: 12, marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: C.gray, minWidth: 120 }}>{label}:</span>
                <span style={{ fontWeight: "bold", color: C.navy }}>{val}</span>
              </div>
            ))}
          </div>
          <Btn label="Back to Home" onClick={() => setPage("home")} />
        </Card>
      </div>
      <Footer />
    </div>
  );

  // ABOUT PAGE
  if (page === "about") return (
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={main}>
        <Card title="About GovDoc AI Portal — हमारे बारे में">
          <div style={{ background: "linear-gradient(135deg," + C.navy + "," + C.dark + ")", borderRadius: 4, padding: 20, marginBottom: 20, color: C.white }}>
            <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Our Mission</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: "#aac4e0" }}>
              GovDoc AI Portal is a Digital India initiative to simplify government document verification using Artificial Intelligence. Our goal is to make government services accessible, transparent, and fast for every citizen of India.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {[["9+", "Services Available"], ["95%", "AI Accuracy"], ["1 min", "Verification Time"], ["100%", "Secure"]].map(([n, l]) => (
              <div key={l} style={{ background: C.orange, color: C.white, borderRadius: 4, padding: "16px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: "bold" }}>{n}</div>
                <div style={{ fontSize: 11, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
          <Card title="How It Works">
            {[
              ["1", "Register & Login", "Create your citizen account with Aadhaar and mobile number"],
              ["2", "Select Service", "Choose from 9+ government services like Birth Certificate, PAN, Passport"],
              ["3", "Upload Documents", "Upload clear scans of required documents in PDF, JPG or PNG"],
              ["4", "AI Verification", "Our AI engine verifies authenticity, OCR, biometrics and fraud detection"],
              ["5", "Get Result", "Receive instant AI score. High scores get auto-approved, others go for officer review"],
            ].map(([step, title, desc]) => (
              <div key={step} style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
                <div style={{ background: C.orange, color: C.white, borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>{step}</div>
                <div>
                  <div style={{ fontWeight: "bold", color: C.navy, fontSize: 13 }}>{title}</div>
                  <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>{desc}</div>
                </div>
              </div>
            ))}
          </Card>
          <Card title="Technology Used">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {[
                ["⚛️", "React.js", "Frontend UI"],
                ["🐍", "Python Flask", "Backend API"],
                ["🍃", "MongoDB Atlas", "Database"],
                ["🤖", "AI/ML Engine", "Document Verification"],
                ["☁️", "Render.com", "Backend Hosting"],
                ["🌐", "Netlify", "Frontend Hosting"],
              ].map(([icon, name, desc]) => (
                <div key={name} style={{ border: "1px solid #ddd", borderRadius: 4, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontWeight: "bold", color: C.navy, fontSize: 13 }}>{name}</div>
                  <div style={{ fontSize: 11, color: C.gray }}>{desc}</div>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ background: "#f0f4ff", padding: 16, borderRadius: 4, marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: "bold", color: C.navy, marginBottom: 4 }}>Developed By</div>
            <div style={{ fontSize: 14, color: C.orange, fontWeight: "bold" }}>Tanushri Choudhari</div>
            <div style={{ fontSize: 12, color: C.gray }}>MMIT Lohgaon | AI & DS | 2026</div>
            <div style={{ fontSize: 12, color: C.gray, marginTop: 4 }}>Assignment Project — AI-Based Government Document Verification System</div>
          </div>
          <Btn label="Back to Home" onClick={() => setPage("home")} />
        </Card>
      </div>
      <Footer />
    </div>
  );

  return null;
}
