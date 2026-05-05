import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Activity, Heart, Zap, Calendar, ChevronRight } from 'lucide-react';
import { getAllSessions } from '../../../api/reportApi';
import logoImage from '../../../assets/logo.png';
import './StudentSession.css';

const stressLabel = (level) => {
  const n = Number(level);
  if (n <= 1) return { text: 'Low', cls: 'stress-low' };
  if (n === 2) return { text: 'Moderate', cls: 'stress-moderate' };
  if (n >= 3) return { text: 'High', cls: 'stress-high' };
  return { text: level || 'Unknown', cls: 'stress-unknown' };
};

const StudentSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state || {};
  const studentId = student?.sid;

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) fetchSessions();
    else setLoading(false);
  }, [studentId]);

  const fetchSessions = async () => {
    try {
      const data = await getAllSessions(studentId);
      setSessions(data || []);
    } catch (error) {
      console.log('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ss-loader">
        <Loader2 className="ss-spinner" size={36} />
        <p>Loading sessions…</p>
      </div>
    );
  }

  return (
    <div className="ss-root">
      {/* ── Header ── */}
      <header className="ss-header">
        <button className="ss-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back
        </button>
        <img src={logoImage} alt="CodeMide" className="ss-logo" />
      </header>

      {/* ── Page Title ── */}
      <div className="ss-page-title">
        <h1>Session History</h1>
        <p className="ss-student-name">{student?.name || 'Student'}</p>
      </div>

      {/* ── Content ── */}
      <main className="ss-main">
        {sessions.length === 0 ? (
          <div className="ss-empty">
            <Activity size={48} strokeWidth={1.2} />
            <p>No session history found for this student.</p>
          </div>
        ) : (
          <div className="ss-list">
            {sessions.map((item) => {
              const stress = stressLabel(item.stressLevel || item.stresslevel);
              return (
                <div
                  key={item.sessionId || item.sessionid}
                  className="ss-card"
                >
                  {/* Card Header */}
                  <div className="ss-card-header">
                    <div className="ss-date">
                      <Calendar size={14} />
                      {item.date ?? 'No Date'}
                    </div>
                    <button
                      className="ss-view-btn"
                      onClick={() =>
                        navigate('/admin/student-session-report', {
                          state: {
                            sessionId: item.sessionId || item.sessionid,
                            studentId,
                          },
                        })
                      }
                    >
                      View Report
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Metrics Row */}
                  <div className="ss-metrics">
                    <div className="ss-metric">
                      <div className="ss-metric-icon bp">
                        <Activity size={18} />
                      </div>
                      <span className="ss-metric-label">Blood Pressure</span>
                      <span className="ss-metric-value">
                        {item.afterQuestionBP || item.afterquestionbp || '—'}
                      </span>
                      <span className="ss-metric-unit">mmHg</span>
                    </div>

                    <div className="ss-metric-divider" />

                    <div className="ss-metric">
                      <div className="ss-metric-icon hr">
                        <Heart size={18} />
                      </div>
                      <span className="ss-metric-label">Heart Rate</span>
                      <span className="ss-metric-value">
                        {item.heartRate || item.heartrate || '—'}
                      </span>
                      <span className="ss-metric-unit">bpm</span>
                    </div>

                    <div className="ss-metric-divider" />

                    <div className="ss-metric">
                      <div className="ss-metric-icon hrv">
                        <Zap size={18} />
                      </div>
                      <span className="ss-metric-label">HRV</span>
                      <span className="ss-metric-value">
                        {item.sdnn || '—'}
                      </span>
                      <span className="ss-metric-unit">ms</span>
                    </div>
                  </div>

                  {/* Stress Footer */}
                  <div className="ss-card-footer">
                    <span className="ss-stress-label">Overall Stress Level</span>
                    <span className={`ss-stress-badge ${stress.cls}`}>
                      {stress.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentSession;
