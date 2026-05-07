import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Activity, ArrowLeft, TrendingUp, CheckCircle2 } from 'lucide-react';

// API Imports
import { 
    getStudentSessionReport, 
    getEEGData, 
    getPPGAll 
} from '../../../api/reportApi';
import logoImage from '../../../assets/CodeMide.png';

import './Report.css';

export default function Report() {
    const navigate = useNavigate();
    const location = useLocation();
    const { sessionId, studentId } = location.state || {};

    const [report, setReport] = useState(null);
    const [eeg, setEeg] = useState(null);
    const [ppg, setPpg] = useState(null);

    const [loading, setLoading] = useState(true); // main data
    const [graphLoading, setGraphLoading] = useState(true); // graph

    useEffect(() => {
        if (!sessionId || !studentId) {
            navigate('/student/home');
            return;
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, studentId]);

    const fetchData = async () => {
        try {
            // ✅ STEP 1: FAST LOAD
            const res = await getStudentSessionReport(studentId, sessionId);
            setReport(res);
            setLoading(false); // screen show

            // ✅ STEP 2: GRAPH LOAD (slow)
            const [eegData, ppgData] = await Promise.all([
                getEEGData(studentId, sessionId),
                getPPGAll(studentId, sessionId)
            ]);
            setEeg(eegData);
            setPpg(ppgData);
        } catch (error) {
            console.log('ERROR:', error);
        } finally {
            setGraphLoading(false);
        }
    };

    // ======================================
    // DATA REDUCTION LOGIC (From Farhan's Native Code)
    // ======================================
    const clean = arr => arr?.map(v => (isNaN(v) || v === null ? 0 : Number(v))) || [];

    // EEG Data
    let eegChartData = [];
    if (eeg && eeg.alpha && eeg.alpha.length > 0) {
        const time = eeg.time || [];
        const alpha = eeg.alpha || [];
        const beta = eeg.beta || [];
        const theta = eeg.theta || [];
        const gamma = eeg.gamma || [];
        const delta = eeg.delta || [];

        const minLength = Math.min(time.length, alpha.length, beta.length, theta.length, gamma.length, delta.length);
        
        const safeTime = time.slice(0, minLength);
        const safeAlpha = clean(alpha.slice(0, minLength));
        const safeBeta = clean(beta.slice(0, minLength));
        const safeTheta = clean(theta.slice(0, minLength));
        const safeGamma = clean(gamma.slice(0, minLength));
        const safeDelta = clean(delta.slice(0, minLength));

        const reduce = (arr, step = 5) => arr.filter((_, i) => i % step === 0);
        
        const finalTime = reduce(safeTime);
        const finalAlpha = reduce(safeAlpha);
        const finalBeta = reduce(safeBeta);
        const finalTheta = reduce(safeTheta);
        const finalGamma = reduce(safeGamma);
        const finalDelta = reduce(safeDelta);

        eegChartData = finalTime.map((t, i) => ({
            time: `${Math.round(t)}s`,
            Alpha: finalAlpha[i],
            Beta: finalBeta[i],
            Theta: finalTheta[i],
            Gamma: finalGamma[i],
            Delta: finalDelta[i]
        }));
    }

    // PPG Data
    let ppgChartData = [];
    if (ppg && ppg.HR && ppg.HR.length > 0) {
        const time = ppg.time || [];
        const hr = ppg.HR || [];
        const sdnn = ppg.SDNN || [];
        const rmssd = ppg.RMSSD || [];
        const pnn50 = ppg.pNN50 || [];

        const minLength = Math.min(time.length, hr.length, sdnn.length, rmssd.length, pnn50.length);

        const safeTime = time.slice(0, minLength);
        const safeHR = clean(hr.slice(0, minLength));
        const safeSDNN = clean(sdnn.slice(0, minLength));
        const safeRMSSD = clean(rmssd.slice(0, minLength));
        const safePNN50 = clean(pnn50.slice(0, minLength));

        const reduce = (arr) => {
            const step = Math.ceil(arr.length / 50);
            return arr.filter((_, i) => i % step === 0);
        };

        const finalTime = reduce(safeTime);
        const finalHR = reduce(safeHR);
        const finalSDNN = reduce(safeSDNN);
        const finalRMSSD = reduce(safeRMSSD);
        const finalPNN50 = reduce(safePNN50);

        ppgChartData = finalTime.map((t, i) => ({
            time: `${Math.round(t)}s`,
            HR: finalHR[i],
            SDNN: finalSDNN[i],
            RMSSD: finalRMSSD[i],
            pNN50: finalPNN50[i]
        }));
    }

    // ✅ MAIN LOADING
    if (loading) {
        return (
            <div className="loader-box" style={{ height: '100vh', background: '#f8fafc' }}>
                <Activity className="spin" size={40} />
            </div>
        );
    }

    const getStressLevelLabel = (level) => {
        if (level === 0) return 'Low';
        if (level === 1) return 'Medium';
        if (level === 2) return 'High';
        return 'N/A';
    };

    return (
        <div className="report-container">
            {/* STUNNING HEADER */}
            <header className="report-header">
                <button 
                    onClick={() => navigate('/student/home', { state: { sid: studentId } })} 
                    className="btn-back"
                >
                    <ArrowLeft size={18} /> Back
                </button>
                <div className="header-brand">
                    <div className="brand-text">
                        <h1>Session Report</h1>
                        <p>Participant: <span>{report?.student_name || 'Student'}</span></p>
                    </div>
                    <img src={logoImage} alt="Logo" className="brand-logo" />
                </div>
            </header>

            <div className="report-content-wrapper">
                {/* 📊 OVERALL SESSION STATS */}
                <section className="dashboard-section">
                    <div className="section-title">
                        <Activity className="title-icon" size={28} />
                        <h2>Overall Session Report</h2>
                    </div>
                    
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-label">Complete Time</span>
                            <span className="stat-value">{report?.total_minutes || '0'} <small>min</small></span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Stress Index</span>
                            <span className="stat-value">
                                {report?.SI !== undefined && report?.SI !== null ? report.SI.toFixed(3) : 'N/A'}
                            </span>
                        </div>
                        <div className="stat-card highlight-card">
                            <span className="stat-label">Predicted Stress Level</span>
                            <span className="stat-value level-text">{getStressLevelLabel(report?.final_stress_level)}</span>
                        </div>
                    </div>

                    <div className="metrics-split">
                        <div className="metric-box bp-box">
                            <h3>Blood Pressure Tracking</h3>
                            <ul>
                                <li><span>Start Question:</span> <strong>{report?.average_bpb ?? 'N/A'}</strong></li>
                                <li><span>Mid Question:</span> <strong>{report?.average_bpm ?? 'N/A'}</strong></li>
                                <li><span>End Question:</span> <strong>{report?.average_bpa ?? 'N/A'}</strong></li>
                            </ul>
                        </div>
                        <div className="metric-box hrv-box">
                            <h3>Heart Rate Variability (PPG)</h3>
                            <ul>
                                <li><span>Heart Rate:</span> <strong>{report?.HR != null ? Math.round(report.HR) + ' bpm' : 'N/A'}</strong></li>
                                <li><span>RMSSD:</span> <strong>{report?.RMSSD != null ? Math.round(report.RMSSD) + ' ms' : 'N/A'}</strong></li>
                                <li><span>SDNN:</span> <strong>{report?.SDNN != null ? Math.round(report.SDNN) + ' ms' : 'N/A'}</strong></li>
                                <li><span>pNN50:</span> <strong>{report?.pNN50 != null ? Math.round(report.pNN50) + ' %' : 'N/A'}</strong></li>
                            </ul>
                        </div>
                    </div>

                    <div className="info-alert">
                        <p><strong>Note:</strong> Stress is indicated by higher heart rate, lower RMSSD/SDNN, and increased EEG stress index (SI).</p>
                    </div>
                </section>

                {/* 🧠 PHYSIOLOGICAL SIGNALS */}
                <section className="dashboard-section">
                    <div className="section-title">
                        <TrendingUp className="title-icon" size={28} />
                        <h2>Physiological Signals During Session</h2>
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Brain Signals (EEG)</h3>
                            {graphLoading ? (
                                <div className="loader-box"><Activity className="spin" size={30} /></div>
                            ) : eegChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={eegChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="time" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                        <Line type="monotone" dataKey="Alpha" stroke="#3CBAC8" strokeWidth={2.5} dot={false} />
                                        <Line type="monotone" dataKey="Beta" stroke="#FF6B6B" strokeWidth={2.5} dot={false} />
                                        <Line type="monotone" dataKey="Theta" stroke="#FFD93D" strokeWidth={2.5} dot={false} />
                                        <Line type="monotone" dataKey="Gamma" stroke="#6BCB77" strokeWidth={2.5} dot={false} />
                                        <Line type="monotone" dataKey="Delta" stroke="#4D96FF" strokeWidth={2.5} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="no-data-box">No EEG Graph Data</div>
                            )}
                            <div className="chart-footer">
                                <p><strong>EEG Band Power Summary:</strong></p>
                                <div className="band-tags">
                                    <span className="tag alpha">Alpha → Relaxation</span>
                                    <span className="tag beta">Beta → Focus / Stress</span>
                                    <span className="tag theta">Theta → Mental Workload</span>
                                    <span className="tag delta">Delta → Deep Sleep</span>
                                </div>
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Heart Features (PPG Graph)</h3>
                            {graphLoading ? (
                                <div className="loader-box"><Activity className="spin" size={30} /></div>
                            ) : ppgChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={ppgChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="time" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                        <Line type="monotone" dataKey="HR" stroke="#ff0000" strokeWidth={2.5} dot={false} />
                                        <Line type="monotone" dataKey="SDNN" stroke="#00bcd4" strokeWidth={2.5} dot={false} />
                                        <Line type="monotone" dataKey="RMSSD" stroke="#4caf50" strokeWidth={2.5} dot={false} />
                                        <Line type="monotone" dataKey="pNN50" stroke="#9c27b0" strokeWidth={2.5} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="no-data-box">No PPG Graph Data</div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 📝 QUESTIONS REPORT */}
                <section className="dashboard-section">
                    <div className="section-title">
                        <CheckCircle2 className="title-icon" size={28} />
                        <h2>Reports of Each Question</h2>
                    </div>

                    <div className="questions-list">
                        {report?.attempted_questions?.length > 0 ? (
                            report.attempted_questions.map((item, index) => (
                                <div key={index} className="question-item">
                                    <div className="q-info">
                                        <span className="q-num">Q{index + 1}</span>
                                        <p>{item.description}</p>
                                    </div>
                                    <button
                                        className="btn-view-report"
                                        onClick={() => navigate('/admin/student-question-report', {
                                            state: { sid: studentId, sessionId: sessionId, qid: item.qid }
                                        })}
                                    >
                                        View Report ›
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="no-data-box">No Attempted Questions Found</div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}