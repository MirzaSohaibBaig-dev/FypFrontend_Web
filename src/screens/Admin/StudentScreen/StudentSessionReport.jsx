import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Label
} from 'recharts';
import { ArrowLeft } from 'lucide-react';

import {
  getStudentSessionReport,
  getEEGData,
  getSelfReport,
  getPPGAll,
  getCombinedQuestionReport
} from '../../../api/reportApi';

import './StudentSessionReport.css';

// --- Data Helpers ---
const clean = arr => (arr || []).map(v => (isNaN(v) || v === null ? 0 : Number(v)));
const reduce = arr => {
  if (!arr || arr.length === 0) return [];
  const step = Math.ceil(arr.length / 50);
  return arr.filter((_, i) => i % step === 0);
};

// --- Question Wise Chart Component ---
const QuestionEEGChart = ({ data, bpb, bpm, bpa, selectedBand, onBandChange, index }) => {
  const time = data.time || [];
  const rawAlpha = data.alpha || [];
  const rawBeta = data.beta || [];
  const rawGamma = data.gamma || [];
  const rawTheta = data.theta || [];
  const rawDelta = data.delta || [];

  const minLength = Math.min(
    time.length, rawAlpha.length, rawBeta.length, rawGamma.length, rawTheta.length, rawDelta.length
  );

  const safeTime = reduce(time.slice(0, minLength));
  const alpha = reduce(clean(rawAlpha.slice(0, minLength)));
  const beta = reduce(clean(rawBeta.slice(0, minLength)));
  const gamma = reduce(clean(rawGamma.slice(0, minLength)));
  const theta = reduce(clean(rawTheta.slice(0, minLength)));
  const delta = reduce(clean(rawDelta.slice(0, minLength)));

  const chartData = safeTime.map((t, i) => ({
    time: `${Math.round(t)}s`,
    rawTime: t,
    alpha: alpha[i],
    beta: beta[i],
    gamma: gamma[i],
    theta: theta[i],
    delta: delta[i],
  }));

  const startIdx = 0;
  const endIdx = chartData.length > 0 ? chartData.length - 1 : 0;
  const maxRawTime = chartData.length > 0 ? chartData[endIdx].rawTime : 0;

  const midMarkers = [];
  if (maxRawTime >= 300) {
    const numMarkers = Math.floor(maxRawTime / 300);
    for (let i = 1; i <= numMarkers; i++) {
      const targetTime = i * 300;
      let closestItem = chartData[0];
      let minDiff = Infinity;
      for (const item of chartData) {
        const diff = Math.abs(item.rawTime - targetTime);
        if (diff < minDiff) {
          minDiff = diff;
          closestItem = item;
        }
      }
      if (closestItem && chartData[endIdx]) {
        if (closestItem.time !== chartData[endIdx].time && closestItem.time !== chartData[startIdx].time) {
          if (!midMarkers.includes(closestItem.time)) {
             midMarkers.push(closestItem.time);
          }
        }
      }
    }
  }

  return (
    <div className="question-chart-container">
      <div className="chart-header">
        <h4>Question {index + 1}</h4>
        <select 
          className="band-select" 
          value={selectedBand} 
          onChange={e => onBandChange(e.target.value)}
        >
          <option value="all">All Bands</option>
          <option value="alpha">Alpha</option>
          <option value="beta">Beta</option>
          <option value="theta">Theta</option>
          <option value="gamma">Gamma</option>
          <option value="delta">Delta</option>
        </select>
      </div>

      {chartData.length > 0 ? (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 25, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(selectedBand === 'all' || selectedBand === 'alpha') && <Line type="linear" dataKey="alpha" stroke="#3CBAC8" dot={false} strokeWidth={2} name="Alpha" />}
              {(selectedBand === 'all' || selectedBand === 'beta') && <Line type="linear" dataKey="beta" stroke="#FF6B6B" dot={false} strokeWidth={2} name="Beta" />}
              {(selectedBand === 'all' || selectedBand === 'theta') && <Line type="linear" dataKey="theta" stroke="#FFD93D" dot={false} strokeWidth={2} name="Theta" />}
              {(selectedBand === 'all' || selectedBand === 'gamma') && <Line type="linear" dataKey="gamma" stroke="#6BCB77" dot={false} strokeWidth={2} name="Gamma" />}
              {(selectedBand === 'all' || selectedBand === 'delta') && <Line type="linear" dataKey="delta" stroke="#4D96FF" dot={false} strokeWidth={2} name="Delta" />}
              
              {chartData[startIdx] && (
                <ReferenceLine x={chartData[startIdx].time} stroke="#378ADD" strokeDasharray="3 3">
                  <Label value={`Start: ${bpb ?? 'N/A'}`} position="insideTopLeft" fill="#378ADD" fontSize={12} fontWeight="bold" />
                </ReferenceLine>
              )}
              {midMarkers.map((markerTime, idx) => (
                <ReferenceLine key={`mid-${idx}`} x={markerTime} stroke="#7F77DD" strokeDasharray="3 3">
                  <Label value={`Mid: ${bpm ?? 'N/A'}`} position="insideTop" fill="#7F77DD" fontSize={12} fontWeight="bold" />
                </ReferenceLine>
              ))}
              {chartData[endIdx] && (
                <ReferenceLine x={chartData[endIdx].time} stroke="#1D9E75" strokeDasharray="3 3">
                  <Label value={`End: ${bpa ?? 'N/A'}`} position="insideTopRight" fill="#1D9E75" fontSize={12} fontWeight="bold" />
                </ReferenceLine>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="no-data">No Graph Data</p>
      )}
    </div>
  );
};

const StudentSessionReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const sessionId = location.state?.sessionId || params.sessionId || location.state?.sid || null;
  const studentId = location.state?.studentId || location.state?.sid || params.studentId || null;

  const [report, setReport] = useState(null);
  const [eeg, setEeg] = useState(null);
  const [ppg, setPpg] = useState(null);
  const [selfReport, setSelfReport] = useState(null);
  const [combinedQuestions, setCombinedQuestions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(true);

  const [selectedBand, setSelectedBand] = useState('all');
  const [selectedPPG, setSelectedPPG] = useState('ALL');
  const [questionBands, setQuestionBands] = useState({});

  useEffect(() => {
    if (!sessionId || !studentId) {
      setLoading(false);
      setGraphLoading(false);
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, studentId]);

  const fetchData = async () => {
    try {
      const res = await getStudentSessionReport(studentId, sessionId);
      setReport(res);
      setLoading(false);

      const [combined, self, eegData, ppgData] = await Promise.all([
        getCombinedQuestionReport(studentId, sessionId).catch(() => ({ questions: [] })),
        getSelfReport(sessionId).catch(() => null),
        getEEGData(studentId, sessionId).catch(() => null),
        getPPGAll(studentId, sessionId).catch(() => null)
      ]);

      setCombinedQuestions(combined?.questions || []);
      setSelfReport(self);
      setEeg(eegData);
      setPpg(ppgData);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
      setGraphLoading(false);
    }
  };

  if (loading) {
    return <div className="loader">Loading Session Data...</div>;
  }

  if (!sessionId || !studentId) {
    return <div className="loader">Missing session data. Please open this page from the previous screen.</div>;
  }

  // Prepare general EEG Chart Data
  let mainEegChartData = [];
  if (eeg && eeg.time && eeg.time.length > 0) {
    const time = eeg.time;
    const alpha = eeg.alpha || [];
    const beta = eeg.beta || [];
    const theta = eeg.theta || [];
    const gamma = eeg.gamma || [];
    const delta = eeg.delta || [];
    const minLength = Math.min(time.length, alpha.length, beta.length, theta.length, gamma.length, delta.length);
    
    const safeTime = reduce(time.slice(0, minLength));
    const finalAlpha = reduce(clean(alpha.slice(0, minLength)));
    const finalBeta = reduce(clean(beta.slice(0, minLength)));
    const finalTheta = reduce(clean(theta.slice(0, minLength)));
    const finalGamma = reduce(clean(gamma.slice(0, minLength)));
    const finalDelta = reduce(clean(delta.slice(0, minLength)));

    mainEegChartData = safeTime.map((t, i) => ({
      time: `${Math.round(t)}s`,
      alpha: finalAlpha[i],
      beta: finalBeta[i],
      theta: finalTheta[i],
      gamma: finalGamma[i],
      delta: finalDelta[i]
    }));
  }

  // Prepare general PPG Chart Data
  let mainPpgChartData = [];
  if (ppg && ppg.time && ppg.time.length > 0) {
    const time = ppg.time;
    const hr = ppg.HR || [];
    const sdnn = ppg.SDNN || [];
    const rmssd = ppg.RMSSD || [];
    const pnn50 = ppg.pNN50 || [];
    const minLength = Math.min(time.length, hr.length, sdnn.length, rmssd.length, pnn50.length);

    const safeTime = reduce(time.slice(0, minLength));
    const finalHR = reduce(clean(hr.slice(0, minLength)));
    const finalSDNN = reduce(clean(sdnn.slice(0, minLength)));
    const finalRMSSD = reduce(clean(rmssd.slice(0, minLength)));
    const finalPNN50 = reduce(clean(pnn50.slice(0, minLength)));

    mainPpgChartData = safeTime.map((t, i) => ({
      time: `${Math.round(t)}s`,
      HR: finalHR[i],
      SDNN: finalSDNN[i],
      RMSSD: finalRMSSD[i],
      pNN50: finalPNN50[i]
    }));
  }

  return (
    <div className="page">
      {/* NAV */}
      <div className="nav">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2>{report?.student_name ? `- ${report.student_name} -` : "- Student -"}</h2>
        <span>{report?.date || ""}</span>
      </div>

      <div className="container">
        {/* SUMMARY */}
        <div className="card summary-section">
          <h3>Overall Session Report</h3>

          <div className="summary-grid">
            <div>
              <p>Date</p>
              <h4>{report?.date || '-'}</h4>
            </div>
            <div>
              <p>Complete Session Time</p>
              <h4>{report?.total_minutes || '-'} mins</h4>
            </div>
            <div>
              <p>Average Stress Index</p>
              <h4>{typeof report?.SI === 'number' ? report.SI.toFixed(3) : '-'}</h4>
            </div>
            <div>
              <p>Predicted Stress Level</p>
              <h4 className="stress">
                {report?.final_stress_level == 0 ? 'Low' : report?.final_stress_level == 1 ? 'Medium' : report?.final_stress_level == 2 ? 'High' : '-'}
              </h4>
            </div>
          </div>

          <div className="two-col">
            <div>
              <h4>Average Blood Pressure</h4>
              <p>Start Question (BP) <span>{report?.average_bpb || '-'}</span></p>
              <p>Middle Question (BP) <span>{report?.average_bpm || '-'}</span></p>
              <p>End Question (BP) <span>{report?.average_bpa || '-'}</span></p>
            </div>
            <div>
              <h4>Average Heart Rate Variability (PPG)</h4>
              <p>HR <span>{report?.HR != null ? Math.round(report.HR) + ' bpm' : '-'}</span></p>
              <p>RMSSD <span>{report?.RMSSD != null ? Math.round(report.RMSSD) + ' ms' : '-'}</span></p>
              <p>SDNN <span>{report?.SDNN != null ? Math.round(report.SDNN) + ' ms' : '-'}</span></p>
              <p>pNN50 <span>{report?.pNN50 != null ? Math.round(report.pNN50) + ' %' : '-'}</span></p>
            </div>
          </div>

          <p className="note">
            Higher heart rate and lower RMSSD/SDNN indicate increased stress, while higher values suggest relaxation.
          </p>
        </div>

        {/* COMBINED QUESTION GRAPHS (EEG) */}
        <div className="card chart-card">
          <div className="chart-header-row">
            <h3>Physiological Signals During Session</h3>
          </div>
          <div className="chart-header-row">
            <h4>Combine Question Graphs</h4>
            <select className="band-select" value={selectedBand} onChange={e => setSelectedBand(e.target.value)}>
              <option value="all">All Bands</option>
              <option value="alpha">Alpha</option>
              <option value="beta">Beta</option>
              <option value="theta">Theta</option>
              <option value="gamma">Gamma</option>
              <option value="delta">Delta</option>
            </select>
          </div>

          {graphLoading ? (
            <div className="loader small-loader">Loading Graphs...</div>
          ) : mainEegChartData.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mainEegChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {(selectedBand === 'all' || selectedBand === 'alpha') && <Line type="linear" dataKey="alpha" stroke="#3CBAC8" dot={false} strokeWidth={2} name="Alpha" />}
                  {(selectedBand === 'all' || selectedBand === 'beta') && <Line type="linear" dataKey="beta" stroke="#FF6B6B" dot={false} strokeWidth={2} name="Beta" />}
                  {(selectedBand === 'all' || selectedBand === 'theta') && <Line type="linear" dataKey="theta" stroke="#FFD93D" dot={false} strokeWidth={2} name="Theta" />}
                  {(selectedBand === 'all' || selectedBand === 'gamma') && <Line type="linear" dataKey="gamma" stroke="#6BCB77" dot={false} strokeWidth={2} name="Gamma" />}
                  {(selectedBand === 'all' || selectedBand === 'delta') && <Line type="linear" dataKey="delta" stroke="#4D96FF" dot={false} strokeWidth={2} name="Delta" />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="no-data">No Graph Data</p>
          )}

          <div className="band-power-summary">
            <p><b>EEG Band Power Summary:</b></p>
            <ul>
              <li>Alpha → Relaxation</li>
              <li>Beta → Focus / Stress</li>
              <li>Theta → Mental Workload</li>
              <li>Delta → Deep Sleep</li>
            </ul>
          </div>
        </div>

        {/* QUESTION WISE GRAPHS WITH BLOOD PRESSURE */}
        <div className="card chart-card">
          <div className="chart-header-row">
            <h3>Question Wise Graphs with Blood Pressure</h3>
          </div>
          {combinedQuestions && combinedQuestions.length > 0 ? combinedQuestions.map((q, idx) => (
             <QuestionEEGChart
               key={idx}
               index={idx}
               data={q.eeg || {}}
               bpb={q.bp?.[0]?.SYS ? `${q.bp[0].SYS}/${q.bp[0].DIA}` : 'N/A'}
               bpm={q.bp?.[1]?.SYS ? `${q.bp[1].SYS}/${q.bp[1].DIA}` : 'N/A'}
               bpa={q.bp?.[2]?.SYS ? `${q.bp[2].SYS}/${q.bp[2].DIA}` : 'N/A'}
               selectedBand={questionBands[idx] || 'all'}
               onBandChange={(val) => setQuestionBands(prev => ({ ...prev, [idx]: val }))}
             />
          )) : (
            <p className="no-data">No Question Wise Data Available</p>
          )}
        </div>

        {/* PPG GRAPH (HEART FEATURES) */}
        <div className="card chart-card">
          <div className="chart-header-row">
            <h3>PPG Graph (Heart Features)</h3>
            <select className="band-select" value={selectedPPG} onChange={e => setSelectedPPG(e.target.value)}>
              <option value="ALL">All Metrics</option>
              <option value="HR">Heart Rate (bpm)</option>
              <option value="SDNN">SDNN (ms)</option>
              <option value="RMSSD">RMSSD (ms)</option>
              <option value="PNN50">pNN50 (%)</option>
            </select>
          </div>

          {mainPpgChartData.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mainPpgChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {(selectedPPG === 'ALL' || selectedPPG === 'HR') && <Line type="linear" dataKey="HR" stroke="#ff0000" dot={false} strokeWidth={2} name="HR" />}
                  {(selectedPPG === 'ALL' || selectedPPG === 'SDNN') && <Line type="linear" dataKey="SDNN" stroke="#00bcd4" dot={false} strokeWidth={2} name="SDNN" />}
                  {(selectedPPG === 'ALL' || selectedPPG === 'RMSSD') && <Line type="linear" dataKey="RMSSD" stroke="#4caf50" dot={false} strokeWidth={2} name="RMSSD" />}
                  {(selectedPPG === 'ALL' || selectedPPG === 'PNN50') && <Line type="linear" dataKey="pNN50" stroke="#9c27b0" dot={false} strokeWidth={2} name="pNN50" />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="no-data">No PPG Graph Data</p>
          )}
        </div>

        {/* PPG GRAPHS SEPARATE */}
        <div className="card chart-card">
          <div className="chart-header-row">
            <h3>PPG Graphs Separate :</h3>
          </div>
          
          {mainPpgChartData.length > 0 ? (
            <div className="separate-graphs">
              <div className="mini-chart">
                <h4 style={{color: '#ff0000'}}>Heart Rate (bpm)</h4>
                <div className="chart-wrapper mini">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mainPpgChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="linear" dataKey="HR" stroke="#ff0000" dot={false} strokeWidth={2} name="HR (bpm)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mini-chart">
                <h4 style={{color: '#00bcd4'}}>SDNN (ms)</h4>
                <div className="chart-wrapper mini">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mainPpgChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="linear" dataKey="SDNN" stroke="#00bcd4" dot={false} strokeWidth={2} name="SDNN (ms)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mini-chart">
                <h4 style={{color: '#4caf50'}}>RMSSD (ms)</h4>
                <div className="chart-wrapper mini">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mainPpgChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="linear" dataKey="RMSSD" stroke="#4caf50" dot={false} strokeWidth={2} name="RMSSD (ms)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mini-chart">
                <h4 style={{color: '#9c27b0'}}>pNN50 (%)</h4>
                <div className="chart-wrapper mini">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mainPpgChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="linear" dataKey="pNN50" stroke="#9c27b0" dot={false} strokeWidth={2} name="pNN50 (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <p className="no-data">No PPG Graph Data</p>
          )}
        </div>

        {/* BOTTOM SECTION */}
        <div className="bottom">
          <div className="card">
            <h3>Reports of Each Question</h3>
            {report?.attempted_questions?.length > 0 ? (
              report.attempted_questions.map((q, i) => (
                <div key={i} className="q-card">
                  <p>{q.description}</p>
                  <button onClick={() => {
                    navigate("/admin/student-question-report", {
                      state: {
                        sid: studentId,
                        studentId: studentId,
                        sessionId: sessionId,
                        qid: q.qid,
                      },
                    });
                  }}>
                    Report
                  </button>
                </div>
              ))
            ) : (
              <p className="no-data">No Data Exist</p>
            )}
          </div>

          {/* Self Report */}
          {selfReport && (
            <div className="card" style={{borderTop: '3px solid #8B5CF6'}}>
              <h3>User Feedback</h3>
              <p style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ssr-border)'}}>Mental Load: <b>{selfReport.mentalLoad}</b></p>
              <p style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ssr-border)'}}>Frustration: <b>{selfReport.frustration}</b></p>
              <p style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ssr-border)'}}>Effort: <b>{selfReport.effort}</b></p>
              <p style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: '10px'}}><b>Comment:</b> {selfReport.comment || 'No comment'}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentSessionReport;