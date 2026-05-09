import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ArrowLeft } from 'lucide-react';

import {
  getStudentSessionReport,
  getEEGData,
  getSelfReport,
  getPPGAll,
} from '../../../api/reportApi';

import './StudentSessionReport.css';

const StudentSessionReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // ✅ Prefer state, fallback to URL params
  const sessionId =
    location.state?.sessionId ||
    params.sessionId ||
    location.state?.sid || null;

  const studentId =
    location.state?.studentId ||
    location.state?.sid ||
    params.studentId || null;

  // 🔎 Debug (check in console)
  console.log('sessionId:', sessionId);
  console.log('studentId:', studentId);

  const [report, setReport] = useState(null);
  const [eeg, setEeg] = useState(null);
  const [ppg, setPpg] = useState(null);
  const [selfReport, setSelfReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId || !studentId) {
      console.warn('Missing sessionId/studentId');
      setLoading(false);
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, studentId]);

  const fetchData = async () => {
    try {
      const res = await getStudentSessionReport(studentId, sessionId);
      setReport(res);

      const [self, eegData, ppgData] = await Promise.all([
        getSelfReport(sessionId),
        getEEGData(studentId, sessionId),
        getPPGAll(studentId, sessionId)
      ]);

      setSelfReport(self);
      setEeg(eegData);
      setPpg(ppgData);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sync EEG + PPG lengths to avoid broken graph
  const chartData = [];
  const minLength = Math.min(
    eeg?.time?.length || 0,
    ppg?.HR?.length || 0
  );

  for (let i = 0; i < minLength; i++) {
    chartData.push({
      time: eeg.time[i],
      Alpha: eeg.alpha?.[i] || 0,
      Beta: eeg.beta?.[i] || 0,
      Theta: eeg.theta?.[i] || 0,
      Gamma: eeg.gamma?.[i] || 0,
      Delta: eeg.delta?.[i] || 0,
      HR: ppg?.HR?.[i] || 0,
      SDNN: ppg?.SDNN?.[i] || 0,
      RMSSD: ppg?.RMSSD?.[i] || 0,
      pNN50: ppg?.pNN50?.[i] || 0,
    });
  }

  if (loading) {
    return <div className="loader">Loading Session Data...</div>;
  }

  if (!sessionId || !studentId) {
    return (
      <div className="loader">
        Missing session data. Please open this page from the previous screen.
      </div>
    );
  }

  return (
    <div className="page">
      {/* NAV */}
      <div className="nav">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2>{report?.student_name || "Student"}'s Report</h2>
        <span>{report?.date || ""}</span>
      </div>

      <div className="container">
        {/* SUMMARY */}
        <div className="card">
          <h3>Overall Session Report</h3>

          <div className="summary-grid">
            <div>
              <p>Date</p>
              <h4>{report?.date}</h4>
            </div>

            <div>
              <p>Session Time</p>
              <h4>{report?.total_minutes} mins</h4>
            </div>

            <div>
              <p>Stress Index</p>
              <h4>{report?.SI?.toFixed(3)}</h4>
            </div>

            <div>
              <p>Final Stress</p>
              <h4 className="stress">
                {report?.final_stress_level === 2
                  ? "High"
                  : report?.final_stress_level === 1
                    ? "Medium"
                    : "Low"}
              </h4>
            </div>
          </div>

          {/* BP + HRV row */}
          <div className="two-col">
            <div>
              <h4>Blood Pressure</h4>
              <p>
                Start (Before) <span>{report?.average_bpb ?? "—"}</span>
              </p>
              <p>
                End (After) <span>{report?.average_bpa ?? "—"}</span>
              </p>
            </div>

            <div>
              <h4>Heart Rate Variability</h4>
              <p>
                Heart Rate <span>{Math.round(report?.HR || 0)} bpm</span>
              </p>
              <p>
                RMSSD <span>{Math.round(report?.RMSSD || 0)} ms</span>
              </p>
              <p>
                SDNN <span>{Math.round(report?.SDNN || 0)} ms</span>
              </p>
              <p>
                pNN50 <span>{Math.round(report?.pNN50 || 0)} %</span>
              </p>
            </div>
          </div>

          <p className="note">
            Higher HR + lower RMSSD/SDNN = Stress, higher = Relaxation
          </p>
        </div>

        {/* EEG GRAPH */}
        <div className="card chart-card">
          <h3>EEG Signals</h3>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Alpha"
                  stroke="#00bcd4"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Beta"
                  stroke="#ff4d4d"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Theta"
                  stroke="#ffc107"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Gamma"
                  stroke="#4caf50"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Delta"
                  stroke="#9c27b0"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PPG GRAPH */}
        <div className="card chart-card">
          <h3>PPG Signals</h3>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="HR"
                  stroke="#ff0000"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="SDNN"
                  stroke="#00bcd4"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="RMSSD"
                  stroke="#4caf50"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="pNN50"
                  stroke="#9c27b0"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="bottom">
          <div className="card">
            <h3>User Feedback</h3>
            <p>Mental Load: {selfReport?.mentalLoad}</p>
            <p>Frustration: {selfReport?.frustration}</p>
            <p>Effort: {selfReport?.effort}</p>
            <p>
              <b>Comment:</b> {selfReport?.comment}
            </p>
          </div>

          <div className="card">
            <h3>Questions</h3>

            {report?.attempted_questions?.map((q, i) => (
              <div key={i} className="q-card">
                <p>{q.description}</p>

                <button
                  onClick={() => {
                    if (!sessionId || !studentId || !q.qid) {
                      alert("Missing navigation data!");
                      return;
                    }

                    // ✅ Navigate with BOTH state + params (robust)
                    navigate("/admin/student-question-report", {
                      state: {
                        sid: studentId,
                        studentId: studentId,
                        sessionId: sessionId,
                        qid: q.qid,
                      },
                    });
                  }}
                >
                  Report
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSessionReport;