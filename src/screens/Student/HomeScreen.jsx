import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import Sidebar from '../../components/Sidebar';
import { getTopSessions } from '../../api/reportApi';
import { getStudentById } from '../../api/studentApi';
import cuffIcon from '../../assets/Cuff Icon.jpg';
import heartIcon from '../../assets/Heart Icon.png';
import hrvIcon from '../../assets/heart.png';
import menuIcon from '../../assets/three-dot-menu.png';
import './HomeScreen.css';

const HomeScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sid } = location.state || {}; 
  const studentId = sid || localStorage.getItem('sid');
  
  const [sessions, setSessions] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      loadData();
    }
  }, [studentId, location.pathname]); // 🔹 location.pathname add kiya taake API hit ho

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading data for studentId:', studentId);
      
      const studentData = await getStudentById(studentId);
      console.log('Student data:', studentData);
      setStudent(studentData);
      
      const sessionData = await getTopSessions(studentId);
      console.log('Session data:', sessionData);
      setSessions(sessionData || []);
    } catch (error) {
      console.error('ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <header className="content-header">
            <h1>Welcome! {student?.name || 'Loading...'}!</h1>
            <p className="semester-tag">Semester {student?.semester || '--'}</p>
        </header>

        <section className="dashboard-card">
          <div className="card-header">
            <h2>Student Dashboard</h2>
           <button className="start-test-btn" onClick={() => navigate('/student/test-screen', { state: { sid: studentId } })}>
               ▶ Start New Test
            </button>
          </div>

          <div className="summary-section">
            <div className="summary-title">
              <h3>Last Test Summary</h3>
              <span className="see-all" onClick={() => navigate('/student/reports', { state: { sid: studentId } })}>see all ›</span>
            </div>

            <div className="sessions-grid">
              {sessions.map((item, index) => (
                <div key={index} className="session-mini-card">
                  <div className="session-top">
                    <span className="date">Date: {item.date || 'N/A'}</span>
                    <img src={menuIcon} alt="more" className="more-icon" onClick={() => navigate('/admin/student-session-report', { state: { sessionId: item.sessionId, studentId: studentId } })} />
                  </div>
                  <div className="metrics-row">
                    <div className="m-box"><img src={cuffIcon} alt="BP" /><span className="m-val">{item.afterQuestionBP || '--'}</span></div>
                    <div className="m-box"><img src={heartIcon} alt="HR" /><span className="m-val">{item.heartRate || '--'}</span></div>
                    <div className="m-box"><img src={hrvIcon} alt="HRV" /><span className="m-val">{item.sdnn || '--'}</span></div>
                  </div>
                  <p className="stress-footer">Stress Level: <strong>{item.stressLevel || 'Unknown'}</strong></p>
                </div>
              ))}
            </div>
          </div>
        </section>
    </>
  );
};

export default HomeScreen;