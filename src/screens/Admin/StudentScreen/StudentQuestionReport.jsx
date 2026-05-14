import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Label
} from 'recharts';
import { ArrowLeft } from 'lucide-react';

import {
  getStudentQuestionReport,
  getEEGDelta, getEEGTheta, getEEGAlpha, getEEGBeta, getEEGGamma,
  getSelfReport,
  getPPGSingle
} from '../../../api/reportApi';

import logo from '../../../assets/logo.png';
import './StudentQuestionReport.css';

// --- Data Helpers ---
const clean = arr => (arr || []).map(v => (isNaN(v) || v === null ? 0 : Number(v)));
const reduce = arr => {
  if (!arr || arr.length === 0) return [];
  const step = Math.ceil(arr.length / 50);
  return arr.filter((_, i) => i % step === 0);
};

// --- Question EEG Chart Component ---
const QuestionEEGChart = ({ data, label, color, bpb, bpm, bpa }) => {
  if (!data || !data.time || !data[label]) return null;

  const time = data.time;
  const values = data[label];

  const minLength = Math.min(time.length, values.length);
  const safeTime = reduce(time.slice(0, minLength));
  const safeData = reduce(clean(values.slice(0, minLength)));

  const chartData = safeTime.map((t, i) => ({
    time: `${Math.round(t)}s`,
    rawTime: t,
    value: safeData[i],
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
        <h4>{label.toUpperCase()}</h4>
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
              <Line type="linear" dataKey="value" stroke={color} dot={false} strokeWidth={2} name={label.toUpperCase()} />
              
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

export default function StudentQuestionReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sid, sessionId, qid } = location.state || {};

  const [question, setQuestion] = useState(null);
  const [eeg, setEeg] = useState({});
  const [ppg, setPpg] = useState(null);
  const [selfReport, setSelfReport] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(true);

  const [selectedPPG, setSelectedPPG] = useState('ALL');

  useEffect(() => {
    if (!sid || !sessionId || !qid) {
      setLoading(false);
      setGraphLoading(false);
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sid, sessionId, qid]);

  const loadData = async () => {
    try {
      const q = await getStudentQuestionReport(sid, qid);
      setQuestion(q);
      setLoading(false);

      const self = await getSelfReport(sessionId).catch(() => null);
      setSelfReport(self);

      const delta = await getEEGDelta(sid, sessionId, qid).catch(() => null);
      const theta = await getEEGTheta(sid, sessionId, qid).catch(() => null);
      const alpha = await getEEGAlpha(sid, sessionId, qid).catch(() => null);
      const beta = await getEEGBeta(sid, sessionId, qid).catch(() => null);
      const gamma = await getEEGGamma(sid, sessionId, qid).catch(() => null);

      setEeg({ delta, theta, alpha, beta, gamma });

      const ppgData = await getPPGSingle(sid, sessionId, qid).catch(() => null);
      setPpg(ppgData);

    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
      setGraphLoading(false);
    }
  };

  if (loading) {
    return <div className="loader">Loading Question Report...</div>;
  }

  if (!sid || !sessionId || !qid) {
    return <div className="loader">Missing question data. Please go back and try again.</div>;
  }

  const bpb = question?.bpb;
  const bpm = question?.bpm;
  const bpa = question?.bpa;

  // Prepare PPG Data
  let mainPpgChartData = [];
  if (ppg && ppg.time && ppg.time.length > 0) {
    const time = ppg.time;
    const hr = ppg.HR || [];
    const sdnn = ppg.SDNN || [];
    const rmssd = ppg.RMSSD || [];
    const pnn50 = ppg.pNN50 || [];
    const minLen = Math.min(time.length, hr.length, sdnn.length, rmssd.length, pnn50.length);

    const safeTime = reduce(time.slice(0, minLen));
    const finalHR = reduce(clean(hr.slice(0, minLen)));
    const finalSDNN = reduce(clean(sdnn.slice(0, minLen)));
    const finalRMSSD = reduce(clean(rmssd.slice(0, minLen)));
    const finalPNN50 = reduce(clean(pnn50.slice(0, minLen)));

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="logo" style={{ height: '35px', filter: 'brightness(0) invert(1)' }} />
            <h2>Question Report</h2>
        </div>
        <span>{question?.time_taken ? `${question.time_taken} sec` : ""}</span>
      </div>

      <div className="container">

        {/* QUESTION CARD */}
        <div className="card" style={{ borderTop: '3px solid var(--ssr-cyan)' }}>
          <h3 style={{ marginBottom: '10px' }}>Question Description</h3>
          <p style={{ fontSize: '15px', color: 'var(--ssr-text-2)', borderBottom: 'none', margin: 0, paddingBottom: 0 }}>
            {question?.description || 'No Question Found'}
          </p>
        </div>

        {/* OVERALL REPORT CARD */}
        <div className="card summary-section">
          <h3>Overall Question Report</h3>

          <div className="summary-grid">
            <div>
              <p>Complete Time</p>
              <h4>{question?.time_taken || '0'} sec</h4>
            </div>
            <div>
              <p>Stress Index</p>
              <h4>{question?.SI !== undefined && question?.SI !== null ? question.SI.toFixed(3) : 'N/A'}</h4>
            </div>
            <div>
              <p>Predicted Stress Level</p>
              <h4 className="stress">
                {question?.stress_level == 0 ? 'Low' : question?.stress_level == 1 ? 'Medium' : question?.stress_level == 2 ? 'High' : 'N/A'}
              </h4>
            </div>
            <div>
              <p>ChatGPT Index</p>
              <h4>{question?.gptindex === 1 ? 'Used' : 'Not Used'}</h4>
            </div>
          </div>

          <div className="two-col">
            <div>
              <h4>Blood Pressure</h4>
              <p>Start (BP) <span>{bpb ?? 'N/A'}</span></p>
              <p>Mid (BP) <span>{bpm ?? 'N/A'}</span></p>
              <p>End (BP) <span>{bpa ?? 'N/A'}</span></p>
            </div>
            <div>
              <h4>Heart Rate Variability (PPG)</h4>
              <p>HR <span>{question?.HR != null ? Math.round(question.HR) + ' bpm' : 'N/A'}</span></p>
              <p>RMSSD <span>{question?.RMSSD != null ? Math.round(question.RMSSD) + ' ms' : 'N/A'}</span></p>
              <p>SDNN <span>{question?.SDNN != null ? Math.round(question.SDNN) + ' ms' : 'N/A'}</span></p>
              <p>pNN50 <span>{question?.pNN50 != null ? Math.round(question.pNN50) + ' %' : 'N/A'}</span></p>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '16px', background: 'var(--ssr-surface-2)', borderRadius: '12px', border: '1px solid var(--ssr-border)' }}>
             <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--ssr-muted)', margin: '0 0 8px 0', borderBottom: 'none' }}>ANSWER PROVIDED</p>
             <p style={{ margin: 0, fontSize: '15px', color: 'var(--ssr-text)', borderBottom: 'none', lineHeight: 1.6 }}>{question?.Answers ?? 'N/A'}</p>
          </div>

          <p className="note">
            Stress is indicated by higher heart rate, lower RMSSD/SDNN, and increased EEG stress index (SI).
          </p>
        </div>

        {/* EEG BANDS */}
        <div className="card chart-card">
          <h3>EEG Individual Bands</h3>

          {graphLoading ? (
            <div className="loader small-loader">Loading EEG Graphs...</div>
          ) : (
            <>
              <QuestionEEGChart data={eeg.delta} label="delta" color="#3b82f6" bpb={bpb} bpm={bpm} bpa={bpa} />
              <QuestionEEGChart data={eeg.theta} label="theta" color="#10b981" bpb={bpb} bpm={bpm} bpa={bpa} />
              <QuestionEEGChart data={eeg.alpha} label="alpha" color="#f59e0b" bpb={bpb} bpm={bpm} bpa={bpa} />
              <QuestionEEGChart data={eeg.beta} label="beta" color="#ef4444" bpb={bpb} bpm={bpm} bpa={bpa} />
              <QuestionEEGChart data={eeg.gamma} label="gamma" color="#8b5cf6" bpb={bpb} bpm={bpm} bpa={bpa} />
            </>
          )}
        </div>

        {/* PPG GRAPH */}
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
            <h3>PPG Separate Graphs</h3>
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

        {/* SELF REPORT */}
        <div className="bottom">
          {selfReport && (
            <div className="card" style={{borderTop: '3px solid #8B5CF6'}}>
              <h3>User Feedback (Self Report)</h3>
              <p style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ssr-border)', margin: 0}}>Mental Load: <b>{selfReport.mentalLoad}</b></p>
              <p style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ssr-border)', margin: 0}}>Frustration: <b>{selfReport.frustration}</b></p>
              <p style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ssr-border)', margin: 0}}>Effort: <b>{selfReport.effort}</b></p>
              <p style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: '10px', borderBottom: 'none', margin: 0}}><b>Comment:</b> {selfReport.comment || 'No comment'}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}