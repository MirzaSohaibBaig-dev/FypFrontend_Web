// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, Loader2, Activity, Brain, Heart, Zap } from 'lucide-react';
// import { getQuestionReport } from '../../../api/reportApi'; // Farhan's exact API
// import logoImage from '../../../assets/logo.png';
// import './ReportQuestion.css';

// const ReportQuestion = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Farhan's logic: navigation state se question object aur qid nikalna
//   const { question } = location.state || {};
//   const qid = question?.qid;

//   const stressMap = { 0: "Low", 1: "Medium", 2: "High" };

//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch report on component mount
//   useEffect(() => {
//     const fetchReportData = async () => {
//       if (!qid) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const data = await getQuestionReport(qid);
//         setReport(data);
//       } catch (error) {
//         console.error('Error fetching report:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReportData();
//   }, [qid]);

//   if (loading) {
//     return (
//       <div className="report-screen-container loading-state">
//         <Loader2 className="animate-spin" color="white" size={50} />
//         <p>Loading Report Data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="report-screen-container">
//       {/* Fixed Header with Top-Right Logo */}
//       <header className="report-header">
//         <button className="report-back-btn" onClick={() => navigate(-1)}>
//           <ArrowLeft size={18} /> Back
//         </button>
//         <img src={logoImage} alt="CodeMide" className="report-web-logo" />
//       </header>

//       <main className="report-content">
//         <h2 className="report-title">Question Report</h2>
        
//         <div className="report-summary-text">
//           <p>Total Student Attempts - {report?.total_attempts ?? 'No data'}</p>
//           <p>{report?.duration ? `${report.duration}:00 minutes` : 'No data'}</p>
//         </div>

//         <div className="report-grid-layout">
//           {/* Question Statement Section */}
//           <div className="report-white-card full-width">
//             <h3 className="card-heading"><Brain size={18} /> Question Statement</h3>
//             <p className="card-body-text">{report?.description ?? 'No description'}</p>
//           </div>

//           <div className="comparison-flex">
//             {/* WITH GPT SECTION */}
//             <div className="report-white-card highlight-cyan">
//               <h3 className="section-title">Overall Average Stress with ChatGPT</h3>
//               <p className="attempt-count">Student Attempts - {report?.with_gpt?.total_attempts ?? 'No data'}</p>
              
//               <div className="stress-result">
//                 Final Stress Level: <strong>{stressMap[report?.with_gpt?.most_common_stress_level ?? '0'] ?? 'No data'}</strong>
//               </div>

//               <div className="stats-grid">
//                 <div className="stat-box">
//                   <Heart size={14} />
//                   <div className="stat-text">
//                     <div className="stat-label">BP</div>
//                     <div className="stat-value">{report?.with_gpt?.avg_bp || 'No data'}</div>
//                   </div>
//                 </div>
//                 <div className="stat-box">
//                   <Activity size={14} />
//                   <div className="stat-text">
//                     <div className="stat-label">HR</div>
//                     <div className="stat-value">{report?.with_gpt?.avg_hr ?? 'No data'} BPM</div>
//                   </div>
//                 </div>
//                 <div className="stat-box">
//                   <Zap size={14} />
//                   <div className="stat-text">
//                     <div className="stat-label">SDNN</div>
//                     <div className="stat-value">{report?.with_gpt?.avg_sdnn ?? 'No data'} ms</div>
//                   </div>
//                 </div>
//                 <div className="stat-box">
//                   <Zap size={14} />
//                   <div className="stat-text">
//                     <div className="stat-label">RMSSD</div>
//                     <div className="stat-value">{report?.with_gpt?.avg_rmssd ?? 'No data'} ms</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* WITHOUT GPT SECTION */}
//             <div className="report-white-card highlight-dark">
//               <h3 className="section-title">Overall Average Stress without ChatGPT</h3>
//               <p className="attempt-count">Student Attempts - {report?.without_gpt?.total_attempts ?? 'No data'}</p>
              
//               <div className="stress-result">
//                 Final Stress Level: <strong>{stressMap[report?.without_gpt?.most_common_stress_level ?? '0'] ?? 'No data'}</strong>
//               </div>

//               <div className="stats-grid">
//                 <div className="stat-box">
//                   <Heart size={14} />
//                   <div className="stat-text">
//                     <div className="stat-label">BP</div>
//                     <div className="stat-value">{report?.without_gpt?.avg_bp || 'No data'}</div>
//                   </div>
//                 </div>
//                 <div className="stat-box">
//                   <Activity size={14} />
//                   <div className="stat-text">
//                     <div className="stat-label">HR</div>
//                     <div className="stat-value">{report?.without_gpt?.avg_hr ?? 'No data'} BPM</div>
//                   </div>
//                 </div>
//                 <div className="stat-box">
//                   <Zap size={14} />
//                   <div className="stat-text">
//                     <div className="stat-label">SDNN</div>
//                     <div className="stat-value">{report?.without_gpt?.avg_sdnn ?? 'No data'} ms</div>
//                   </div>
//                 </div>
//                 <div className="stat-box">
//                   <Zap size={14} />
//                   <div className="stat-text">
//                     <div className="stat-label">RMSSD</div>
//                     <div className="stat-value">{report?.without_gpt?.avg_rmssd ?? 'No data'} ms</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ReportQuestion;


