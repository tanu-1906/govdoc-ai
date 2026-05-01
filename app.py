from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid, os, random

app = Flask(__name__)
CORS(app)  # Allows React frontend to talk to this backend

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ─────────────────────────────────────────────
# Fake in-memory database (replace with MongoDB later)
# ─────────────────────────────────────────────
users_db = {}        # { user_id: { name, email, phone, city } }
applications_db = {} # { app_id: { user_id, service, status, docs, score, created_at } }

# ─────────────────────────────────────────────
# ROUTE 1: Home / health check
# ─────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({
        "message": "GovDoc AI Backend is running!",
        "version": "1.0",
        "routes": [
            "POST /api/register",
            "POST /api/login",
            "POST /api/apply",
            "POST /api/upload/<app_id>",
            "POST /api/verify/<app_id>",
            "GET  /api/status/<app_id>",
            "GET  /api/dashboard/<user_id>",
        ]
    })

# ─────────────────────────────────────────────
# ROUTE 2: Register a new citizen
# ─────────────────────────────────────────────
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    # Validate required fields
    required = ["name", "email", "phone", "city"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Check if email already exists
    for user in users_db.values():
        if user["email"] == data["email"]:
            return jsonify({"error": "Email already registered"}), 409

    user_id = str(uuid.uuid4())[:8]  # Short unique ID like "a3f9b1c2"
    users_db[user_id] = {
        "user_id":    user_id,
        "name":       data["name"],
        "email":      data["email"],
        "phone":      data["phone"],
        "city":       data["city"],
        "state":      data.get("state", "Maharashtra"),
        "aadhaar":    data.get("aadhaar", ""),
        "created_at": datetime.now().isoformat()
    }

    return jsonify({
        "message":  "Registration successful!",
        "user_id":  user_id,
        "name":     data["name"]
    }), 201

# ─────────────────────────────────────────────
# ROUTE 3: Login (simple email + phone check)
# ─────────────────────────────────────────────
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    phone = data.get("phone")

    for user_id, user in users_db.items():
        if user["email"] == email and user["phone"] == phone:
            return jsonify({
                "message": "Login successful!",
                "user_id": user_id,
                "name":    user["name"]
            })

    return jsonify({"error": "Invalid email or phone number"}), 401

# ─────────────────────────────────────────────
# ROUTE 4: Start a new application
# ─────────────────────────────────────────────
@app.route("/api/apply", methods=["POST"])
def apply():
    data = request.get_json()
    user_id = data.get("user_id")
    service = data.get("service")  # e.g. "birth_certificate"

    if not user_id or user_id not in users_db:
        return jsonify({"error": "Invalid user_id"}), 404

    if not service:
        return jsonify({"error": "Please select a service"}), 400

    app_id = "GDV-" + str(uuid.uuid4())[:8].upper()
    applications_db[app_id] = {
        "app_id":     app_id,
        "user_id":    user_id,
        "service":    service,
        "status":     "pending",       # pending → processing → approved / rejected
        "documents":  [],              # list of uploaded file names
        "ai_score":   None,            # filled after AI verification
        "officer":    None,            # assigned if score < 80
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

    return jsonify({
        "message": "Application started!",
        "app_id":  app_id,
        "service": service,
        "status":  "pending"
    }), 201

# ─────────────────────────────────────────────
# ROUTE 5: Upload documents for an application
# ─────────────────────────────────────────────
@app.route("/api/upload/<app_id>", methods=["POST"])
def upload_documents(app_id):
    if app_id not in applications_db:
        return jsonify({"error": "Application not found"}), 404

    if "file" not in request.files:
        return jsonify({"error": "No file attached"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Save file with unique name to avoid conflicts
    unique_name = f"{app_id}_{uuid.uuid4().hex[:6]}_{file.filename}"
    save_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_name)
    file.save(save_path)

    # Add to application record
    applications_db[app_id]["documents"].append(unique_name)
    applications_db[app_id]["status"] = "documents_uploaded"
    applications_db[app_id]["updated_at"] = datetime.now().isoformat()

    return jsonify({
        "message":    "File uploaded successfully!",
        "filename":   unique_name,
        "app_id":     app_id,
        "total_docs": len(applications_db[app_id]["documents"])
    }), 200

# ─────────────────────────────────────────────
# ROUTE 6: Run AI Verification (the core feature)
# ─────────────────────────────────────────────
@app.route("/api/verify/<app_id>", methods=["POST"])
def verify_documents(app_id):
    if app_id not in applications_db:
        return jsonify({"error": "Application not found"}), 404

    app_data = applications_db[app_id]

    if len(app_data["documents"]) == 0:
        return jsonify({"error": "No documents uploaded yet"}), 400

    # ── Simulated AI Scoring ──────────────────────────
    # In real version: run Tesseract OCR + ML model here
    # For now: simulate realistic scores
    ocr_score      = random.randint(85, 99)
    auth_score     = random.randint(78, 98)
    biometric      = random.randint(80, 99)
    fraud_score    = random.randint(88, 99)
    overall_score  = round((ocr_score + auth_score + biometric + fraud_score) / 4)

    # ── Decision Logic (from your Assignment 1 flowchart) ──
    if overall_score >= 90:
        verdict = "auto_approved"
        status  = "approved"
        officer = None
        message = "High confidence — auto approved by AI"
    elif overall_score >= 75:
        verdict = "manual_review"
        status  = "under_review"
        officer = "Rajesh Kumar (Municipal Corporation, Pune)"
        message = "Moderate confidence — sent for officer review"
    else:
        verdict = "flagged"
        status  = "flagged"
        officer = "Rajesh Kumar (Municipal Corporation, Pune)"
        message = "Low confidence — flagged for manual verification"

    # ── Save results ──────────────────────────────────
    applications_db[app_id].update({
        "status":     status,
        "ai_score":   overall_score,
        "verdict":    verdict,
        "officer":    officer,
        "scores": {
            "ocr_extraction":     ocr_score,
            "document_authentic": auth_score,
            "biometric_match":    biometric,
            "fraud_detection":    fraud_score,
            "overall":            overall_score
        },
        "updated_at": datetime.now().isoformat()
    })

    return jsonify({
        "message":  message,
        "app_id":   app_id,
        "verdict":  verdict,
        "status":   status,
        "officer":  officer,
        "scores": {
            "ocr_extraction":     ocr_score,
            "document_authentic": auth_score,
            "biometric_match":    biometric,
            "fraud_detection":    fraud_score,
            "overall":            overall_score
        }
    })

# ─────────────────────────────────────────────
# ROUTE 7: Check application status
# ─────────────────────────────────────────────
@app.route("/api/status/<app_id>", methods=["GET"])
def get_status(app_id):
    if app_id not in applications_db:
        return jsonify({"error": "Application not found"}), 404

    app_data = applications_db[app_id]
    user     = users_db.get(app_data["user_id"], {})

    return jsonify({
        "app_id":     app_id,
        "service":    app_data["service"],
        "status":     app_data["status"],
        "ai_score":   app_data.get("ai_score"),
        "officer":    app_data.get("officer"),
        "documents":  len(app_data["documents"]),
        "citizen":    user.get("name", "Unknown"),
        "created_at": app_data["created_at"],
        "updated_at": app_data["updated_at"]
    })

# ─────────────────────────────────────────────
# ROUTE 8: Citizen dashboard — all applications
# ─────────────────────────────────────────────
@app.route("/api/dashboard/<user_id>", methods=["GET"])
def dashboard(user_id):
    if user_id not in users_db:
        return jsonify({"error": "User not found"}), 404

    user_apps = [
        {
            "app_id":     a["app_id"],
            "service":    a["service"],
            "status":     a["status"],
            "ai_score":   a.get("ai_score"),
            "created_at": a["created_at"]
        }
        for a in applications_db.values()
        if a["user_id"] == user_id
    ]

    approved = sum(1 for a in user_apps if a["status"] == "approved")
    pending  = sum(1 for a in user_apps if a["status"] in ["pending", "under_review", "processing"])

    return jsonify({
        "user":         users_db[user_id],
        "total":        len(user_apps),
        "approved":     approved,
        "pending":      pending,
        "applications": user_apps
    })

# ─────────────────────────────────────────────
# Run the server
# ─────────────────────────────────────────────
if __name__ == "__main__":
    print("\n✅ GovDoc AI Backend starting...")
    print("📍 Open: http://localhost:5000\n")
    app.run(debug=True, port=5000)
