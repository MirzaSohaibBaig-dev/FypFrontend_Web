# 🧠 Multimodal Stress Detection System - Web Application

> **A Research-Grade Full-Stack System for Real-Time Stress Detection using EEG, PPG, Blood Pressure & Self-Report Data**

<div align="center">

[![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-purple?logo=vite)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/CSS-Custom-blue?logo=css3)](https://www.w3.org/Style/CSS/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## 📌 Project Overview

This is the **Web Frontend** component of a comprehensive Multimodal Stress Detection System that combines multiple biosignals and AI/ML to accurately detect and report stress levels in real-time.

### 🎯 Key Objectives

- 🧪 **Multimodal Data Collection**: EEG, PPG, Blood Pressure & NASA-TLX Self-Reports
- 🤖 **AI-Powered Analysis**: Machine Learning model for stress prediction
- 📊 **Real-Time Reporting**: Live stress level detection and visualization
- 👥 **Role-Based Access**: Separate Admin & Student dashboards
- 📡 **API Integration**: Seamless backend communication via REST APIs

---

## 🗂️ Project Structure

```
FypFrontend_Web/
│
├── 📁 public/
│   └── (Static assets)
│
├── 📁 src/
│   ├── 🔌 api/
│   │   └── (API service calls)
│   │
│   ├── 🖼️ screens/
│   │   ├── 🔐 Auth/
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── LoginScreen.jsx
│   │   │   └── SignupScreen.jsx
│   │   │
│   │   ├── 👨‍💼 Admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── QuestionScreen/
│   │   │   │   ├── AddQuestionScreen.jsx
│   │   │   │   ├── AddQuestionScreen.css
│   │   │   │   ├── EditQuestionScreen.jsx
│   │   │   │   └── ViewQuestionsScreen.jsx
│   │   │   ├── ReportsScreen/
│   │   │   └── StudentsScreen/
│   │   │
│   │   ├── 🎓 Student/
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── SessionScreen/
│   │   │   ├── QuestionAttemptScreen.jsx
│   │   │   ├── SelfReportScreen.jsx
│   │   │   └── ResultsScreen.jsx
│   │   │
│   │   └── (Other screens)
│   │
│   ├── 🧩 components/
│   │   └── (Reusable React components)
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── (Other utilities & configs)
│
├── 📄 vite.config.js
├── 📄 package.json
├── 📄 tailwind.config.js
├── 📄 postcss.config.js
└── 📄 README.md
```

---

## 🛠️ Technologies & Tools

### Frontend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.0 | UI Library |
| **Vite** | 7.2.4 | Build Tool & Dev Server |
| **React Router** | 7.13.0 | Client-side Routing |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS Framework |
| **Recharts** | 3.8.1 | Data Visualization |
| **Lucide React** | 0.563.0 | Icon Library |
| **JavaScript (ES6+)** | - | Programming Language |
| **PostCSS** | 8.5.6 | CSS Processing |

### Development Tools
- **ESLint** - Code quality & linting
- **Autoprefixer** - CSS vendor prefixes
- **npm** - Package management

---

## ✨ Core Features

### 🔐 **Authentication Module**
- Welcome landing page
- User login with credentials
- New user registration
- Session management
- Role-based access control (Admin/Student)

### 👨‍💼 **Admin Panel**
- ✅ **Question Management**
  - Add new questions
  - Edit existing questions
  - Delete questions
  - View all questions with difficulty levels

- ✅ **Student Management**
  - View all registered students
  - Monitor student progress
  - Manage user permissions

- ✅ **Reports Dashboard**
  - View session reports
  - Analyze stress trends
  - Export data & statistics

### 🎓 **Student Dashboard**
- ✅ **Session Management**
  - Start new stress detection session
  - Real-time biosignal recording (EEG, PPG, BP)
  - Track session progress

- ✅ **Question Attempt**
  - Solve cognitive tasks during stress test
  - Track response time & accuracy
  - Difficulty levels: Easy, Medium, Hard

- ✅ **Self-Report (NASA-TLX)**
  - Mental demand assessment
  - Physical demand rating
  - Time pressure evaluation
  - Performance self-assessment
  - Effort rating
  - Frustration level

- ✅ **Stress Reports**
  - View detected stress levels
  - Historical session data
  - Graphical trend analysis
  - Stress correlations with tasks

---

## 🧠 Stress Detection System

### Data Input Sources
```
┌─────────────────────────────────────────────────────┐
│  MULTIMODAL BIOSIGNAL DATA                          │
├─────────────────────────────────────────────────────┤
│  • EEG (Electroencephalography)                     │
│    - Delta, Theta, Alpha, Beta, Gamma bands        │
│  • PPG (Photoplethysmography)                       │
│    - Heart Rate (HR)                               │
│    - Heart Rate Variability (HRV)                  │
│  • Blood Pressure (BP)                             │
│    - Systolic & Diastolic changes                  │
│  • Self-Report (NASA-TLX)                          │
│    - Subjective stress perception                  │
└─────────────────────────────────────────────────────┘
                         ↓
              🤖 Machine Learning Model
              (Random Forest Classifier)
                         ↓
        ┌───────────────────────────────┐
        │   STRESS LEVEL OUTPUT         │
        ├───────────────────────────────┤
        │  0 = Low Stress      🟢       │
        │  1 = Medium Stress   🟡       │
        │  2 = High Stress     🔴       │
        └───────────────────────────────┘
```

### Stress Level Classification
| Level | Category | Color |
|-------|----------|-------|
| **0** | Low Stress | 🟢 Green |
| **1** | Medium Stress | 🟡 Yellow |
| **2** | High Stress | 🔴 Red |

---

## 🔄 User Navigation Flow

```
┌──────────────┐
│   WELCOME    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│   LOGIN / SIGNUP     │
└──────┬───────────────┘
       │
       ├─────────────────────────────┬────────────────────────┐
       │                             │                        │
       ▼                             ▼                        ▼
┌──────────────────┐    ┌───────────────────────┐    ┌──────────────┐
│  ADMIN PANEL     │    │  STUDENT DASHBOARD    │    │   ERROR      │
├──────────────────┤    ├───────────────────────┤    │   (Invalid   │
│ • Questions      │    │ • Dashboard Overview  │    │   Creds)     │
│ • Students       │    │ • My Sessions         │    └──────────────┘
│ • Reports        │    │ • Attempt Questions   │
└──────────────────┘    │ • View Reports        │
                        └───────┬───────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │  SESSION START   │
                        │  (Record Baseline│
                        │   Blood Pressure)│
                        └─────────┬────────┘
                                  │
                                  ▼
                        ┌──────────────────────┐
                        │ ATTEMPT QUESTIONS    │
                        │ (Record EEG + PPG)   │
                        └─────────┬────────────┘
                                  │
                                  ▼
                        ┌──────────────────────┐
                        │ RECORD END BP        │
                        │ (Post-Question)      │
                        └─────────┬────────────┘
                                  │
                                  ▼
                        ┌──────────────────────┐
                        │ SELF-REPORT (NASA)   │
                        │ (Mental Demand, etc) │
                        └─────────┬────────────┘
                                  │
                                  ▼
                        ┌──────────────────────┐
                        │ STRESS REPORT        │
                        │ (AI Prediction +     │
                        │  Visual Analytics)   │
                        └──────────────────────┘
```

---

## 🔌 Backend API Integration

### Device Management APIs
```
POST   /start_stream              → Initialize device streaming
POST   /start_recording           → Begin data recording
POST   /stop_recording            → Stop data collection
POST   /after_question_bp         → Record post-question blood pressure
POST   /selfreport                → Submit NASA-TLX data
```

### EEG Analysis APIs
```
GET    /delta                     → Delta band power
GET    /theta                     → Theta band power
GET    /alpha                     → Alpha band power
GET    /beta                      → Beta band power
GET    /gamma                     → Gamma band power
GET    /all                       → All EEG bands combined
```

### ML Prediction API
```
POST   /predict_session/<sid>     → Get stress prediction for session
```

### Student Management APIs
```
GET    /student/getall            → Fetch all students
POST   /student/insert            → Create new student
PUT    /student/update            → Update student details
DELETE /student/delete/<id>       → Remove student
```

### Question Management APIs
```
GET    /question/getall           → Fetch all questions
POST   /question/insert           → Add new question
PUT    /question/update           → Edit question
DELETE /question/delete/<id>      → Delete question
```

### Reports APIs
```
GET    /report/allsession/<sid>          → All sessions for student
GET    /report/sessiontop5/<sid>         → Top 5 high-stress sessions
GET    /report/student_session_report    → Session-level analytics
GET    /report/student_question_report   → Question-level analytics
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **npm** (v10+)
- **Backend Server** running (Flask API)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MirzaSohaibBaig-dev/FypFrontend_Web.git
   cd FypFrontend_Web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure backend URL** (if needed)
   - Update API base URL in `.env` or config files
   - Example: `VITE_API_URL=http://localhost:5000`

4. **Start development server**
   ```bash
   npm run dev
   ```
   - Opens at: `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

---

## 📚 Usage Guide

### For Admins
1. Login with admin credentials
2. Navigate to **Questions** section
3. **Add/Edit/Delete** questions with difficulty levels
4. View **Student Progress** in reports
5. Monitor system health & statistics

### For Students
1. Create account or login
2. Go to **Dashboard**
3. Click **Start New Session**
4. Follow the complete workflow:
   - ✅ Record baseline BP
   - ✅ Answer cognitive questions
   - ✅ Record post-session BP
   - ✅ Complete NASA-TLX self-report
   - ✅ View stress results
5. Review historical reports anytime

---

## 🧪 Testing & Quality

```bash
# Run ESLint for code quality
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix
```

---

## 🎨 Styling & Design

- **Modern SaaS Design** with cyan/blue theme
- **Custom CSS** for reusable components
- **Responsive Design** (Mobile, Tablet, Desktop)
- **Smooth Animations** & Transitions
- **Accessibility** best practices
- **Dark/Light Mode Ready** (if implemented)

### Color Palette
```css
Primary Cyan:    #48D1E4
Primary Blue:    #0891b2
Background:      #f5fbfd
Surface:         #ffffff
Text:            #0f2a33
Accent Muted:    rgba(15, 42, 51, 0.68)
```

---

## 📊 Features Highlights

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✅ Complete | Login/Signup/Logout |
| Admin Dashboard | ✅ Complete | Question & Student Management |
| Student Dashboard | ✅ Complete | Session & Report Management |
| Real-time Biosignal Integration | ✅ Complete | EEG, PPG, BP streaming |
| Stress Prediction | ✅ Complete | ML Model Integration |
| Data Visualization | ✅ Complete | Recharts for analytics |
| Responsive Design | ✅ Complete | Mobile-optimized UI |
| Self-Report (NASA-TLX) | ✅ Complete | 6-scale assessment |
| Session Management | ✅ Complete | Multi-step workflows |

---

## 🔬 Research Contributions

✨ **Novel Approach to Stress Detection:**
- **Multimodal Fusion**: Combines objective (EEG, PPG, BP) + subjective (NASA-TLX) data
- **Real-Time Prediction**: AI-driven stress level detection during active sessions
- **Full-Stack Implementation**: Complete end-to-end system with web interface
- **Scalable Architecture**: Modular design for easy extensions

---

## ⚠️ Known Limitations

- ⚙️ Requires specialized hardware (Muse EEG, Bluetooth BP device)
- 🏢 Works best in controlled environments
- 📡 Depends on stable Bluetooth connectivity
- 🔧 Requires backend server running
- 🌐 Desktop-first design (mobile support TBD)

---

## 🔮 Future Enhancements

- 🚀 **Deep Learning Models**: LSTM/CNN for temporal pattern recognition
- ☁️ **Cloud Deployment**: AWS/Azure integration for scalability
- 📱 **Mobile App**: Native mobile application
- 📈 **Advanced Analytics**: Predictive models & trend forecasting
- 🔔 **Notifications**: Real-time alerts for high-stress levels
- 📧 **Report Export**: PDF/CSV generation
- 🌙 **Dark Mode**: Complete dark theme implementation
- 🗣️ **Multi-language**: i18n support for international users

---

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
VITE_DEBUG_MODE=false
```

---

## 🔐 Security Notes

- ✅ Sanitize all user inputs
- ✅ Use HTTPS in production
- ✅ Implement JWT/Token-based authentication
- ✅ Follow CORS policies
- ✅ Validate all API responses
- ✅ Protect sensitive data (BP, EEG readings)

---

## 🤝 Collaboration & Credits

### Development Team
| Role | Developer |
|------|-----------|
| **Web Application** | Mirza Sohaib Baig |
| **Backend & AI/ML** | Farhan Ayub |

### Advisors & Support
- University Faculty
- Research Supervisors
- Beta Testing Community

---

## 📜 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- 📧 **Email**: mirza.sohaibbaig@gmail.com
- 🐙 **GitHub**: [@MirzaSohaibBaig-dev](https://github.com/MirzaSohaibBaig-dev)
- 📱 **LinkedIn**: [Your LinkedIn Profile]

---

## 🎓 Project Information

> **Final Year Project (FYP)**  
> Multimodal Stress Detection System

- **Institution**: [University Name]
- **Academic Year**: 2025-2026
- **Project Type**: Full-Stack Web Application + AI/ML System
- **Status**: 🟢 Active Development

---

## 📚 References & Documentation

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

---

<div align="center">

### ⭐ If you found this project helpful, please consider giving it a star!

**Made with ❤️ by Mirza Sohaib Baig**

</div>
