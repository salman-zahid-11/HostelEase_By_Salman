# 🚀 HostelEase Quick Start Guide

## 5-Minute Setup

Follow these steps to get HostelEase running locally.

### Step 1: Clone & Navigate

```bash
cd Hostel_Ease
```

### Step 2: Backend Setup (Terminal 1)

```bash
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your MongoDB URI
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/hostelenase

# Seed the database (creates test data)
npm run seed

# Start the server
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### Step 3: Frontend Setup (Terminal 2)

```bash
cd Frontend

# Install dependencies
npm install

# Start Angular dev server
npm start
```

You should see:
```
✔ Compiled successfully.
⠧ Building...
```

### Step 4: Open in Browser

Navigate to: **http://localhost:4200**

---

## 🔐 Login with Test Credentials

### Option 1: Student Login
1. Click on **Login** (or navigate to login page)
2. Select role: **Student**
3. Email: `akshit.verma@student.com`
4. Password: `student123`
5. Click **Login**

### Option 2: Warden Login
1. Select role: **Warden**
2. Email: `rajesh.warden@hostelenase.com`
3. Password: `warden123`
4. Click **Login**

### Option 3: Demo Buttons
Click the demo login buttons on the login page to auto-fill credentials.

---

## 📱 What You Can Do

### As a Student
✅ View your dashboard with complaint statistics
✅ Create new complaints (Report Issue)
✅ View all your complaints
✅ Check complaint details and status
✅ Add feedback/rating after resolution

### As a Warden
✅ View all complaints from all students
✅ Filter complaints by status
✅ Assign complaints to technicians
✅ Update complaint status
✅ View technician performance
✅ See basic analytics

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# If in use, kill the process or change PORT in server.js
```

### MongoDB Connection Error
```
Error: MongoDB connection failed

Solution:
1. Verify MONGODB_URI in .env
2. Ensure MongoDB Atlas whitelist includes your IP
3. Check username and password
```

### Frontend Build Error
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port 4200 Already in Use
```bash
npm start -- --port 4300
```

---

## 📚 Next Steps

1. **Explore the UI**
   - Create a test complaint as a student
   - Assign it as a warden
   - Check the status updates

2. **Check the Code**
   - Backend: `Backend/models/` - Database schemas
   - Backend: `Backend/controllers/` - Business logic
   - Frontend: `Frontend/src/app/` - Angular components
   - Frontend: `Frontend/src/app/core/` - Services

3. **Review Documentation**
   - [Backend README](./Backend/README.md) - API endpoints
   - [Frontend README](./Frontend/README.md) - Component structure
   - [Main README](./README.md) - Full project overview
   - [Phase 1 Report](./PHASE_1_COMPLETION_REPORT.md) - What's built

4. **Customize for Production**
   - Update `.env` variables
   - Configure MongoDB Atlas
   - Set up email service
   - Update API base URL for production

---

## 🔄 Common Tasks

### Create a New User (Postman/curl)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "9876543210",
    "department": "CS",
    "role": "student",
    "studentDetails": {
      "studentId": "CS2021099",
      "block": "B",
      "roomNumber": "205"
    }
  }'
```

### Get All Complaints (with token)

```bash
curl -X GET http://localhost:5000/api/complaints \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Complaint Status

```bash
curl -X PATCH http://localhost:5000/api/complaints/COMPLAINT_ID/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "note": "Work started"
  }'
```

---

## 📊 Checking Your Setup

### Backend Health Check
```bash
# Should return 200 OK
curl http://localhost:5000/api/health
```

### Frontend Health Check
```bash
# Open browser: http://localhost:4200
# Should show login page
```

### Database Connection
```bash
# Check Backend console output for:
# "MongoDB connected: your-cluster.mongodb.net"
```

---

## 🎯 Sample Data

The seed script creates:

**Users:**
- 1 Admin (admin@hostelenase.com)
- 2 Wardens (rajesh.warden@, priya.warden@)
- 2 Technicians (ravi.tech@, vikram.tech@)
- 3 Students (akshit.verma@, neha.patel@, rohan.singh@)

**Complaints:**
- C001: Water tap leaking (Resolved) ✓
- C002: Ceiling fan not working (In Progress) ⏳
- C003: Broken window pane (Pending) ⏱️

---

## 📁 Project Structure (Overview)

```
Hostel_Ease/
├── Backend/
│   ├── models/          # Database schemas
│   ├── controllers/      # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation
│   ├── config/          # Database config
│   ├── utils/           # Helper functions
│   └── server.js        # Main server file
│
├── Frontend/
│   ├── src/app/
│   │   ├── core/        # Services, guards, interceptors
│   │   └── modules/     # Feature modules (auth, student, warden)
│   └── angular.json     # Angular configuration
│
├── README.md            # Main documentation
└── PHASE_1_COMPLETION_REPORT.md
```

---

## ⚡ Quick Commands

```bash
# Backend
cd Backend
npm install              # Install dependencies
npm run seed            # Seed database with test data
npm run dev             # Start with auto-reload (Nodemon)
npm start               # Production start

# Frontend
cd Frontend
npm install              # Install dependencies
npm start               # Start dev server (port 4200)
npm run build           # Build for production
npm test                # Run tests
npm lint                # Run linter

# Cleanup
cd Backend && npm prune  # Remove unnecessary packages
cd Frontend && npm prune
```

---

## 🔐 Security Notes

- **Change Default Passwords** before production
- **Update JWT_SECRET** in `.env`
- **Enable HTTPS** in production
- **Set CORS properly** for your domain
- **Configure environment variables** securely

---

## 📞 Need Help?

1. **Check console logs** - Backend logs appear in Terminal 1
2. **Check browser console** - Frontend errors in DevTools (F12)
3. **Review README files** - Detailed docs in Backend/ and Frontend/
4. **Check network tab** - See API requests in DevTools
5. **Test with Postman** - API documentation in Backend README

---

## ✨ What's Next?

### Phase 2 Features
- Image upload for complaints
- Real-time WebSocket notifications
- Advanced filtering
- Technician mobile app

### Phase 3 Features
- Chart.js analytics dashboard
- Student feedback system
- SMS notifications
- Performance metrics

---

## 🚀 Ready to Deploy?

See [Backend README](./Backend/README.md) and [Frontend README](./Frontend/README.md) for deployment instructions to Heroku, Vercel, or your preferred platform.

---

**Happy coding! 🎉**

For detailed information, see [Phase 1 Completion Report](./PHASE_1_COMPLETION_REPORT.md).
