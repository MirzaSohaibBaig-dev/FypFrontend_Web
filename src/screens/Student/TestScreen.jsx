import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, AlertTriangle, PlayCircle, Loader2, BookOpen } from 'lucide-react';

// API Imports (Exact paths as per Farhan)
import { getAllQuestions } from '../../api/reportApi';
import { startSession } from '../../api/sessionApi';

// Assets
import logoImage from '../../assets//CodeMide.png';
import eegDeviceImg from '../../assets//EEG Device copy.png';

import './TestScreen.css';

export default function TestScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Sid handling (From localStorage or Location state)
    const sid = location.state?.sid || localStorage.getItem('sid');

    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [startingSession, setStartingSession] = useState(false);

    useEffect(() => {
        if (sid) {
            loadQuestions();
        } else {
            navigate('/login');
        }
    }, [sid]);

    // 🔥 Load Questions
    const loadQuestions = async () => {
        try {
            setLoadingQuestions(true);
            const data = await getAllQuestions(sid);
            setQuestions(data || []);
        } catch (error) {
            console.error("Error loading questions:", error);
        } finally {
            setLoadingQuestions(false);
        }
    };

    // 🔥 Start Session Logic
    const handleStart = async () => {
        try {
            setStartingSession(true);
            const success = await startSession();

            if (success) {
                // Navigate to Baseline BP as per Farhan's flow
                navigate('/student/Session/baseline', {
                    state: { sid, questions }
                });
            } else {
                alert('Failed to initialize session. Please check your monitoring device.');
            }
        } catch (error) {
            console.error("Session Start Error:", error);
        } finally {
            setStartingSession(false);
        }
    };

    if (loadingQuestions) {
        return (
            <div className="test-loader-container">
                <Loader2 className="spin-icon" size={40} />
                <p>Fetching your programming tasks...</p>
            </div>
        );
    }

    return (
        <div className="test-screen-wrapper">
            <header className="test-nav-header">
                  <button onClick={() => navigate('/student/home', { state: { sid } })} className="back-btn-ui">
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>
                <img src={logoImage} alt="CodeMide" className="test-logo-ui" />
            </header>

            <main className="test-main-content">
                <div className="test-header-section">
                    <div className="text-content">
                        <h1>Programming Assessment</h1>
                        <p>Analyze the questions below. Your physiological signals will be monitored during the attempt.</p>
                    </div>
                    <img src={eegDeviceImg} alt="EEG Device" className="eeg-illustrate" />
                </div>

                <div className="test-grid-container">
                    {/* LEFT SIDE: QUESTIONS LIST */}
                    <div className="questions-card">
                        <div className="card-top">
                            <BookOpen size={20} color="#48D1E4" />
                            <h3>Assigned Tasks</h3>
                        </div>
                        
                        <div className="questions-scroll-area">
                            {questions.length > 0 ? (
                                questions.map((q, index) => (
                                    <div key={q.qid} className="web-question-item">
                                        <div className="q-index">Task {index + 1}</div>
                                        <p className="q-desc">{q.description}</p>
                                        <div className="q-meta">
                                            <Clock size={14} />
                                            <span>{q.duration} Minutes</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-questions">No questions assigned yet.</div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE: INSTRUCTIONS & START */}
                    <div className="start-control-card">
                        <div className="warning-box">
                            <AlertTriangle size={24} color="#48D1E4" />
                            <h4>Pre-test Warning</h4>
                            <p>Ensure your monitoring device is turned <strong>ON</strong> and correctly placed before clicking start.</p>
                        </div>

                        <button 
                            className={`web-primary-start-btn ${startingSession ? 'loading' : ''}`}
                            onClick={handleStart}
                            disabled={startingSession || questions.length === 0}
                        >
                            {startingSession ? (
                                <> <Loader2 className="spin-icon" size={18} /> Starting... </>
                            ) : (
                                <> <PlayCircle size={18} /> Start Programming Test </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}