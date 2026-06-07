# HostelEase Frontend

Smart Maintenance Management System for Hostels - Angular Frontend

## Project Setup

### Prerequisites
- Node.js (v18+)
- Angular CLI (latest)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:4200`

3. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── complaint.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── technician.service.ts
│   │   ├── interceptors/
│   │   │   ├── jwt.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   └── guards/
│   │       └── auth.guard.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── auth.module.ts
│   │   ├── student/
│   │   │   ├── dashboard/
│   │   │   ├── report-issue/
│   │   │   ├── complaint-details/
│   │   │   └── student.module.ts
│   │   └── warden/
│   │       ├── dashboard/
│   │       └── warden.module.ts
│   ├── app.module.ts
│   └── app-routing.module.ts
├── environments/
├── index.html
└── main.ts
```

## Key Features

✅ Student Dashboard  
✅ Create & Manage Complaints  
✅ View Complaint Details & Status Timeline  
✅ Warden Dashboard with Analytics  
✅ JWT Authentication & Role-Based Access Control  
✅ Responsive Design with Tailwind CSS  
✅ Real-time Notifications (Phase 2)  
✅ Image Upload Support (Phase 2)  

## Test Credentials

### Student
- **Email:** akshit.verma@student.com
- **Password:** student123

### Warden
- **Email:** rajesh.warden@hostelenase.com
- **Password:** warden123

### Admin
- **Email:** admin@hostelenase.com
- **Password:** admin123

## Environment Configuration

The API base URL is configured in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api'
};
```

Update this for production in `src/environments/environment.prod.ts`

## Technologies Used

- **Angular 17** - Frontend framework
- **Tailwind CSS** - Styling
- **TypeScript** - Language
- **RxJS** - Reactive programming
- **ng2-charts** - Charts (Phase 3)

## API Integration

All API calls are managed through services in `src/app/core/services/`:

- `auth.service.ts` - Authentication
- `complaint.service.ts` - Complaint management
- `notification.service.ts` - Notifications
- `analytics.service.ts` - Analytics data
- `technician.service.ts` - Technician management

## Interceptors

- **JwtInterceptor** - Automatically adds JWT token to all requests
- **ErrorInterceptor** - Handles HTTP errors and redirects on 401

## Guards

- **AuthGuard** - Protects routes and checks user roles

## Development Phase

This is **Phase 1** implementation covering:
- ✅ Authentication (Login/Register)
- ✅ Student Dashboard
- ✅ Complaint Creation & Management
- ✅ Warden Dashboard
- ✅ Role-Based Access Control

**Phase 2 will add:**
- Image Upload
- Technician Assignment
- Real-time Notifications
- Advanced Analytics

**Phase 3 will add:**
- Chart.js Integration
- Student Feedback System
- UI/UX Polish
- Responsive Design Improvements