import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Activity, Brain, Heart, Zap } from 'lucide-react';
import { getQuestionReport } from '../../../api/reportApi';
import logoImage from '../../../assets/logo.png';
import './ReportQuestion.css';

const ReportQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { question } = location.state || {};
  const qid = question?.qid;

  const stressMap = { 0: 'Low', 1: 'Medium', 2: 'High' };

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
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
    fetchReportData();
  }, [qid]);

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="rq-page loading-state">
        <Loader2 className="animate-spin" color="white" size={44} />
        <p>Loading Report Data...</p>
      </div>
    );
  }

  /* ── STRESS BADGE colour helper ── */
  const stressLevel = (val) => {
    const map = { Low: 'stress-low', Medium: 'stress-med', High: 'stress-high' };
    return map[val] || '';
  };

  const withStress  = stressMap[report?.with_gpt?.most_common_stress_level] ?? 'No data';
  const withoutStress = stressMap[report?.without_gpt?.most_common_stress_level] ?? 'No data';

  return (
    <div className="rq-page">

      {/* ── HEADER ── */}
      <header className="rq-header">
        <button className="rq-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} />
          Back
        </button>
        <img src={logoImage} alt="CodeMide" className="rq-logo" />
      </header>

      {/* ── MAIN ── */}
      <main className="rq-main">

        {/* Page title */}
        <div className="rq-page-head">
          <h1 className="rq-title">Question Report</h1>
          <div className="rq-meta-row">
            <span className="rq-meta-pill">
              Total Attempts&nbsp;&nbsp;<strong>{report?.total_attempts ?? '—'}</strong>
            </span>
            <span className="rq-meta-pill">
              Duration&nbsp;&nbsp;<strong>{report?.duration ? `${report.duration}:00 min` : '—'}</strong>
            </span>
          </div>
        </div>

        <div className="rq-grid">

          {/* Question Statement */}
          <div className="rq-card rq-card--statement">
            <div className="rq-card-label">
              <Brain size={16} />
              Question Statement
            </div>
            <p className="rq-card-body">{report?.description ?? 'No description available.'}</p>
          </div>

          {/* Comparison row */}
          <div className="rq-compare-row">

            {/* WITH GPT */}
            <div className="rq-card rq-card--with">
              <div className="rq-card-tag rq-card-tag--cyan">With ChatGPT</div>
              <h3 className="rq-card-title">Overall Average Stress</h3>

              <div className="rq-attempts-badge">
                {report?.with_gpt?.total_attempts ?? 0} Student Attempts
              </div>

              <div className={`rq-stress-box ${stressLevel(withStress)}`}>
                <span className="rq-stress-dot" />
                Final Stress Level: <strong>{withStress}</strong>
              </div>

              <div className="rq-stats">
                <StatBox icon={<Heart size={13} />} label="BP"    value={report?.with_gpt?.avg_bp    || '—'} />
                <StatBox icon={<Activity size={13} />} label="HR" value={report?.with_gpt?.avg_hr != null ? `${report.with_gpt.avg_hr} BPM` : '—'} />
                <StatBox icon={<Zap size={13} />}  label="SDNN"   value={report?.with_gpt?.avg_sdnn  != null ? `${report.with_gpt.avg_sdnn} ms`  : '—'} />
                <StatBox icon={<Zap size={13} />}  label="RMSSD"  value={report?.with_gpt?.avg_rmssd != null ? `${report.with_gpt.avg_rmssd} ms` : '—'} />
              </div>
            </div>

            {/* WITHOUT GPT */}
            <div className="rq-card rq-card--without">
              <div className="rq-card-tag rq-card-tag--blue">Without ChatGPT</div>
              <h3 className="rq-card-title">Overall Average Stress</h3>

              <div className="rq-attempts-badge">
                {report?.without_gpt?.total_attempts ?? 0} Student Attempts
              </div>

              <div className={`rq-stress-box ${stressLevel(withoutStress)}`}>
                <span className="rq-stress-dot" />
                Final Stress Level: <strong>{withoutStress}</strong>
              </div>

              <div className="rq-stats">
                <StatBox icon={<Heart size={13} />}   label="BP"    value={report?.without_gpt?.avg_bp    || '—'} />
                <StatBox icon={<Activity size={13} />} label="HR"   value={report?.without_gpt?.avg_hr    != null ? `${report.without_gpt.avg_hr} BPM`   : '—'} />
                <StatBox icon={<Zap size={13} />}      label="SDNN"  value={report?.without_gpt?.avg_sdnn  != null ? `${report.without_gpt.avg_sdnn} ms`   : '—'} />
                <StatBox icon={<Zap size={13} />}      label="RMSSD" value={report?.without_gpt?.avg_rmssd != null ? `${report.without_gpt.avg_rmssd} ms`  : '—'} />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

/* ── tiny reusable stat tile ── */
const StatBox = ({ icon, label, value }) => {
  const metricClass = {
    'BP':    'rq-stat--bp',
    'HR':    'rq-stat--hr',
    'SDNN':  'rq-stat--sdnn',
    'RMSSD': 'rq-stat--rmssd',
  }[label] || '';

  return (
    <div className={`rq-stat ${metricClass}`}>
      <div className="rq-stat-icon">{icon}</div>
      <div className="rq-stat-body">
        <span className="rq-stat-label">{label}</span>
        <span className="rq-stat-value">{value}</span>
      </div>
    </div>
  );
};


export default ReportQuestion;

