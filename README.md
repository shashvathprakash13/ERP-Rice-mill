# Golden Rice Rise ERP - Backend

Complete backend for the Golden Rice Rise Enterprise Resource Planning system built with **Node.js/Express + MongoDB**.

## 📋 Project Structure

```
new-erp-backend/
├── config/
│   └── db.js                    # MongoDB connection
├── models/
│   └── User.js                  # User schema with roles & permissions
├── middleware/
│   └── auth.js                  # JWT verification & role authorization
├── controllers/
│   └── authController.js        # Authentication logic
├── routes/
│   └── auth.js                  # Auth endpoints
├── server.js                    # Main server entry point
├── .env                         # Environment variables
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or Atlas)
- npm or yarn

### Installation

```bash
cd new-erp-backend
npm install
```

### Environment Setup

Update `.env` file:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/golden-rice-rise-erp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## 🔐 Authentication API Endpoints

### 1. Register User
**POST** `/api/auth/register`

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "fullName": "John Doe",
  "department": "warehouse",
  "phone": "9876543210",
  "role": "operator"
}
```

**Response (201)**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "operator",
    "department": "warehouse",
    "phone": "9876543210",
    "isActive": true,
    "createdAt": "2026-08-10T...",
    "updatedAt": "2026-08-10T..."
  }
}
```

---

### 2. Login User
**POST** `/api/auth/login`

```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response (200)**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ...user object },
  "expiresIn": "7d"
}
```

---

### 3. Logout
**POST** `/api/auth/logout`

**Response (200)**
```json
{
  "message": "Logout successful. Please delete the token on the client side."
}
```

---

### 4. Get User Profile ✅ (Protected)
**GET** `/api/auth/profile`

**Headers**
```
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "user": { ...user object }
}
```

---

### 5. Update Profile ✅ (Protected)
**PUT** `/api/auth/profile`

**Headers**
```
Authorization: Bearer <token>
```

**Body**
```json
{
  "fullName": "John Updated Doe",
  "email": "newemail@example.com",
  "phone": "9876543211"
}
```

**Response (200)**
```json
{
  "message": "Profile updated successfully",
  "user": { ...updated user object }
}
```

---

### 6. Change Password ✅ (Protected)
**POST** `/api/auth/change-password`

**Headers**
```
Authorization: Bearer <token>
```

**Body**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

**Response (200)**
```json
{
  "message": "Password changed successfully"
}
```

---

### 7. Get All Users ✅ (Admin Only)
**GET** `/api/auth/users`

**Headers**
```
Authorization: Bearer <admin_token>
```

**Response (200)**
```json
{
  "count": 5,
  "users": [
    { ...user1 },
    { ...user2 },
    ...
  ]
}
```

---

### 8. Update User Role ✅ (Admin Only)
**PUT** `/api/auth/users/:userId/role`

**Headers**
```
Authorization: Bearer <admin_token>
```

**Body**
```json
{
  "role": "manager"
}
```

Valid roles: `admin`, `manager`, `supervisor`, `operator`, `viewer`

**Response (200)**
```json
{
  "message": "User role updated successfully",
  "user": { ...updated user object }
}
```

---

## 👥 User Roles & Permissions

### Roles Available
1. **admin** - Full system access, user management
2. **manager** - Oversee operations, reports, approvals
3. **supervisor** - Manage specific sections/workflows
4. **operator** - Execute daily tasks, data entry
5. **viewer** - Read-only access (default)

### Departments
- warehouse
- production
- hr
- finance
- procurement
- it

---

## 🔒 Security Features

✅ **Password Hashing** - bcryptjs with salt rounds
✅ **JWT Authentication** - Secure token-based auth
✅ **Role-Based Access Control (RBAC)** - Endpoint-level authorization
✅ **Password Validation** - Minimum 6 characters
✅ **Email Validation** - RFC 5322 compliant
✅ **Last Login Tracking** - User activity monitoring
✅ **Account Status** - Activate/deactivate users
✅ **CORS Enabled** - Frontend integration ready

---

## 📝 Middleware

### `verifyToken`
Validates JWT token from Authorization header.

Usage:
```javascript
router.get('/protected-route', verifyToken, controller);
```

### `authorize(...roles)`
Checks if user has required role(s).

Usage:
```javascript
router.post('/admin-route', verifyToken, authorize('admin', 'manager'), controller);
```

---

## 🧪 Testing with Postman/cURL

### Register Admin User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "fullName": "Admin User",
    "department": "it",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Get Profile (use token from login response)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <your_token_here>"
```

---

## 📚 Backend Modules (Upcoming)

- [ ] Dashboard API
- [ ] Paddy Entry API
- [ ] Production API
- [ ] Warehouse API
- [ ] Workers API
- [ ] Attendance API
- [ ] Salary/Payroll API
- [ ] Payments API
- [ ] Ledger API
- [ ] Suppliers API
- [ ] Buyers API
- [ ] Infrastructure API
- [ ] Reports API

---

## ⚠️ Important Notes

1. **Change JWT_SECRET** in production
2. **Setup MongoDB** before running server
3. **Frontend CORS URL** update in `server.js` for production
4. **Token Storage** - Frontend should store token in localStorage/sessionStorage
5. **Token Refresh** - Implement refresh token mechanism for long sessions

---

## 🤝 Integration with Frontend

Update your frontend `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

The frontend already has API integration setup. Just ensure the backend is running!

---

## 📞 Support

For issues or questions, check MongoDB connection and JWT_SECRET in `.env`.
