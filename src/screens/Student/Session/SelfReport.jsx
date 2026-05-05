import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Brain, Zap, Smile, Frown, Meh, Angry, MessageSquare } from 'lucide-react';

// API Imports (Farhan's Logic)
import { submitSelfReport, resetAll, predictSession } from '../../../api/sessionApi';
import { deleteSession } from '../../../api/reportApi';

import './SelfReport.css';

export default function SelfReport() {
    const navigate = useNavigate();
    const location = useLocation();
    const sid = location.state?.sid || null;

    // States for assessment
    const [mentalLoad, setMentalLoad] = useState(3);
    const [frustration, setFrustration] = useState(3);
    const [effort, setEffort] = useState(3);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const emojis = [
        { icon: <Smile size={24} />, label: "Very Easy", val: 1 },
        { icon: <Meh size={24} />, label: "Easy", val: 2 },
        { icon: <Meh size={24} />, label: "Neutral", val: 3 },
        { icon: <Frown size={24} />, label: "Hard", val: 4 },
        { icon: <Angry size={24} />, label: "Extreme", val: 5 }
    ];

    // ✅ SUBMIT LOGIC
    const handleSubmit = async () => {
        if (loading) return;
        try {
            setLoading(true);
            const data = await submitSelfReport(mentalLoad, frustration, effort, comment);

            if (!data) {
                alert('Failed to submit report');
                return;
            }

            const sessionid = data.sessionid;
            
            // 🔥 STEP 1: AI Prediction Call
            const predictRes = await predictSession(sessionid);

            if (!predictRes) {
                alert('Stress prediction failed. Please try again.');
                return;
            }

            // 🔥 STEP 2: Move to Final Report
            navigate('/student/Session/final-report', {
                state: { sessionId: sessionid, studentId: sid }
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = async () => {
        if (window.confirm("Abort session? Final report will not be generated.")) {
            await resetAll();
            navigate('/student/home');
        }
    };

    const RatingSection = (title, question, value, setValue) => (
        <div className="assessment-section">
            <div className="section-info">
                <h4>{title}</h4>
                <p>{question}</p>
            </div>
            <div className="emoji-rating-row">
                {emojis.map((e) => (
                    <button 
                        key={e.val}
                        className={`emoji-btn ${value === e.val ? 'active' : ''}`}
                        onClick={() => setValue(e.val)}
                    >
                        {e.icon}
                        <span>{e.label}</span>
                    </button>
                ))}
            </div>
            <div className="intensity-bar">
                <div className="bar-segment green"></div>
                <div className="bar-segment light-green"></div>
                <div className="bar-segment yellow"></div>
                <div className="bar-segment orange"></div>
                <div className="bar-segment red"></div>
                <div className="indicator" style={{ left: `${(value - 1) * 25}%` }}></div>
            </div>
        </div>
    );

    return (
        <div className="self-report-wrapper">
            <header className="session-nav">
                <button onClick={handleBack} className="back-link">
                    <ArrowLeft size={18} /> Exit
                </button>
                <h2 className="header-title">Self Assessment</h2>
            </header>

            <main className="report-main-card">
                <div className="card-intro">
                    <Brain size={40} color="#48D1E4" />
                    <h3>Coding Workload & Stress</h3>
                    <p>Help us understand your mental state during the task. No right or wrong answers.</p>
                </div>

                <div className="assessment-container">
                    {RatingSection('Mental Demand', 'How mentally demanding was this coding task?', mentalLoad, setMentalLoad)}
                    {RatingSection('Effort', 'How much effort did you put into completing this task?', effort, setEffort)}
                    {RatingSection('Frustration', 'How frustrated or stressed did you feel?', frustration, setFrustration)}

                    <div className="comment-area">
                        <label><MessageSquare size={16} /> Additional Experience (Optional)</label>
                        <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us more about your experience during the coding task..."
                        />
                    </div>
                </div>

                <button className="final-submit-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Processing AI Report..." : <><Zap size={18} /> Generate Final Report</>}
                </button>
            </main>
        </div>
    );
}