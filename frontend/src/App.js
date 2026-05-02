import { useState } from "react";
const API = "https://govdoc-ai-backend.onrender.com";

const COLORS = {
  navyBlue: "#003366",
  darkBlue: "#00234B",
  orange: "#FF6600",
  lightOrange: "#FF8C00",
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  gray: "#666666",
  green: "#1a7a4a",
  red: "#cc0000",
  yellow: "#FFC107",
};

const styles = {
  // ── Top bar ──────────────────────────────────────
  topBar: {
    background: COLORS.darkBlue,
    color: COLORS.white,
    padding: "6px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 12,
  },
  // ── Main header ──────────────────────────────────
  header: {
    background: `linear-gradient(135deg, ${COLORS.navyBlue} 0%, ${COLORS.darkBlue} 100%)`,
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `4px solid ${COLORS.orange}`,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  emblem: { width: 64, height: 64, objectFit: "contain" },
  headerText: { color: COLORS.white },
  headerTitle: { fontSize: 22, fontWeight: "bold", margin: 0, letterSpacing: 1 },
  headerSubtitle: { fontSize: 12, color: "#aac4e0", margin: 0 },
  headerMinistry: { fontSize: 11, color: COLORS.orange, margin: 0, marginTop: 2 },
  // ── Nav bar ──────────────────────────────────────
  navBar: {
    background: COLORS.orange,
    display: "flex",
    gap: 0,
    padding: "0 24px",
  },
  navItem: {
    color: COLORS.white,
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: "600",
    borderRight: "1px solid rgba(255,255,255,0.3)",
    transition: "background 0.2s",
  },
  // ── Page wrapper ─────────────────────────────────
  page: { minHeight: "100vh", background: COLORS.lightGray, fontFamily: "Arial, sans-serif" },
  main: { maxWidth: 900, margin: "0 auto", padding: "24px 16px" },
  // ── Cards ────────────────────────────────────────
  card: {
    background: COLORS.white,
    borderRadius: 4,
    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
    marginBottom: 20,
    overflow: "hidden",
  },
  cardHeader: {
    background: COLORS.navyBlue,
    color: COLORS.white,
    padding: "12px 20px",
    fontSize: 15,
    fontWeight: "bold",
    borderLeft: `5px solid ${COLORS.orange}`,
  },
  cardBody: { padding: 20 },
  // ── Form ─────────────────────────────────────────
  formGroup: { marginBottom: 16 },
  label: { display: "block", fontSize: 13, fontWeight: "bold", color: COLORS.navyBlue, marginBottom: 5 },
  input: {
    width: "100%", padding: "10px 12px", border: `1px solid #ccc`,
    borderRadius: 3, fontSize: 14, boxSizing: "border-box",
    outline: "none", transition: "border 0.2s",
  },
  select: {
    width: "100%", padding: "10px 12px", border: `1px solid #ccc`,
    borderRadius: 3, fontSize: 14, boxSizing: "border-box", background: COLORS.white,
  },
  // ── Buttons ──────────────────────────────────────
  btnPrimary: {
    background: COLORS.navyBlue, color: COLORS.white,
    border: "none", padding: "11px 28px", borderRadius: 3,
    fontSize: 14, fontWeight: "bold", cursor: "pointer", width: "100%",
    marginTop: 8, letterSpacing: 0.5,
  },
  btnOrange: {
    background: COLORS.orange, color: COLORS.white,
    border: "none", padding: "11px 28px", borderRadius: 3,
    fontSize: 14, fontWeight: "bold", cursor: "pointer", width: "100%",
    marginTop: 8,
  },
  btnGray: {
    background: "#888", color: COLORS.white,
    border: "none", padding: "10px 20px", borderRadius: 3,
    fontSize: 13, cursor: "pointer", width: "100%", marginTop: 8,
  },
  // ── Status badges ────────────────────────────────
  badge: (status) => ({
    display: "inline-block", padding: "3px 10px", borderRadius: 12,
    fontSize: 11, fontWeight: "bold", textTransform: "uppercase",
    background: status === "approved" ? "#d4edda" : status === "flagged" ? "#f8d7da" : "#fff3cd",
    color: status === "approved" ? COLORS.green : status === "flagged" ? COLORS.red : "#856404",
  }),
  // ── Alert ────────────────────────────────────────
  alert: (type) => ({
    padding: "10px 16px", borderRadius: 3, marginBottom: 14, fontSize: 13,
    background: type === "error" ? "#f8d7da" : type === "success" ? "#d4edda" : "#cce5ff",
    color: type === "error" ? "#721c24" : type === "success" ? "#155724" : "#004085",
    border: `1px solid ${type === "error" ? "#f5c6cb" : type === "success" ? "#c3e6cb" : "#b8daff"}`,
  }),
  // ── Score bar ────────────────────────────────────
  scoreBar: (val) => ({
    height: 10, borderRadius: 5, marginTop: 4,
    background: val >= 90 ? COLORS.green : val >= 75 ? COLORS.orange : COLORS.red,
    width: `${val}%`, transition: "width 0.8s ease",
  }),
  // ── Stats ────────────────────────────────────────
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 },
  statBox: (color) => ({
    background: color, color: COLORS.white, borderRadius: 4,
    padding: "16px 12px", textAlign: "center",
  }),
  statNum: { fontSize: 28, fontWeight: "bold", margin: 0 },
  statLabel: { fontSize: 12, margin: 0, opacity: 0.9 },
  // ── Services grid ────────────────────────────────
  servicesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  serviceCard: (selected) => ({
    border: `2px solid ${selected ? COLORS.orange : "#ddd"}`,
    borderRadius: 4, padding: "14px 10px", textAlign: "center",
    cursor: "pointer", background: selected ? "#fff3e6" : COLORS.white,
    transition: "all 0.2s",
  }),
  serviceIcon: { fontSize: 28, marginBottom: 6 },
  serviceLabel: { fontSize: 12, fontWeight: "bold", color: COLORS.navyBlue },
  // ── Footer ───────────────────────────────────────
  footer: {
    background: COLORS.darkBlue, color: "#aac4e0",
    padding: "20px 24px", marginTop: 40, fontSize: 12, textAlign: "center",
  },
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
  const [dashboard, setDashboard] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [statusData, setStatusData] = useState(null);

  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", city: "", state: "Maharashtra", aadhaar: "" });
  const [loginForm, setLoginForm] = useState({ email: "", phone: "" });

  async function register() {
    setLoading(true); setMessage("");
    const res = await fetch(`${API}/api/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regForm)
    });
    const data = await res.json();
    setLoading(false);
    if (data.user_id) {
      setUserId(data.user_id); setUserName(data.name);
      setMessage(""); setPage("dashboard"); loadDashboard(data.user_id);
    } else { setMessage(data.error || "Registration failed"); }
  }

  async function login() {
    setLoading(true); setMessage("");
    const res = await fetch(`${API}/api/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm)
    });
    const data = await res.json();
    setLoading(false);
    if (data.user_id) {
      setUserId(data.user_id); setUserName(data.name);
      setMessage(""); setPage("dashboard"); loadDashboard(data.user_id);
    } else { setMessage(data.error || "Invalid credentials"); }
  }

  async function loadDashboard(uid) {
    const res = await fetch(`${API}/api/dashboard/${uid || userId}`);
    const data = await res.json();
    setDashboard(data);
  }

  async function applyService() {
    if (!selectedService) { setMessage("Please select a service"); return; }
    setLoading(true); setMessage("");
    const res = await fetch(`${API}/api/apply`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, service: selectedService })
    });
    const data = await res.json();
    setLoading(false);
    if (data.app_id) { setAppId(data.app_id); setPage("upload"); }
    else { setMessage(data.error || "Failed to start application"); }
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
    if (data.filename) setMessage(`✅ File uploaded! Total: ${data.total_docs}`);
    else setMessage(data.error || "Upload failed");
  }

  async function verify() {
    setLoading(true); setMessage("🤖 AI is verifying your documents...");
    const res = await fetch(`${API}/api/verify/${appId}`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.scores) { setScores(data); setPage("result"); }
    else { setMessage(data.error || "Verification failed"); }
  }

  async function viewStatus(aid) {
    const res = await fetch(`${API}/api/status/${aid}`);
    const data = await res.json();
    setStatusData(data); setPage("status");
  }

  function logout() {
    setUserId(""); setUserName(""); setDashboard(null);
    setPage("home"); setMessage("");
  }

  // ── COMPONENTS ──────────────────────────────────────────────

  function GovHeader() {
    return (
      <>
        {/* Top bar */}
        <div style={styles.topBar}>
          <span>🇮🇳 भारत सरकार | Government of India</span>
          <span style={{ display: "flex", gap: 16 }}>
            <span>Skip to Main Content</span>
            <span>|</span>
            <span>Screen Reader Access</span>
            <span>|</span>
            <span>A- A A+</span>
          </span>
        </div>

        {/* Main header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            {/* Ashoka Emblem as SVG */}
            <svg width="60" height="60" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="#FF6600" opacity="0.15"/>
              <text x="50" y="62" textAnchor="middle" fontSize="40" fill="#FF6600">⚙️</text>
            </svg>
            <div style={styles.headerText}>
              <p style={styles.headerTitle}>GovDoc AI Portal</p>
              <p style={styles.headerSubtitle}>गवर्नमेंट डॉक्यूमेंट वेरिफिकेशन पोर्टल</p>
              <p style={styles.headerMinistry}>Ministry of Electronics & Information Technology | Pune Municipal Corporation</p>
            </div>
          </div>
          <div style={{ textAlign: "right", color: COLORS.white }}>
            {/* Indian Flag colors */}
            <div style={{ display: "flex", gap: 3, marginBottom: 6, justifyContent: "flex-end" }}>
              <div style={{ width: 40, height: 8, background: "#FF9933", borderRadius: 1 }}/>
              <div style={{ width: 40, height: 8, background: "#FFFFFF", borderRadius: 1 }}/>
              <div style={{ width: 40, height: 8, background: "#138808", borderRadius: 1 }}/>
            </div>
            {userName && <div style={{ fontSize: 13, color: "#aac4e0" }}>Welcome, {userName}</div>}
            {userName && (
              <button onClick={logout} style={{
                background: "transparent", border: `1px solid ${COLORS.orange}`,
                color: COLORS.orange, padding: "4px 12px", borderRadius: 3,
                cursor: "pointer", fontSize: 12, marginTop: 4
              }}>Logout</button>
            )}
          </div>
        </div>

        {/* Nav bar */}
        <div style={styles.navBar}>
         {[
            { label: "Home", action: () => setPage("home") },
            { label: "Services", action: () => userId ? setPage("apply") : setPage("login") },
            { label: "Track Application", action: () => userId ? setPage("dashboard") : setPage("login") },
            { label: "Help & Support", action: () => setPage("help") },
            { label: "About", action: () => setPage("about") },
          ].map(item => (
            <div key={item.label} style={styles.navItem}
              onClick={item.action}
              onMouseEnter={e => e.target.style.background = "rgba(0,0,0,0.2)"}
              onMouseLeave={e => e.target.style.background = "transparent"}>
              {item.label}
            </div>
          ))}
          {userName && (
            <div style={{ ...styles.navItem, marginLeft: "auto" }}
              onClick={() => { setPage("dashboard"); loadDashboard(); }}>
              📊 My Dashboard
            </div>
          )}
        </div>
      </>
    );
  }

  function GovFooter() {
    return (
      <div style={styles.footer}>
        <div style={{ marginBottom: 8 }}>
          <strong style={{ color: COLORS.white }}>GovDoc AI Portal</strong> — Government of India Initiative
        </div>
        <div style={{ marginBottom: 8 }}>
          Ministry of Electronics & Information Technology | Pune Municipal Corporation
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 8 }}>
          {["Privacy Policy", "Terms of Use", "Accessibility", "Contact Us", "RTI", "Sitemap"].map(l => (
            <span key={l} style={{ color: COLORS.orange, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <div>© 2026 Government of India. All Rights Reserved. | This is an AI-powered demo portal.</div>
      </div>
    );
  }

  // ── HOME PAGE ──────────────────────────────────────────────
  if (page === "home") return (
    <div style={styles.page}>
      <GovHeader />
      <div style={styles.main}>
        {/* Hero banner */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.navyBlue}, ${COLORS.darkBlue})`,
          borderRadius: 4, padding: "30px 24px", marginBottom: 20,
          borderLeft: `6px solid ${COLORS.orange}`, color: COLORS.white,
        }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>🇮🇳 Digital India — Document Verification Portal</h2>
          <p style={{ margin: "0 0 16px", color: "#aac4e0", fontSize: 14 }}>
            AI-powered government document verification system. Apply for certificates, track status, and get instant AI verification.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setPage("register")} style={{ ...styles.btnOrange, width: "auto", marginTop: 0 }}>
              📝 Register as Citizen
            </button>
            <button onClick={() => setPage("login")} style={{
              background: "transparent", border: `2px solid ${COLORS.white}`,
              color: COLORS.white, padding: "10px 20px", borderRadius: 3,
              fontSize: 14, fontWeight: "bold", cursor: "pointer",
            }}>
              🔐 Citizen Login
            </button>
          </div>
        </div>

        {/* Services overview */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>📋 Available Services</div>
          <div style={styles.cardBody}>
            <div style={styles.servicesGrid}>
              {SERVICES.map(s => (
                <div key={s.id} style={styles.serviceCard(false)}
                  onClick={() => setPage("login")}>
                  <div style={styles.serviceIcon}>{s.icon}</div>
                  <div style={styles.serviceLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[
            { icon: "🤖", title: "AI Verification", desc: "Advanced AI scores your documents instantly with 90%+ accuracy" },
            { icon: "🔒", title: "Secure & Safe", desc: "End-to-end encrypted. Your data is protected under IT Act 2000" },
            { icon: "⚡", title: "Fast Processing", desc: "Get your documents verified within minutes, not days" },
          ].map(f => (
            <div key={f.title} style={styles.card}>
              <div style={styles.cardBody}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontWeight: "bold", color: COLORS.navyBlue, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: COLORS.gray }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <GovFooter />
    </div>
  );

  // ── REGISTER PAGE ──────────────────────────────────────────
  if (page === "register") return (
    <div style={styles.page}>
      <GovHeader />
      <div style={styles.main}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>📝 Citizen Registration — नागरिक पंजीकरण</div>
          <div style={styles.cardBody}>
            {message && <div style={styles.alert("error")}>{message}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Full Name (पूरा नाम) *", key: "name", placeholder: "As per Aadhaar card" },
                { label: "Email Address *", key: "email", placeholder: "example@gmail.com" },
                { label: "Mobile Number *", key: "phone", placeholder: "10-digit mobile number" },
                { label: "Aadhaar Number", key: "aadhaar", placeholder: "12-digit Aadhaar" },
                { label: "City / District *", key: "city", placeholder: "Pune" },
              ].map(f => (
                <div key={f.key} style={styles.formGroup}>
                  <label style={styles.label}>{f.label}</label>
                  <input style={styles.input} placeholder={f.placeholder}
                    value={regForm[f.key]}
                    onChange={e => setRegForm({ ...regForm, [f.key]: e.target.value })} />
                </div>
              ))}
              <div style={styles.formGroup}>
                <label style={styles.label}>State *</label>
                <select style={styles.select} value={regForm.state}
                  onChange={e => setRegForm({ ...regForm, state: e.target.value })}>
                  {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "UP", "MP"].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 8, padding: "10px", background: "#e8f4fd", borderRadius: 3, fontSize: 12, color: "#004085" }}>
              ℹ️ By registering, you agree to the Terms of Service under IT Act 2000. Your data is protected.
            </div>
            <button style={styles.btnPrimary} onClick={register} disabled={loading}>
              {loading ? "⏳ Registering..." : "✅ Register Now"}
            </button>
            <button style={styles.btnGray} onClick={() => setPage("login")}>
              Already registered? Login here
            </button>
          </div>
        </div>
      </div>
      <GovFooter />
    </div>
  );

  // ── LOGIN PAGE ─────────────────────────────────────────────
  if (page === "login") return (
    <div style={styles.page}>
      <GovHeader />
      <div style={styles.main}>
        <div style={{ maxWidth: 460, margin: "0 auto" }}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>🔐 Citizen Login — नागरिक लॉगिन</div>
            <div style={styles.cardBody}>
              {message && <div style={styles.alert("error")}>{message}</div>}
              <div style={styles.formGroup}>
                <label style={styles.label}>Registered Email Address *</label>
                <input style={styles.input} placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Registered Mobile Number *</label>
                <input style={styles.input} placeholder="Enter your mobile number"
                  value={loginForm.phone}
                  onChange={e => setLoginForm({ ...loginForm, phone: e.target.value })} />
              </div>
              <button style={styles.btnPrimary} onClick={login} disabled={loading}>
                {loading ? "⏳ Logging in..." : "🔐 Login to Portal"}
              </button>
              <button style={styles.btnGray} onClick={() => setPage("register")}>
                New citizen? Register here
              </button>
              <button style={styles.btnGray} onClick={() => setPage("home")}>
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
      <GovFooter />
    </div>
  );

  // ── DASHBOARD PAGE ─────────────────────────────────────────
  if (page === "dashboard") return (
    <div style={styles.page}>
      <GovHeader />
      <div style={styles.main}>
        {/* Welcome banner */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.navyBlue}, ${COLORS.darkBlue})`,
          borderRadius: 4, padding: "16px 20px", marginBottom: 16,
          borderLeft: `5px solid ${COLORS.orange}`, color: COLORS.white,
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: "bold" }}>🙏 Welcome, {userName}!</div>
            <div style={{ fontSize: 12, color: "#aac4e0", marginTop: 2 }}>Citizen ID: {userId} | Pune Municipal Corporation</div>
          </div>
          <button onClick={() => { setSelectedService(""); setPage("apply"); }}
            style={{ ...styles.btnOrange, width: "auto", marginTop: 0, padding: "10px 20px" }}>
            + New Application
          </button>
        </div>

        {/* Stats */}
        {dashboard && (
          <div style={styles.statsGrid}>
            <div style={styles.statBox(COLORS.navyBlue)}>
              <p style={styles.statNum}>{dashboard.total}</p>
              <p style={styles.statLabel}>Total Applications</p>
            </div>
            <div style={styles.statBox(COLORS.green)}>
              <p style={styles.statNum}>{dashboard.approved}</p>
              <p style={styles.statLabel}>Approved</p>
            </div>
            <div style={styles.statBox(COLORS.orange)}>
              <p style={styles.statNum}>{dashboard.pending}</p>
              <p style={styles.statLabel}>Pending</p>
            </div>
          </div>
        )}

        {/* Applications list */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>📋 My Applications</div>
          <div style={styles.cardBody}>
            {dashboard?.applications?.length === 0 && (
              <div style={{ textAlign: "center", color: COLORS.gray, padding: 20 }}>
                No applications yet. Click "+ New Application" to start.
              </div>
            )}
            {dashboard?.applications?.map(a => (
              <div key={a.app_id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 0", borderBottom: "1px solid #eee",
              }}>
                <div>
                  <div style={{ fontWeight: "bold", color: COLORS.navyBlue, fontSize: 14 }}>
                    {a.service?.replace(/_/g, " ").toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.gray }}>
                    {a.app_id} | Applied: {a.created_at?.slice(0, 10)}
                    {a.ai_score && ` | AI Score: ${a.ai_score}%`}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={styles.badge(a.status)}>{a.status}</span>
                  <button onClick={() => viewStatus(a.app_id)} style={{
                    background: COLORS.navyBlue, color: COLORS.white,
                    border: "none", padding: "5px 12px", borderRadius: 3,
                    fontSize: 12, cursor: "pointer"
                  }}>View</button>
                </div>
              </div>
            ))}
            <button style={styles.btnGray} onClick={() => loadDashboard()}>🔄 Refresh</button>
          </div>
        </div>
      </div>
      <GovFooter />
    </div>
  );

  // ── APPLY PAGE ─────────────────────────────────────────────
  if (page === "apply") return (
    <div style={styles.page}>
      <GovHeader />
      <div style={styles.main}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>🏛️ Apply for Government Service</div>
          <div style={styles.cardBody}>
            {message && <div style={styles.alert("error")}>{message}</div>}
            <p style={{ color: COLORS.gray, fontSize: 13, marginBottom: 16 }}>
              Select the service you want to apply for:
            </p>
            <div style={styles.servicesGrid}>
              {SERVICES.map(s => (
                <div key={s.id} style={styles.serviceCard(selectedService === s.id)}
                  onClick={() => setSelectedService(s.id)}>
                  <div style={styles.serviceIcon}>{s.icon}</div>
                  <div style={styles.serviceLabel}>{s.label}</div>
                </div>
              ))}
            </div>
            <button style={styles.btnPrimary} onClick={applyService} disabled={loading || !selectedService}>
              {loading ? "⏳ Processing..." : "✅ Proceed to Document Upload"}
            </button>
            <button style={styles.btnGray} onClick={() => setPage("dashboard")}>← Back to Dashboard</button>
          </div>
        </div>
      </div>
      <GovFooter />
    </div>
  );

  // ── UPLOAD PAGE ────────────────────────────────────────────
  if (page === "upload") return (
    <div style={styles.page}>
      <GovHeader />
      <div style={styles.main}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>📎 Upload Documents — Application: {appId}</div>
          <div style={styles.cardBody}>
            {message && <div style={styles.alert(message.includes("✅") ? "success" : "info")}>{message}</div>}
            <div style={{
              border: "2px dashed #ccc", borderRadius: 4, padding: 30,
              textAlign: "center", marginBottom: 16, background: "#fafafa"
            }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📁</div>
              <div style={{ fontSize: 14, color: COLORS.gray, marginBottom: 12 }}>
                Upload PDF, JPG, or PNG documents
              </div>
              <input type="file" onChange={uploadFile} accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: "none" }} id="fileInput" />
              <label htmlFor="fileInput" style={{
                background: COLORS.navyBlue, color: COLORS.white,
                padding: "10px 24px", borderRadius: 3, cursor: "pointer",
                fontSize: 14, fontWeight: "bold"
              }}>
                Choose File
              </label>
            </div>
            <div style={{ padding: "10px", background: "#fff3cd", borderRadius: 3, fontSize: 12, marginBottom: 16 }}>
              ⚠️ Please upload clear, legible scans. Blurry or damaged documents may fail verification.
            </div>
            <button style={styles.btnOrange} onClick={verify} disabled={loading}>
              {loading ? "⏳ AI Verifying..." : "🤖 Run AI Verification"}
            </button>
            <button style={styles.btnGray} onClick={() => setPage("dashboard")}>← Back to Dashboard</button>
          </div>
        </div>
      </div>
      <GovFooter />
    </div>
  );

  // ── RESULT PAGE ────────────────────────────────────────────
  if (page === "result" && scores) return (
    <div style={styles.page}>
      <GovHeader />
      <div style={styles.main}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>🤖 AI Verification Result — {appId}</div>
          <div style={styles.cardBody}>
            {/* Overall score */}
            <div style={{
              textAlign: "center", padding: "20px 0", borderBottom: "1px solid #eee", marginBottom: 20
            }}>
              <div style={{
                fontSize: 64, fontWeight: "bold",
                color: scores.scores?.overall >= 90 ? COLORS.green : scores.scores?.overall >= 75 ? COLORS.orange : COLORS.red
              }}>
                {scores.scores?.overall}%
              </div>
              <div style={{ fontSize: 14, color: COLORS.gray }}>AI Confidence Score</div>
              <div style={{ marginTop: 8 }}>
                <span style={styles.badge(scores.status)}>{scores.status?.replace(/_/g, " ")}</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: COLORS.navyBlue, fontWeight: "bold" }}>
                {scores.message}
              </div>
            </div>

            {/* Score breakdown */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: "bold", color: COLORS.navyBlue, marginBottom: 12 }}>📊 Score Breakdown</div>
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
                    <div style={styles.scoreBar(val)} />
                  </div>
                </div>
              ))}
            </div>

            {/* Officer info */}
            {scores.officer && (
              <div style={{ background: "#fff3cd", padding: 12, borderRadius: 3, marginBottom: 16, fontSize: 13 }}>
                <strong>👮 Assigned Officer:</strong> {scores.officer}
              </div>
            )}

            {/* Application details */}
            <div style={{ background: "#f8f9fa", padding: 12, borderRadius: 3, fontSize: 12, marginBottom: 16 }}>
              <div><strong>Application ID:</strong> {appId}</div>
              <div><strong>Status:</strong> {scores.status}</div>
              <div><strong>Verdict:</strong> {scores.verdict}</div>
            </div>

            <button style={styles.btnPrimary} onClick={() => { setPage("dashboard"); loadDashboard(); }}>
              📊 Go to Dashboard
            </button>
          </div>
        </div>
      </div>
      <GovFooter />
    </div>
  );

  // ── STATUS PAGE ────────────────────────────────────────────
  if (page === "status" && statusData) return (
    <div style={styles.page}>
      <GovHeader />
      <div style={styles.main}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>📋 Application Status</div>
          <div style={styles.cardBody}>
            <div style={{ marginBottom: 16 }}>
              <span style={styles.badge(statusData.status)}>{statusData.status?.replace(/_/g, " ")}</span>
            </div>
            {[
              ["Application ID", statusData.app_id],
              ["Service", statusData.service?.replace(/_/g, " ").toUpperCase()],
              ["Citizen Name", statusData.citizen],
              ["AI Score", statusData.ai_score ? `${statusData.ai_score}%` : "Pending"],
              ["Documents", statusData.documents],
              ["Officer", statusData.officer || "Auto-processed"],
              ["Applied On", statusData.created_at?.slice(0, 10)],
              ["Last Updated", statusData.updated_at?.slice(0, 10)],
            ].map(([label, val]) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between",
                padding: "10px 0", borderBottom: "1px solid #eee", fontSize: 13
              }}>
                <span style={{ color: COLORS.gray }}>{label}</span>
                <span style={{ fontWeight: "bold", color: COLORS.navyBlue }}>{val}</span>
              </div>
            ))}
            <button style={styles.btnPrimary} onClick={() => setPage("dashboard")}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
      <GovFooter />
    </div>
  );

 if (page === "about") return (
    <div style={styles.page}>
      <GovHeader />
      <div style={styles.main}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>🏛️ About GovDoc AI Portal — हमारे बारे में</div>
          <div style={styles.cardBody}>

            {/* Mission */}
            <div style={{ background: `linear-gradient(135deg, ${COLORS.navyBlue}, ${COLORS.darkBlue})`, borderRadius: 4, padding: 20, marginBottom: 20, color: COLORS.white }}>
              <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>🎯 Our Mission</div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: "#aac4e0" }}>
                GovDoc AI Portal is a Digital India initiative to simplify government document verification using Artificial Intelligence. Our goal is to make government services accessible, transparent, and fast for every citizen of India.
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { num: "9+", label: "Services Available" },
                { num: "95%", label: "AI Accuracy" },
                { num: "< 1 min", label: "Verification Time" },
                { num: "100%", label: "Secure & Encrypted" },
              ].map(s => (
                <div key={s.label} style={{ background: COLORS.orange, color: COLORS.white, borderRadius: 4, padding: "16px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: "bold" }}>{s.num}</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>⚙️ How It Works</div>
              <div style={styles.cardBody}>
                {[
                  { step: "1", title: "Register & Login", desc: "Create your citizen account with Aadhaar and mobile number" },
                  { step: "2", title: "Select Service", desc: "Choose from 9+ government services like Birth Certificate, PAN, Passport" },
                  { step: "3", title: "Upload Documents", desc: "Upload clear scans of required documents in PDF, JPG or PNG" },
                  { step: "4", title: "AI Verification", desc: "Our AI engine verifies authenticity, OCR, biometrics and fraud detection" },
                  { step: "5", title: "Get Result", desc: "Receive instant AI score. High scores get auto-approved, others go for officer review" },
                ].map(s => (
                  <div key={s.step} style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
                    <div style={{ background: COLORS.orange, color: COLORS.white, borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>
                      {s.step}
                    </div>
                    <div>
                      <div style={{ fontWeight: "bold", color: COLORS.navyBlue, fontSize: 13 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 2 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>💻 Technology Used</div>
              <div style={styles.cardBody}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  {[
                    { icon: "⚛️", name: "React.js", desc: "Frontend UI" },
                    { icon: "🐍", name: "Python Flask", desc: "Backend API" },
                    { icon: "🍃", name: "MongoDB Atlas", desc: "Database" },
                    { icon: "🤖", name: "AI/ML Engine", desc: "Document Verification" },
                    { icon: "☁️", name: "Render.com", desc: "Backend Hosting" },
                   { icon: "N", name: "Netlify", desc: "Frontend Hosting" },
                  ].map(t => (
                    <div key={t.name} style={{ border: "1px solid #ddd", borderRadius: 4, padding: 12, textAlign: "center" }}>
    <div style={styles.page}>
      <GovHeader />
      <div style={styles.main}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>❓ Help & Support — सहायता केंद्र</div>
          <div style={styles.cardBody}>
            {/* FAQ */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: "bold", color: COLORS.navyBlue, fontSize: 16, marginBottom: 12 }}>
                📋 Frequently Asked Questions
              </div>
              {[
                { q: "How do I apply for a certificate?", a: "Register as a citizen, login, click '+ New Application', select your service, upload documents and run AI verification." },
                { q: "What documents do I need to upload?", a: "Upload clear scans of Aadhaar card, address proof, and any service-specific documents in PDF, JPG or PNG format." },
                { q: "How long does verification take?", a: "AI verification is instant. If sent for manual review, officer will process within 3-5 working days." },
                { q: "What is the AI Confidence Score?", a: "It is a score from 0-100 showing how authentic your documents are. Score above 90% means auto-approved." },
                { q: "Who is the assigned officer?", a: "If your score is between 75-90%, it is assigned to Rajesh Kumar, Pune Municipal Corporation for manual review." },
                { q: "Is my data safe?", a: "Yes. All data is encrypted and protected under IT Act 2000 and Personal Data Protection Act." },
              ].map((faq, i) => (
                <div key={i} style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}>
                  <div style={{ fontWeight: "bold", color: COLORS.navyBlue, fontSize: 13, marginBottom: 4 }}>
                    Q: {faq.q}
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.gray }}>
                    A: {faq.a}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div style={{ background: "#f0f4ff", padding: 16, borderRadius: 4, marginBottom: 16 }}>
              <div style={{ fontWeight: "bold", color: COLORS.navyBlue, marginBottom: 12 }}>📞 Contact Us</div>
              {[
                { icon: "📞", label: "Helpline", value: "1800-111-555 (Toll Free)" },
                { icon: "📧", label: "Email", value: "support@govdocai.gov.in" },
                { icon: "🏢", label: "Office", value: "Pune Municipal Corporation, Shivajinagar, Pune - 411005" },
                { icon: "🕐", label: "Working Hours", value: "Monday to Friday, 9:00 AM to 6:00 PM" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", gap: 12, marginBottom: 8, fontSize: 13 }}>
                  <span>{c.icon}</span>
                  <span style={{ color: COLORS.gray, minWidth: 100 }}>{c.label}:</span>
                  <span style={{ fontWeight: "bold", color: COLORS.navyBlue }}>{c.value}</span>
                </div>
              ))}
            </div>

            <button style={styles.btnPrimary} onClick={() => setPage("home")}>← Back to Home</button>
          </div>
        </div>
      </div>
      <GovFooter />
    </div>
  );

  return null;
}
