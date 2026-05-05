import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { ArrowLeft, Activity, Heart, Brain, Calendar, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

// API Imports
import { getStudentSessionReport, getEEGData } from '../../../api/reportApi';
import logoImage from '../../../assets/CodeMide.png';

import './Report.css';

export default function Report() {
    const navigate = useNavigate();
    const location = useLocation();
    const { sessionId, studentId } = location.state || {};

    const [report, setReport] = useState(null);
    const [eeg, setEeg] = useState([]);
    const [loading, setLoading] = useState(true);
    const [graphLoading, setGraphLoading] = useState(true);

    useEffect(() => {
        if (sessionId && studentId) {
            fetchData();
        } else {
            navigate('/student/home');
        }
    }, [sessionId, studentId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getStudentSessionReport(studentId, sessionId);
            setReport(res);
            setLoading(false);

            const eegData = await getEEGData(studentId, sessionId);
            if (eegData && eegData.alpha) {
                setEeg(processEEGData(eegData));
            }
        } catch (error) {
            console.error('REPORT ERROR:', error);
        } finally {
            setGraphLoading(false);
        }
    };

    const processEEGData = (data) => {
        const clean = (arr) => arr.map(v => (isNaN(v) || v === null ? 0 : Number(v)));
        const minLength = Math.min(
            data.time?.length || 0,
            data.alpha?.length || 0,
            data.beta?.length || 0,
            data.theta?.length || 0,
            data.gamma?.length || 0
        );

        const time = data.time.slice(0, minLength);
        const alpha = clean(data.alpha.slice(0, minLength));
        const beta = clean(data.beta.slice(0, minLength));
        const theta = clean(data.theta.slice(0, minLength));
        const gamma = clean(data.gamma.slice(0, minLength));

        return time.map((t, i) => ({
            second: `${Math.round(t)}s`,
            Alpha: alpha[i],
            Beta: beta[i],
            Theta: theta[i],
            Gamma: gamma[i],
        })).filter((_, i) => i % 5 === 0);
    };

    if (loading) {
        return (
            <div className="report-loader-screen">
                <div className="loader-box">
                    <Activity className="spin-icon" />
                    <p>Generating AI Health Insights...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="report-page-wrapper">
            {/* ✨ Modern Header */}
            <header className="glass-nav">
                <div className="nav-left">
                    <button onClick={() => navigate('/student/home')} className="action-btn-back">
                        <ArrowLeft size={20} /> Exit Session
                    </button>
                    <div className="divider"></div>
                    <img src={logoImage} alt="Logo" className="brand-logo" />
                </div>
                <div className="nav-right">
                    <div className="user-profile-badge">
                        <div className="avatar">{report?.student_name?.charAt(0) || 'S'}</div>
                        <div className="info">
                            <span className="name">{report?.student_name || 'Student'}</span>
                            <span className="role">Active Participant</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="report-content">
                {/* 📊 Top Stats Row */}
                <div className="stats-grid">
                    <div className="stat-card stress-focus">
                        <div className="icon-wrap"><Brain size={24} /></div>
                        <div className="text-wrap">
                            <p>Final Stress Index</p>
                            <h2 className={report?.final_stress_level?.toLowerCase()}>{report?.final_stress_level || '-'}</h2>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="icon-wrap"><Clock size={24} /></div>
                        <div className="text-wrap">
                            <p>Session Duration</p>
                            <h2>{report?.total_minutes || '0'} <span>Mins</span></h2>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="icon-wrap"><Calendar size={24} /></div>
                        <div className="text-wrap">
                            <p>Date</p>
                            <h2>{report?.date || '-'}</h2>
                        </div>
                    </div>
                </div>

                <div className="main-analytics-grid">
                    {/* 🧠 Brain Signal Visualization */}
                    <div className="visual-panel">
                        <div className="panel-header">
                            <div className="title-group">
                                <TrendingUp size={20} color="#48D1E4" />
                                <h3>Physiological Brain Signals (EEG)</h3>
                            </div>
                        </div>
                        <div className="graph-container">
                            {graphLoading ? (
                                <div className="pulse-loader">Fetching EEG Waves...</div>
                            ) : eeg.length > 0 ? (
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={eeg}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="second" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                                        <Legend iconType="circle" />
                                        <Line type="monotone" dataKey="Alpha" stroke="#3CBAC8" strokeWidth={3} dot={false} />
                                        <Line type="monotone" dataKey="Beta" stroke="#FF6B6B" strokeWidth={3} dot={false} />
                                        <Line type="monotone" dataKey="Theta" stroke="#FFD93D" strokeWidth={3} dot={false} />
                                        <Line type="monotone" dataKey="Gamma" stroke="#6BCB77" strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-state">No EEG data recorded.</div>
                            )}
                        </div>
                    </div>

                    {/* ❤️ Physiological Metrics Sidebar */}
                    <div className="metrics-panel">
                        <h3>Health Vitals</h3>
                        <div className="vitals-stack">
                            <div className="vital-row">
                                <div className="v-label"><Activity size={16} /> Blood Pressure</div>
                                <div className="v-value">{report?.average_bp || '-'} <small>mmHg</small></div>
                            </div>
                            <div className="vital-row">
                                <div className="v-label"><Heart size={16} /> Heart Rate</div>
                                <div className="v-value">{report?.HR || '-'} <small>BPM</small></div>
                            </div>
                        </div>

                        <div className="hrv-card">
                            <p className="section-subtitle">HRV Heart Variability</p>
                            <div className="hrv-grid">
                                <div className="hrv-box">
                                    <label>RMSSD</label>
                                    <span>{report?.RMSSD || '-'}</span>
                                </div>
                                <div className="hrv-box">
                                    <label>SDNN</label>
                                    <span>{report?.SDNN || '-'}</span>
                                </div>
                            </div>
                            <div className="hrv-footer">
                                Higher RMSSD/SDNN indicates a state of relaxation.
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ Question Breakdown Section */}
                <div className="questions-panel">
                    <div className="panel-header">
                        <CheckCircle2 size={22} color="#48D1E4" />
                        <h3>Attempted Challenges Analysis</h3>
                    </div>
                    <div className="q-cards-grid">
                        {report?.attempted_questions?.map((item, index) => (
                            <div key={index} className="q-card-professional">
                                <div className="q-meta">Question #{index + 1}</div>
                                <p className="q-desc">{item.description}</p>
                                <button onClick={() => navigate('/student/report')} className="btn-details">
                                    Detailed Stress Map ›
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}