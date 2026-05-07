import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Code2, Send, ArrowLeft, BrainCircuit, AlertCircle } from 'lucide-react';

// API Imports (Farhan's Logic)
import { stopRecording, resetAll, midQuestionBP } from '../../../api/sessionApi';
import { deleteSession } from '../../../api/reportApi';

import './QuestionAttempt.css';

export default function QuestionAttempt() {
    const navigate = useNavigate();
    const location = useLocation();

    // Data handling from navigation state
    const params = location.state || {};
    const sessionid = params.sessionid || null;
    const currentQuestion = params.questions?.[0] || null;
    const remainingQuestions = params.questions?.slice(1) || [];
    const sid = params.sid || null;

    // States
    const totalSeconds = (currentQuestion?.duration || 10) * 60; // sohaib changing 10 min to 1 min for testing
    const [seconds, setSeconds] = useState(totalSeconds);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatgptEnabled, setChatgptEnabled] = useState(false);

     // Ensure timer resets if the question changes while component is mounted
    useEffect(() => {
        setSeconds((currentQuestion?.duration || 10) * 60);
        setAnswer('');
        hasNavigated.current = false;
        midPopupShown.current = false;
    }, [currentQuestion?.qid]);




    // =====================
    // MID BP POPUP STATE
    // =====================
    const [showMidPopup, setShowMidPopup] = useState(false);
    const [midBpLoading, setMidBpLoading] = useState(false);
    const [midBpError, setMidBpError] = useState(false);
    const midPopupShown = useRef(false);

    const hasNavigated = useRef(false);

    // ✅ TIMER LOGIC
    useEffect(() => {
        if (seconds <= 0) return;

        const timer = setInterval(() => {
            setSeconds(prev => {
                const newVal = prev - 1;

                // 1 minute baad popup dikhao - sirf ek baar
                const midPoint = totalSeconds - 60;
                if (newVal === midPoint && !midPopupShown.current) {
                    midPopupShown.current = true;
                    setShowMidPopup(true);
                }

                // Timer khatam - next screen
                if (newVal === 0 && !hasNavigated.current) {
                    hasNavigated.current = true;
                    setTimeout(() => handleNext(), 0);
                }

                return newVal;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds, totalSeconds]);

    const formatTime = () => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // =====================
    // MID BP OK BUTTON
    // =====================
    const handleMidBpOk = async () => {
        setMidBpLoading(true);
        setMidBpError(false); // ✅ pehle error clear karo

        try {
            const result = await midQuestionBP();

            // ✅ SIRF is condition pe popup band hoga
            if (result?.status === 'mid question BP saved') {
                setShowMidPopup(false);
                console.log('✅ Mid BP saved successfully');
            } else {
                console.log('⚠️ Unexpected response:', result);
                setMidBpError(true);
            }
        } catch (error) {
            console.log('❌ Mid BP Error:', error);
            setMidBpError(true);
        } finally {
            setMidBpLoading(false);
        }
    };

    // ✅ SUBMIT / NEXT LOGIC
    const handleNext = async () => {
        if (loading || hasNavigated.current) return;
        hasNavigated.current = true;

        try {
            setLoading(true);
            const data = await stopRecording(answer, chatgptEnabled);

            if (!data) {
                alert('Recording stop failed');
                hasNavigated.current = false;
                return;
            }

            // Flow: Next question ke liye EndBP par jana
            navigate('/student/Session/end-bp', {
                state: {
                    sid: sid,
                    questions: remainingQuestions,
                    sessionid: sessionid,
                }
            });
        } catch (error) {
            console.error(error);
            hasNavigated.current = false;
        } finally {
            setLoading(false);
        }
    };

    const handleBack = async () => {
        if (window.confirm("Are you sure? This will delete the current session.")) {
            try {
                if (sessionid) await deleteSession(sessionid);
                await resetAll();
                navigate('/student/home');
            } catch (error) {
                console.error('BACK ERROR:', error);
            }
        }
    };

    return (
        <div className="qa-wrapper">
            {/* ========================
                MID BP POPUP
            ======================== */}
            {showMidPopup && (
                <div className="mid-modal-overlay">
                    <div className="mid-modal-box">
                        <div className="mid-modal-icon">🩺</div>
                        <h2 className="mid-modal-title">Blood Pressure Check</h2>
                        <p className="mid-modal-message">
                            Please turn ON your BP device and press OK when ready.
                        </p>

                        {midBpError && (
                            <p className="mid-modal-error">
                                ⚠️ Device disconnected or failed. Please reconnect and try again.
                            </p>
                        )}

                        <button 
                            className={`mid-modal-btn ${midBpLoading ? 'disabled' : ''}`}
                            onClick={handleMidBpOk}
                            disabled={midBpLoading}
                        >
                            {midBpLoading ? 'Reading BP...' : (midBpError ? '🔄 Retry' : "OK - I'm Ready")}
                        </button>
                    </div>
                </div>
            )}

            {/* Header Sidebar-less Layout */}
            <header className="qa-header">
                <div className="header-left">
                    <button onClick={handleBack} className="qa-exit-btn">
                        <ArrowLeft size={18} /> Exit
                    </button>
                    <div className="qa-timer">
                        <Clock size={18} className={seconds < 60 ? 'timer-danger' : ''} />
                        <span className={seconds < 60 ? 'timer-danger' : ''}>{formatTime()}</span>
                    </div>
                </div>
                <div className="qa-title-box">
                    <Code2 size={20} color="#48D1E4" />
                    <span>Programming Assessment</span>
                </div>
                <div className="qa-gpt-toggle">
                    <BrainCircuit size={18} color={chatgptEnabled ? '#48D1E4' : '#ccc'} />
                    <span>ChatGPT Assist</span>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={chatgptEnabled}
                            onChange={(e) => setChatgptEnabled(e.target.checked)}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </header>

            <main className="qa-main">
                {/* Left Side: Question Pane */}
                <section className="qa-question-pane">
                    <div className="pane-header">Question Statement</div>
                    <div className="pane-content">
                        <h3>Task Description</h3>
                        <p>{currentQuestion?.description || 'No question description available.'}</p>
                        
                        <div className="qa-info-alert">
                            <AlertCircle size={16} />
                            <span>Your vitals are being recorded. Please stay focused.</span>
                        </div>
                    </div>
                </section>

                {/* Right Side: Code Editor Pane */}
                <section className="qa-editor-pane">
                    <div className="pane-header">Solution Editor</div>
                    <textarea
                        className="qa-textarea"
                        placeholder="// Write your code or program here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    ></textarea>
                    
                    <footer className="pane-footer">
                        <div className="auto-move-text">Session will auto-submit when timer hits 00:00</div>
                        <button className="qa-submit-btn" onClick={handleNext} disabled={loading}>
                            {loading ? 'Submitting...' : <><Send size={16} /> Submit Solution</>}
                        </button>
                    </footer>
                </section>
            </main>
        </div>
    );
}