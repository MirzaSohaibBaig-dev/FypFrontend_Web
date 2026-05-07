import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Activity, CheckCircle2, ChevronRight, ListChecks } from 'lucide-react';

// API Imports (Farhan's Session Logic)
import { afterQuestionBP, stopStream, startRecording, resetAll } from '../../../api/sessionApi';
import { deleteSession } from '../../../api/reportApi';

// Assets
import logoImage from '../../../assets//CodeMide.png';
import cuffIcon from '../../../assets//Cuff Icon.jpg';

import './Endbp.css';

export default function Endbp() {
    const navigate = useNavigate();
    const location = useLocation();

    // Data from previous screen
    const params = location.state || {};
    const sid = params.sid || null;
    const questions = params.questions || [];
    const sessionid = params.sessionid || null;

    const [loading, setLoading] = useState(false);
    const [bpData, setBpData] = useState(null);
    const [finishing, setFinishing] = useState(false);

    // 🩺 Measure BP After Question
    const handleMeasure = async () => {
        if (loading) return;
        try {
            setLoading(true);
            const data = await afterQuestionBP();
            if (data) {
                setBpData(data);
            } else {
                alert('Failed to get BP data.');
            }
        } catch (error) {
            console.error('BP ERROR:', error);
        } finally {
            setLoading(false);
        }
    };

    // 🚀 Decision Logic: Next Question or Finish?
    const handleNext = async () => {
        if (finishing) return;
        try {
            setFinishing(true);

            if (questions.length > 0) {
                // CASE 1: More Questions
                const nextQuestion = questions[0];
                const startRes = await startRecording(sid, nextQuestion?.qid);

                if (startRes) {
                    navigate('/student/Session/question-attempt', {
                        state: { questions, sid, sessionid }
                    });
                } else {
                    alert('Failed to start next recording.');
                }
            } else {
                // CASE 2: End of Session
                const stopRes = await stopStream();
                if (stopRes) {
                    navigate('/student/Session/self-report', { state: { sid } });
                } else {
                    alert('Failed to finalize session.');
                }
            }
        } catch (error) {
            console.error('NEXT ERROR:', error);
        } finally {
            setFinishing(false);
        }
    };

    const handleBack = async () => {
        if (window.confirm("Abort session? Progress will be lost.")) {
            if (sessionid) await deleteSession(sessionid);
            await resetAll();
            navigate('/student/home');
        }
    };

    return (
        <div className="endbp-wrapper">
            <header className="session-nav">
                <button onClick={handleBack} className="back-link">
                    <ArrowLeft size={18} /> Abort Session
                </button>
                <img src={logoImage} alt="Logo" className="session-logo" />
            </header>

            <main className="endbp-card">
                <div className="info-badge">
                    <ListChecks size={16} />
                    <span>Remaining Tasks: {questions.length}</span>
                </div>

                <h2>Post-Task BP Check</h2>
                <p className="instruction-text">
                    Please take your blood pressure reading now to analyze your stress response.
                </p>

                <div className="interaction-area">
                    <div className="device-illustration">
                        <img src={cuffIcon} alt="Cuff" className="pulse-img" />
                        <button 
                            className={`measure-btn ${loading ? 'spinning' : ''}`} 
                            onClick={handleMeasure}
                            disabled={loading}
                        >
                            {loading ? <Activity className="spin" /> : 'Capture Reading'}
                        </button>
                    </div>

                    <div className="reading-display">
                        <div className={`reading-box ${bpData ? 'success' : ''}`}>
                            <div className="metric">
                                <span className="label">Systolic</span>
                                <span className="value" style={{ color: '#000000', background: 'transparent', fontWeight: '900', zIndex: 10 }}>{bpData?.SYS || '--'}</span>
                                <span className="unit">mmHg</span>
                            </div>
                            <div className="metric">
                                <span className="label">Diastolic</span>
                                <span className="value" style={{ color: '#000000', background: 'transparent', fontWeight: '900', zIndex: 10 }}>{bpData?.DIA || '--'}</span>
                                <span className="unit">mmHg</span>
                            </div>
                            <div className="metric">
                                <span className="label">Pulse</span>
                                <span className="value" style={{ color: '#000000', background: 'transparent', fontWeight: '900', zIndex: 10 }}>{bpData?.PULSE || '--'}</span>
                                <span className="unit">BPM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    className="proceed-btn" 
                    disabled={!bpData || finishing}
                    onClick={handleNext}
                >
                    {finishing ? 'Processing...' : questions.length > 0 ? 'Next Question' : 'Finish Test'} 
                    <ChevronRight size={18} />
                </button>
            </main>
        </div>
    );
}