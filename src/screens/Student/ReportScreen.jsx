import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Loader2, ArrowRight } from 'lucide-react';
//import Sidebar from '../../components/Sidebar';
import { getAllSessions } from '../../api/reportApi'; 
import cuffIcon from '../../assets/Cuff Icon.jpg';
import heartIcon from '../../assets/Heart Icon.png';
import hrvIcon from '../../assets/heart.png';
import menuIcon from '../../assets/three-dot-menu.png';
import './ReportScreen.css';

const ReportScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sid } = location.state || {}; 
  const studentId = sid || localStorage.getItem('sid');

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) fetchSessions();
    else setLoading(false);
  }, [studentId]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getAllSessions(studentId);
      setSessions(data || []);
    } catch (error) {
      console.log("Error fetching report sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <header className="content-header">
          <h1 className="report-main-title">Session History</h1>
          <p className="report-subtitle">View all your previous test results and health metrics</p>
        </header>

        <section className="report-container-card">
          {loading ? (
            <div className="report-loader">
              <Loader2 className="animate-spin" size={40} />
              <p>Loading History...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="no-sessions">
              <h3>No Sessions Found</h3>
              <p>You haven't taken any tests yet.</p>
              <button onClick={() => navigate('/student/Session/test-screen')}>
                Start Your First Test
              </button>
            </div>
          ) : (
            <div className="report-sessions-list">
              {sessions.map((item) => (
                <div key={item.sessionId} className="report-session-item">

                  <div className="report-item-header">
                    <div className="date-info">
                      <Calendar size={18} />
                      <span>{item.date ?? 'No Date'}</span>
                    </div>

                    <button 
                      className="report-menu-btn"
                      onClick={() =>
                        navigate('/admin/student-session-report', {
                          state: { sessionId: item.sessionId, studentId: sid }
                        })
                      }
                    >
                      <img src={menuIcon} alt="menu" className="menu-icon" />
                    </button>
                  </div>

                  <div className="report-metrics-grid">

                    <div className="report-metric">
                      <img src={cuffIcon} alt="BP" className="metric-icon" />
                      <div className="metric-details">
                        <span className="m-label">Blood Pressure</span>
                        <span className="m-value">{item.afterQuestionBP ?? '--'}</span>
                      </div>
                    </div>

                    <div className="report-metric">
                      <img src={heartIcon} alt="HR" className="metric-icon" />
                      <div className="metric-details">
                        <span className="m-label">Heart Rate</span>
                        <span className="m-value">{item.heartRate ?? '--'} bpm</span>
                      </div>
                    </div>

                    <div className="report-metric">
                      <img src={hrvIcon} alt="HRV" className="metric-icon" />
                      <div className="metric-details">
                        <span className="m-label">HRV</span>
                        <span className="m-value">{item.sdnn ?? '--'} ms</span>
                      </div>
                    </div>

                  </div>

                  <div className="report-item-footer">
                    <span>
                      Overall Stress Level:
                      <strong>{item.stressLevel ?? 'Unknown'}</strong>
                    </span>

                    <button className="view-details-link">
                      Details <ArrowRight size={14} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
   
    </>
  );
};

export default ReportScreen;