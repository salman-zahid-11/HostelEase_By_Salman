# HostelEase Backend

Smart Maintenance Management System for Hostels - Backend API

## Project Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```bash
     # MongoDB Atlas
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostelenase
     
     # JWT
     JWT_SECRET=your_jwt_secret_key_here
     JWT_EXPIRY=7d
     
     # Email (Nodemailer)
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your_email@gmail.com
     SMTP_PASS=your_app_password
     
     # Cloudinary
     CLOUDINARY_NAME=your_name
     CLOUDINARY_API_KEY=your_key
     CLOUDINARY_API_SECRET=your_secret
     ```

3. **Run Database Seeding**
   ```bash
   npm run seed
   ```

4. **Start the Server**
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

The API will be available at `http://localhost:5000`

## Test Credentials

### Admin
- **Email:** admin@hostelenase.com
- **Password:** admin123

### Warden
- **Email:** rajesh.warden@hostelenase.com
- **Password:** warden123

### Technician
- **Email:** ravi.tech@hostelenase.com
- **Password:** tech123

### Student
- **Email:** akshit.verma@student.com
- **Password:** student123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Complaints
- `GET /api/complaints` - Get all complaints (filtered by role)
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/:id` - Get single complaint
- `PUT /api/complaints/:id` - Update complaint
- `PATCH /api/complaints/:id/status` - Update status
- `PATCH /api/complaints/:id/assign` - Assign technician
- `POST /api/complaints/:id/feedback` - Add feedback
- `GET /api/complaints/stats/dashboard` - Dashboard statistics

### Technicians
- `GET /api/technicians` - Get all technicians
- `POST /api/technicians` - Add new technician
- `PUT /api/technicians/:id` - Update technician
- `DELETE /api/technicians/:id` - Delete technician

### Analytics
- `GET /api/analytics/complaints-over-time` - Complaints trend
- `GET /api/analytics/by-category` - Complaints by category
- `GET /api/analytics/technician-performance` - Technician metrics
- `GET /api/analytics/response-time` - Response time metrics

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/pending-approval` - Get pending approvals
- `PATCH /api/users/:id/approve` - Approve user
- `PATCH /api/users/:id/reject` - Reject user

## Key Features Implemented

✅ JWT Authentication  
✅ Role-based Access Control  
✅ Complaint Management  
✅ Status Timeline Tracking  
✅ Email Notifications  
✅ Analytics & Metrics  
✅ User Management  
✅ Technician Assignment  

## Security Features

- Helmet.js for security headers
- CORS enabled
- Rate limiting
- Password hashing with bcryptjs
- JWT token validation
- Role-based authorization
- Input validation
