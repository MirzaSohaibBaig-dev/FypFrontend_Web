import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Activity, CheckCircle2, ChevronRight } from 'lucide-react';

// API Imports (Paths aligned to your sidebar)
import { startBaselineBP, startRecording, resetAll } from '../../../api/sessionApi';

// Assets
import logoImage from '../../../assets//CodeMide.png';
import cuffIcon from '../../../assets//Cuff Icon.jpg';

import './Baselinebp.css';

export default function Baselinebp() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Params handle karna
    const { sid, questions } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [bpData, setBpData] = useState(null);
    const [starting, setStarting] = useState(false);

    // 🩺 BP Measure Logic
    const handleMeasure = async () => {
        try {
            setLoading(true);
            const data = await startBaselineBP();
            if (data) {
                setBpData(data);
            } else {
                alert('Failed to get BP data from device.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 🚀 Proceed to Test
    const handleNext = async () => {
        try {
            setStarting(true);
            if (!questions || questions.length === 0) {
                alert('No questions selected.');
                return;
            }

            const firstQuestion = questions[0];
            const data = await startRecording(sid, firstQuestion.qid);

            if (data && data.status === 'recording started') {
                navigate('/student/session/question-attempt', {
                    state: { questions, sid, sessionid: data.sessionid }
                });
            } else {
                alert('Could not start recording.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setStarting(false);
        }
    };

    const handleBack = async () => {
        await resetAll();
        navigate(-1);
    };

    return (
        <div className="baseline-container">
            <header className="session-nav">
                <button onClick={handleBack} className="back-link">
                    <ArrowLeft size={18} /> Exit Session
                </button>
                <img src={logoImage} alt="Logo" className="session-logo" />
            </header>

            <main className="baseline-card">
                <div className="status-stepper">
                    <div className="step active">1. Baseline</div>
                    <div className="step-line"></div>
                    <div className="step">2. Coding</div>
                    <div className="step-line"></div>
                    <div className="step">3. Report</div>
                </div>

                <h2>Take Baseline Reading</h2>
                <p className="instruction-text">
                    Wear the cuff properly and turn on the device for an accurate baseline.
                </p>

                <div className="interaction-area">
                    <div className="device-illustration">
                        <img src={cuffIcon} alt="Cuff" />
                        <button 
                            className={`measure-btn ${loading ? 'spinning' : ''}`} 
                            onClick={handleMeasure}
                            disabled={loading}
                        >
                            {loading ? <Activity className="spin" /> : 'Measure Now'}
                        </button>
                    </div>

                    <div className="reading-display">
                        <div className={`reading-box ${bpData ? 'success' : ''}`}>
                            <div className="metric">
                                <span className="label">Systolic</span>
                                <span className="value">{bpData ? bpData.SYS : '--'}</span>
                                <span className="unit">mmHg</span>
                            </div>
                            <div className="metric">
                                <span className="label">Diastolic</span>
                                <span className="value">{bpData ? bpData.DIA : '--'}</span>
                                <span className="unit">mmHg</span>
                            </div>
                            <div className="metric">
                                <span className="label">Pulse</span>
                                <span className="value">{bpData ? bpData.PULSE : '--'}</span>
                                <span className="unit">BPM</span>
                            </div>
                        </div>

                        {bpData && (
                            <div className="success-msg">
                                <CheckCircle2 color="#48D1E4" size={20} />
                                Reading Captured Successfully
                            </div>
                        )}
                    </div>
                </div>

                <button 
                    className="proceed-btn" 
                    disabled={!bpData || starting}
                    onClick={handleNext}
                >
                    {starting ? 'Starting Session...' : 'Start Coding Task'} 
                    <ChevronRight size={18} />
                </button>
            </main>
        </div>
    );
}