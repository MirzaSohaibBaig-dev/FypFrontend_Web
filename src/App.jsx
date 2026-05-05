import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Auth Folder Files ---
import WelcomeScreen from './screens/Auth/welcomescreen.jsx';
import LoginScreen from './screens/Auth/loginscreen.jsx';
import SignUpScreen from './screens/Auth/SignUpScreen.jsx';

// --- Admin Folder Files ---
import AdminTab from './screens/Admin/AdminTab.jsx'; 

// --- Student Management Screens (Admin Side) ---
import AddStudent from './screens/Admin/StudentScreen/AddStudent.jsx';
import EditStudent from './screens/Admin/StudentScreen/EditStudent.jsx';
import StudentSession from './screens/Admin/StudentScreen/StudentSession.jsx';
import StudentQuestionReport from './screens/Admin/StudentScreen/StudentQuestionReport.jsx';
import StudentSessionReport from './screens/Admin/StudentScreen/StudentSessionReport.jsx';

// --- Question Management Screens (Admin Side) ---
import AddQuestionScreen from './screens/Admin/QuestionScreen/AddQuestionScreen.jsx';
import EditQuestion from './screens/Admin/QuestionScreen/EditQuestion.jsx';
import ReportQuestion from './screens/Admin/QuestionScreen/ReportQuestion.jsx';

// --- Student Dashboard Screens (Updated with Sidebar Logic) ---

import StudentLayout from './components/StudentLayout.jsx';
import HomeScreen from './screens/Student/HomeScreen.jsx';
import ProfileScreen from './screens/Student/ProfileScreen.jsx';
import ReportScreen from './screens/Student/ReportScreen.jsx';

// --- Session Screens (Coding Flow) ---
import Baselinebp from './screens/Student/Session/Baselinebp.jsx';
import TestScreen from './screens/Student/TestScreen.jsx';
import QuestionAttempt from './screens/Student/Session/QuestionAttempt.jsx';
import Endbp from './screens/Student/Session/Endbp.jsx';
import SelfReport from './screens/Student/Session/SelfReport.jsx';
import Report from './screens/Student/Session/Report.jsx';

function App() {
  return (
    <Routes>
      {/* --- Auth Routes --- */}
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<SignUpScreen />} />

      {/* --- Admin Routes --- */}
      //<Route path="/admin" element={<AdminTab />} />
      <Route path="/admin/add-student" element={<AddStudent />} />
      <Route path="/admin/edit-student" element={<EditStudent />} />
      <Route path="/admin/student-session" element={<StudentSession />} />
      <Route path="/admin/student-question-report" element={<StudentQuestionReport />} />
      <Route path="/admin/student-session-report" element={<StudentSessionReport />} />
      
      <Route path="/admin/add-question" element={<AddQuestionScreen />} />
      <Route path="/admin/edit-question" element={<EditQuestion />} />
      <Route path="/admin/report-question" element={<ReportQuestion />} />

    {/* --- Student Dashboard Routes (Sidebar Integrated via Layout) --- */}
      <Route element={<StudentLayout />}>
        <Route path="/student/home" element={<HomeScreen />} />
        <Route path="/student/profile" element={<ProfileScreen />} />
        <Route path="/student/reports" element={<ReportScreen />} />
      </Route>

      {/* --- Session/Test Routes (Full Screen, No Sidebar) --- */}
      <Route path="/student/test-screen" element={<TestScreen />} />

      <Route path="/student/Session/baseline" element={<Baselinebp />} />
      <Route path="/student/Session/question-attempt" element={<QuestionAttempt />} />
      <Route path="/student/Session/end-bp" element={<Endbp />} /> 
      <Route path="/student/Session/self-report" element={<SelfReport />} />
      <Route path="/student/Session/final-report" element={<Report />} />
     
      {/* --- Fallback --- */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;