import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, User } from 'lucide-react';
import { getQuestionReport, getFilteredQuestionReports } from '../../../api/reportApi';
import logo from '../../../assets/logo.png';
import './ReportQuestion.css';

const ReportQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { question } = location.state || {};
  const qid = question?.qid;

  const stressMap = {
    0: 'Low',
    1: 'Medium',
    2: 'High',
  };

  const [report, setReport] = useState(null);
  const [filteredReports, setFilteredReports] = useState([]);
  const [gender, setGender] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [semester, setSemester] = useState('');
  const [gptindex, setGptindex] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      if (!qid) { setLoading(false); return; }
      try {
        const data = await getQuestionReport(qid);
        setReport(data);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [qid]);

  const applyFilters = async () => {
    if (!qid) return;
    try {
      setFilterLoading(true);
      const data = await getFilteredQuestionReports(
        qid,
        gender || '',
        cgpa || '',
        semester || '',
        gptindex || ''
      );
      setFilteredReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('FILTER ERROR:', error);
      setFilteredReports([]);
    } finally {
      setFilterLoading(false);
    }
  };

  const statistics = useMemo(() => {
    if (filteredReports.length === 0) {
      return { withGpt: null, withoutGpt: null };
    }

    const withGptReports = filteredReports.filter(r => Number(r.gptindex) === 1);
    const withoutGptReports = filteredReports.filter(r => Number(r.gptindex) === 0);

    const calculateAvg = (reports, field) => {
      if (reports.length === 0) return '0';

      if (field === 'bp') {
        let sys = 0;
        let dia = 0;
        let count = 0;

        reports.forEach(r => {
          if (r.bp && String(r.bp).includes('/')) {
            const parts = String(r.bp).split('/');
            sys += Number(parts[0]) || 0;
            dia += Number(parts[1]) || 0;
            count++;
          }
        });
        if (count === 0) return 'N/A';
        return `${(sys / count).toFixed(0)}/${(dia / count).toFixed(0)}`;
      }

      const sum = reports.reduce((acc, r) => {
        return acc + (parseFloat(r[field]) || 0);
      }, 0);
      return (sum / reports.length).toFixed(2);
    };

    const calculateStressLevel = reports => {
      if (reports.length === 0) return null;
      const stressLevels = {};
      reports.forEach(r => {
        const level = String(r.stressLevel || r.stresslevel);
        stressLevels[level] = (stressLevels[level] || 0) + 1;
      });
      const mostCommon = Object.keys(stressLevels).reduce((a, b) =>
        stressLevels[a] > stressLevels[b] ? a : b
      );
      return stressMap[mostCommon] || 'Unknown';
    };

    return {
      withGpt: withGptReports.length > 0 ? {
        totalAttempts: withGptReports.length,
        avgHeartRate: calculateAvg(withGptReports, 'heartRate'),
        avgBP: calculateAvg(withGptReports, 'bp'),
        stressLevel: calculateStressLevel(withGptReports),
      } : null,
      withoutGpt: withoutGptReports.length > 0 ? {
        totalAttempts: withoutGptReports.length,
        avgHeartRate: calculateAvg(withoutGptReports, 'heartRate'),
        avgBP: calculateAvg(withoutGptReports, 'bp'),
        stressLevel: calculateStressLevel(withoutGptReports),
      } : null,
    };
  }, [filteredReports]);

  if (loading) {
    return (
      <div className="loader">
        <Loader2 className="animate-spin" color="white" size={44} />
        <p>Loading Question Report...</p>
      </div>
    );
  }

  return (
    <div className="page">
      {/* NAV */}
      <div className="nav">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="logo" style={{ height: '35px', filter: 'brightness(0) invert(1)' }} />
            <h2>Question Report</h2>
        </div>
        <span>{report?.total_attempts ?? '0'} Attempts / {report?.duration ?? '0'}:00 min</span>
      </div>

      <div className="container">

        {/* QUESTION CARD */}
        <div className="card" style={{ borderTop: '3px solid var(--ssr-cyan)' }}>
          <h3 style={{ marginBottom: '10px' }}>Question Description</h3>
          <p style={{ fontSize: '15px', color: 'var(--ssr-text-2)', borderBottom: 'none', margin: 0, paddingBottom: 0 }}>
            {report?.description ?? 'No description available.'}
          </p>
        </div>

        {/* FILTERS */}
        <div className="card">
          <h3>Apply Filters</h3>
          <div className="filter-grid">
            <select value={gender} onChange={e => setGender(e.target.value)} className="band-select">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select value={cgpa} onChange={e => setCgpa(e.target.value)} className="band-select">
              <option value="">Select CGPA</option>
              <option value="2.0">2.0+</option>
              <option value="2.5">2.5+</option>
              <option value="3.0">3.0+</option>
              <option value="3.5">3.5+</option>
            </select>
            <select value={semester} onChange={e => setSemester(e.target.value)} className="band-select">
              <option value="">Select Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
            <select value={gptindex} onChange={e => setGptindex(e.target.value)} className="band-select">
              <option value="">GPT Filter</option>
              <option value="1">With ChatGPT</option>
              <option value="0">Without ChatGPT</option>
            </select>
          </div>
          
          <button className="apply-btn" onClick={applyFilters} disabled={filterLoading}>
            {filterLoading ? <Loader2 className="animate-spin" size={18} /> : null}
            {filterLoading ? 'Applying...' : 'Apply Filters'}
          </button>
        </div>

        {/* RESULTS */}
        {filteredReports.length > 0 ? (
          <>
            {/* WITH GPT CARD */}
            {statistics.withGpt && (
              <div className="card summary-section">
                <h3>Overall Average Stress with ChatGPT</h3>
                
                <div className="summary-grid">
                  <div>
                    <p>Student Attempts</p>
                    <h4>{statistics.withGpt.totalAttempts}</h4>
                  </div>
                  <div>
                    <p>Final Stress Level</p>
                    <h4 className="stress">{statistics.withGpt.stressLevel}</h4>
                  </div>
                </div>

                <div className="two-col">
                  <div>
                    <h4>Blood Pressure</h4>
                    <p>Average BP <span>{statistics.withGpt.avgBP}</span></p>
                  </div>
                  <div>
                    <h4>Heart Rate Variability</h4>
                    <p>Average HR <span>{statistics.withGpt.avgHeartRate} bpm</span></p>
                    <p>Average SDNN <span>-</span></p>
                    <p>Average RMSSD <span>-</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* WITHOUT GPT CARD */}
            {statistics.withoutGpt && (
              <div className="card summary-section" style={{ borderTop: '3px solid var(--ssr-blue)' }}>
                <h3>Overall Average Stress without ChatGPT</h3>
                
                <div className="summary-grid">
                  <div>
                    <p>Student Attempts</p>
                    <h4>{statistics.withoutGpt.totalAttempts}</h4>
                  </div>
                  <div>
                    <p>Final Stress Level</p>
                    <h4 className="stress">{statistics.withoutGpt.stressLevel}</h4>
                  </div>
                </div>

                <div className="two-col">
                  <div>
                    <h4>Blood Pressure</h4>
                    <p>Average BP <span>{statistics.withoutGpt.avgBP}</span></p>
                  </div>
                  <div>
                    <h4>Heart Rate Variability</h4>
                    <p>Average HR <span>{statistics.withoutGpt.avgHeartRate} bpm</span></p>
                    <p>Average SDNN <span>-</span></p>
                    <p>Average RMSSD <span>-</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* STUDENT DETAILS */}
            <div className="card">
              <h3>Student Details ({filteredReports.length})</h3>
              
              <div className="student-list">
                {filteredReports.map((item, index) => {
                  const isGpt = Number(item.gptindex) === 1;
                  const sl = stressMap[item.stressLevel] || 'Unknown';
                  const slColor = sl === 'High' ? '#ef4444' : sl === 'Medium' ? '#f59e0b' : '#10b981';
                  
                  return (
                    <div key={index} className="student-card">
                      <div className="student-card-header">
                        <div className="student-name">
                          <User size={16} color="var(--ssr-cyan)" /> {item.student_name}
                        </div>
                        <div className="badge" style={{
                            backgroundColor: isGpt ? '#E3F2FD' : '#F3E5F5',
                            color: isGpt ? '#1976D2' : '#7B1FA2'
                          }}>
                          {isGpt ? 'With ChatGPT' : 'Without ChatGPT'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="info-row"><span>Gender</span> <strong>{item.gender}</strong></div>
                        <div className="info-row"><span>CGPA</span> <strong>{item.cgpa}</strong></div>
                        <div className="info-row"><span>Semester</span> <strong>{item.semester}</strong></div>
                      </div>
                      
                      <div>
                        <h4 className="bio-title">Biometric Data</h4>
                        <div className="info-row"><span>BP</span> <strong>{item.bp}</strong></div>
                        <div className="info-row"><span>HR</span> <strong>{parseFloat(item.heartRate).toFixed(2)} bpm</strong></div>
                        <div className="info-row"><span>SDNN</span> <strong>{parseFloat(item.sdnn).toFixed(2)}</strong></div>
                        <div className="info-row"><span>RMSSD</span> <strong>{parseFloat(item.rmssd).toFixed(2)}</strong></div>
                        <div className="info-row"><span>SI</span> <strong>{parseFloat(item.si).toFixed(2)}</strong></div>
                        <div className="info-row" style={{border: 'none', marginBottom: 0}}>
                          <span>Stress Level</span> <strong style={{color: slColor}}>{sl}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : !filterLoading ? (
          <div className="card">
            <p className="empty-state">Apply filters to view student reports</p>
          </div>
        ) : null}

      </div>
    </div>
  );
};

export default ReportQuestion;
