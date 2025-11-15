# 🌾 FarmView

A calm and intuitive platform for tracking agricultural market data with farmer and admin dashboards, community forum, and weather integration.

## 📌 Project Origin

This project was inspired by a task given during the **TechFest at COMSATS Islamabad** in the **first week of November**. While I didn't participate in the techfest, I found the idea quite interesting and decided to implement it on my own.

**Built solo in approximately 2 hours** - A full-stack application with modern UI, authentication, role-based access, multilingual support, and real-time market data tracking.

![FarmView Dashboard](./farmer_dashboard.png)
*Modern, clean interface for agricultural market tracking*

## 📸 Screenshots

### Login Page
![Login Page](./login_page.png)
*Beautiful gradient login interface with language selection*

### Register Page
![Register Page](./register_page.png)
*Simple and intuitive registration form*

### Language Selection
![Language Selection](./language_select_popup.png)
*Choose between English and Urdu languages*

### Farmer Dashboard
![Farmer Dashboard](./farmer_dashboard.png)
*Comprehensive dashboard with market data, weather, and price trends*

### Admin Dashboard
![Admin Dashboard](./admin_dashboard_in_urdu.png)
*Admin panel for managing market data and agricultural products (shown in Urdu)*

### Community Forum
![Forum](./forum.png)
*Interactive forum for farmers to share knowledge and experiences*

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/farmview
JWT_SECRET=your-secret-key-here
PORT=5000
WEATHER_API_KEY=your-openweather-api-key (optional)
```

**Note:** If you don't have MongoDB installed locally, you can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available) and set `MONGO_URI` to your connection string.

### 3. Start MongoDB

If using local MongoDB:
```bash
# Windows (if MongoDB is installed as a service, it should start automatically)
# Or start manually:
mongod

# Mac/Linux
sudo systemctl start mongod
# or
mongod
```

### 4. Run the Application

#### Terminal 1 - Backend Server
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend Server
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and open automatically in your browser.

## Usage

1. **Register a new account:**
   - Go to `http://localhost:3000/register`
   - Choose role: `farmer` or `admin`
   - Create your account

2. **Login:**
   - Go to `http://localhost:3000`
   - Enter your credentials
   - Select your preferred language (English/Urdu)

3. **Admin Features:**
   - Add, view, and delete market data
   - Manage agricultural product prices by region

4. **Farmer Features:**
   - View market data and price trends
   - Check weather information
   - Access farming advice
   - Participate in community forum

## 🏗️ Project Structure

```
farmview/
├── backend/
│   ├── app.js              # Express server setup
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── middleware/         # Auth middleware
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── locales/        # Translation files
│   │   └── App.js          # Main app component
│   └── public/
└── README.md
```

## 🎨 Features

- ✅ **Dual Language Support** - English and Urdu
- ✅ **Role-Based Access** - Separate dashboards for farmers and admins
- ✅ **Market Data Tracking** - Real-time price monitoring by region
- ✅ **Price Trends Visualization** - Interactive charts with Chart.js
- ✅ **Weather Integration** - Current weather data for better planning
- ✅ **Community Forum** - Share knowledge and experiences
- ✅ **Modern UI** - Clean, responsive design with smooth animations

## 🛠️ Technologies Used

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend:** React, React Router, Chart.js, i18next
- **Styling:** CSS with CSS Variables


## 📄 License

This project is open source and available for educational purposes.
