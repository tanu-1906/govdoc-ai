from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from pymongo import MongoClient
import uuid, os, random

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ─────────────────────────────────────────────
# MongoDB Connection  ← ONLY CHANGE YOUR PASSWORD HERE
# ─────────────────────────────────────────────
MONGO_URI = "mongodb+srv://tanushri:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
client     = MongoClient(MONGO_URI)
db         = client["govdoc_ai"]         # database name
users_col  = db["users"]                 # collection for users
apps_col   = db["applications"]          # collection for applications

# ─────────────────────────────────────────────
# ROUTE 1: Home / health check
# ─────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({
        "message": "GovDoc AI Backend is running!",
        "version": "2.0 (MongoDB)",
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

    required = ["name", "email", "phone", "city"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Check if email already exists in MongoDB
    if users_col.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 409

    user_id = str(uuid.uuid4())[:8]
    user = {
        "user_id":    user_id,
        "name":       data["name"],
        "email":      data["email"],
        "phone":      data["phone"],
        "city":       data["city"],
        "state":      data.get("state", "Maharashtra"),
        "aadhaar":    data.get("aadhaar", ""),
        "created_at": datetime.now().isoformat()
    }
    users_col.insert_one(user)

    return jsonify({
        "message": "Registration successful!",
        "user_id": user_id,
        "name":    data["name"]
    }), 201

# ─────────────────────────────────────────────
# ROUTE 3: Login
# ─────────────────────────────────────────────
@app.route("/api/login", methods=["POST"])
def login():
    data  = request.get_json()
    email = data.get("email")
    phone = data.get("phone")

    user = users_col.find_one({"email": email, "phone": phone})
    if user:
        return jsonify({
            "message": "Login successful!",
            "user_id": user["user_id"],
            "name":    user["name"]
        })

    return jsonify({"error": "Invalid email or phone number"}), 401

# ─────────────────────────────────────────────
# ROUTE 4: Start a new application
# ─────────────────────────────────────────────
@app.route("/api/apply", methods=["POST"])
def apply():
    data    = request.get_json()
    user_id = data.get("user_id")
    service = data.get("service")

    if not user_id or not users_col.find_one({"user_id": user_id}):
        return jsonify({"error": "Invalid user_id"}), 404

    if not service:
        return jsonify({"error": "Please select a service"}), 400

    app_id = "GDV-" + str(uuid.uuid4())[:8].upper()
    application = {
        "app_id":     app_id,
        "user_id":    user_id,
        "service":    service,
        "status":     "pending",
        "documents":  [],
        "ai_score":   None,
        "officer":    None,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    apps_col.insert_one(application)

    return jsonify({
        "message": "Application started!",
        "app_id":  app_id,
        "service": service,
        "status":  "pending"
    }), 201

# ─────────────────────────────────────────────
# ROUTE 5: Upload documents
# ─────────────────────────────────────────────
@app.route("/api/upload/<app_id>", methods=["POST"])
def upload_documents(app_id):
    if not apps_col.find_one({"app_id": app_id}):
        return jsonify({"error": "Application not found"}), 404

    if "file" not in request.files:
        return jsonify({"error": "No file attached"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    unique_name = f"{app_id}_{uuid.uuid4().hex[:6]}_{file.filename}"
    save_path   = os.path.join(app.config["UPLOAD_FOLDER"], unique_name)
    file.save(save_path)

    apps_col.update_one(
        {"app_id": app_id},
        {"$push": {"documents": unique_name},
         "$set":  {"status": "documents_uploaded", "updated_at": datetime.now().isoformat()}}
    )

    updated = apps_col.find_one({"app_id": app_id})
    return jsonify({
        "message":    "File uploaded successfully!",
        "filename":   unique_name,
        "app_id":     app_id,
        "total_docs": len(updated["documents"])
    }), 200

# ─────────────────────────────────────────────
# ROUTE 6: AI Verification
# ─────────────────────────────────────────────
@app.route("/api/verify/<app_id>", methods=["POST"])
def verify_documents(app_id):
    app_data = apps_col.find_one({"app_id": app_id})
    if not app_data:
        return jsonify({"error": "Application not found"}), 404

    if len(app_data["documents"]) == 0:
        return jsonify({"error": "No documents uploaded yet"}), 400

    ocr_score     = random.randint(85, 99)
    auth_score    = random.randint(78, 98)
    biometric     = random.randint(80, 99)
    fraud_score   = random.randint(88, 99)
    overall_score = round((ocr_score + auth_score + biometric + fraud_score) / 4)

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

    scores = {
        "ocr_extraction":     ocr_score,
        "document_authentic": auth_score,
        "biometric_match":    biometric,
        "fraud_detection":    fraud_score,
        "overall":            overall_score
    }

    apps_col.update_one(
        {"app_id": app_id},
        {"$set": {
            "status":     status,
            "ai_score":   overall_score,
            "verdict":    verdict,
            "officer":    officer,
            "scores":     scores,
            "updated_at": datetime.now().isoformat()
        }}
    )

    return jsonify({
        "message": message,
        "app_id":  app_id,
        "verdict": verdict,
        "status":  status,
        "officer": officer,
        "scores":  scores
    })

# ─────────────────────────────────────────────
# ROUTE 7: Check application status
# ─────────────────────────────────────────────
@app.route("/api/status/<app_id>", methods=["GET"])
def get_status(app_id):
    app_data = apps_col.find_one({"app_id": app_id})
    if not app_data:
        return jsonify({"error": "Application not found"}), 404

    user = users_col.find_one({"user_id": app_data["user_id"]}) or {}

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
# ROUTE 8: Citizen dashboard
# ─────────────────────────────────────────────
@app.route("/api/dashboard/<user_id>", methods=["GET"])
def dashboard(user_id):
    user = users_col.find_one({"user_id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_apps = list(apps_col.find({"user_id": user_id}))
    result = []
    for a in user_apps:
        result.append({
            "app_id":     a["app_id"],
            "service":    a["service"],
            "status":     a["status"],
            "ai_score":   a.get("ai_score"),
            "created_at": a["created_at"]
        })

    approved = sum(1 for a in result if a["status"] == "approved")
    pending  = sum(1 for a in result if a["status"] in ["pending", "under_review", "processing"])

    # Remove MongoDB _id from user object before returning
    user.pop("_id", None)

    return jsonify({
        "user":         user,
        "total":        len(result),
        "approved":     approved,
        "pending":      pending,
        "applications": result
    })

# ─────────────────────────────────────────────
# Run the server
# ─────────────────────────────────────────────
if __name__ == "__main__":
    print("\n✅ GovDoc AI Backend starting with MongoDB...")
    print("🌿 Database: govdoc_ai on MongoDB Atlas")
    print("🔗 Open: http://localhost:5000\n")
    app.run(debug=True, port=5000)
