# Smart Factory Predictive Maintenance System - Project Info & API Specification

This document details the frontend project structure, current API configurations, required backend endpoints, and expected JSON schemas. Use this reference to align your backend API with the frontend integration.

---

## 🚀 Project Overview
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` integration)
- **Routing**: React Router DOM (with route protection guards)
- **Charts**: Recharts (Line, Area, Bar, Pie, and Gauge charts)
- **HTTP Client**: Axios (configured with request interceptors for JWT bearer tokens)

---

## 📁 Key File Locations

- **API Service Layer**: `src/services/api.js` (Centralized file containing Axios instance, routing, and mock data generators)
- **Auth Context**: `src/context/AuthContext.jsx` (Controls login/logout states, role persistence in `localStorage`, and handles API-based auth flow)
- **App Routes**: `src/routes/AppRoutes.jsx` (Defines router layout, protected pages, and role checks)
- **Theme Context**: `src/context/ThemeContext.jsx` (Manages Light/Dark mode state and toggle action)

---

## ⚙️ Environment Configuration

By default, the frontend points to:
`http://localhost:8080/api`

To change the backend base URL, create a `.env` file at the root of the project:
```env
VITE_API_URL=http://localhost:8080/api
```

---

## 🔌 API Endpoints Specification

### 1. User Authentication (Login)
* **Method**: `POST`
* **Endpoint**: `/api/auth/login`
* **Request Payload**:
  ```json
  {
    "email": "admin@factory.com",
    "password": "password"
  }
  ```
* **Response Payload (Success)**:
  ```json
  {
    "email": "admin@factory.com",
    "name": "John Admin",
    "role": "Admin", // Options: "Admin", "Engineer", "Viewer"
    "token": "your-jwt-auth-token-here"
  }
  ```

### 2. Machine Status List
* **Method**: `GET`
* **Endpoint**: `/api/machines`
* **Description**: Returns all machines monitored in the factory for real-time overview.
* **Response Payload**:
  ```json
  [
    {
      "id": "M101",
      "name": "CNC Router Alpha",
      "temperature": 85,
      "pressure": 40,
      "vibration": "HIGH", // Options: "LOW", "MEDIUM", "HIGH", "CRITICAL"
      "healthScore": 72, // Number: 0 to 100
      "status": "Warning", // Options: "Healthy", "Warning", "Critical"
      "uptime": 94, // Percentage
      "lastMaintenance": "2025-05-10"
    }
  ]
  ```

### 3. Real-Time Timeseries Chart Data
* **Method**: `GET`
* **Endpoint**: `/api/machines/timeseries`
* **Description**: Data points representing live sensor readings over time (displayed on the dashboard line chart).
* **Response Payload**:
  ```json
  [
    {
      "time": "02:00 AM",
      "temperature": 75.3,
      "vibration": 28.5,
      "pressure": 35.2
    }
  ]
  ```

### 4. Historical Analytics
* **Method**: `GET`
* **Endpoint**: `/api/analytics`
* **Description**: Aggregated historical metrics, trends, and performance comparisons.
* **Response Payload**:
  ```json
  {
    "metrics": {
      "avgTemperature": 73.2,
      "avgPressure": 35.4,
      "failureFrequency": 4.2,
      "machineUtilization": 94.1
    },
    "historicalTable": [
      {
        "machine": "M101",
        "name": "CNC Router Alpha",
        "avgTemperature": 78,
        "avgPressure": 41,
        "failureCount": 3,
        "lastMaintenance": "2025-05-10"
      }
    ],
    "temperatureTrend": [
      { "time": "06:00 PM", "temperature": 82.1, "pressure": 37.5 }
    ],
    "failureTrend": [
      { "month": "Jan", "failures": 5, "predicted": 3 }
    ],
    "performanceComparison": [
      { "machine": "M101", "efficiency": 88.5, "uptime": 94 }
    ]
  }
  ```

### 5. Predictive Maintenance Risk Probability
* **Method**: `GET`
* **Endpoint**: `/api/predictions`
* **Description**: ML failure probability percentage, severity risk assessments, and recommendations.
* **Response Payload**:
  ```json
  [
    {
      "machine": "M101",
      "name": "CNC Router Alpha",
      "failureProbability": 85, // Number: 0 to 100
      "riskLevel": "High", // Options: "Low", "Medium", "High", "Critical"
      "reason": "High vibration detected + elevated temperature",
      "recommendation": "Schedule maintenance within 24 hours",
      "nextFailure": "2-3 days"
    }
  ]
  ```

### 6. Cloud Cost Optimization Data
* **Method**: `GET`
* **Endpoint**: `/api/costs`
* **Description**: AWS cloud infrastructure cost breakdown and saving logs.
* **Response Payload**:
  ```json
  {
    "totalData": "500 GB",
    "intelligentTier": "300 GB",
    "estimatedSavings": "40%",
    "monthlyCost": 120,
    "storageGrowth": [
      { "month": "Jan", "storage": 280, "cost": 95 }
    ],
    "savingsTrend": [
      { "month": "Jan", "savings": 25 }
    ],
    "costBreakdown": [
      { "name": "S3 Storage", "value": 45 }
    ]
  }
  ```

### 7. Administrative Logs & Service Control
* **Method**: `GET`
* **Endpoint**: `/api/activity`
* **Description**: Admin management data including system user profiles, CloudTrail activity logs, and AWS system service health states.
* **Response Payload**:
  ```json
  {
    "users": [
      { "id": 1, "name": "John Admin", "email": "admin@factory.com", "role": "Admin", "status": "Active", "lastLogin": "2025-06-03 10:45 AM" }
    ],
    "logs": [
      { "id": 1, "user": "Admin", "action": "Started Glue Job", "time": "10:45 AM", "date": "2025-06-03", "type": "system" }
    ],
    "services": [
      { "name": "AWS Lambda", "status": "Operational", "uptime": "99.99%", "lastCheck": "2 min ago" }
    ]
  }
  ```

---

## 🛠️ Step-by-Step API Integration Workflow
Once the backend matches the endpoints above:

1. **Verify Base URL**: Ensure `.env` is created with your backend IP/Port.
2. **Remove Delay Delays**: In `src/services/api.js`, remove the `try-catch` mock fallback inside the API functions so they report actual HTTP exceptions directly to the UI.
3. **Verify Auth Header**: The Axios instance is already preconfigured to auto-attach the JWT token:
   ```javascript
   api.interceptors.request.use((config) => {
     const user = localStorage.getItem('factory_user');
     if (user) {
       const { token } = JSON.parse(user);
       if (token) config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```
