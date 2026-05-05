import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
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

export default function StudentQuestionReport() {

  const navigate = useNavigate();
  const location = useLocation();
  const { sid, sessionId, qid } = location.state || {};

  const [question, setQuestion] = useState(null);
  const [eeg, setEeg] = useState({});
  const [ppg, setPpg] = useState(null);
  const [selfReport, setSelfReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const q = await getStudentQuestionReport(sid, qid);
      setQuestion(q);

      const self = await getSelfReport(sessionId);
      setSelfReport(self);

      const delta = await getEEGDelta(sid, sessionId, qid);
      const theta = await getEEGTheta(sid, sessionId, qid);
      const alpha = await getEEGAlpha(sid, sessionId, qid);
      const beta = await getEEGBeta(sid, sessionId, qid);
      const gamma = await getEEGGamma(sid, sessionId, qid);

      setEeg({ delta, theta, alpha, beta, gamma });

      const ppgData = await getPPGSingle(sid, sessionId, qid);
      setPpg(ppgData);

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (data, key, color) => {
    if (!data?.time) return null;

    const chartData = data.time.map((t, i) => ({
      time: Math.round(t),
      value: data[key][i]
    }));

    return (
      <div className="chart-box">
        <h4>{key.toUpperCase()}</h4>
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="time"/>
            <YAxis/>
            <Tooltip/>
            <Line type="monotone" dataKey="value" stroke={color} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderPPG = () => {
    if (!ppg?.HR) return <p>No Data</p>;

    const clean = arr => arr.map(v => (isNaN(v) ? 0 : Number(v)));

    const minLength = Math.min(
      ppg.time.length,
      ppg.HR.length,
      ppg.SDNN.length,
      ppg.RMSSD.length,
      ppg.pNN50.length
    );

    const chartData = [];

    for (let i = 0; i < minLength; i++) {
      chartData.push({
        time: Math.round(ppg.time[i]),
        HR: clean(ppg.HR)[i],
        SDNN: clean(ppg.SDNN)[i],
        RMSSD: clean(ppg.RMSSD)[i],
        pNN50: clean(ppg.pNN50)[i],
      });
    }

    return (
      <div className="chart-box">
        <h4>PPG (Heart Features)</h4>
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="time"/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <Line dataKey="HR" stroke="red" dot={false}/>
            <Line dataKey="SDNN" stroke="#00bcd4" dot={false}/>
            <Line dataKey="RMSSD" stroke="green" dot={false}/>
            <Line dataKey="pNN50" stroke="purple" dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="page">

      {/* HEADER */}
      <div className="header">
        <button className="back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16}/> Back
        </button>

        <div className="header-title">
          <img src={logo} alt="logo"/>
          <h1>Question Report</h1>
        </div>
      </div>

      <div className="container">

        <div className="card question-card">
          {question?.description}
        </div>

        <div className="card">
          <h3 className="section-title">Overall Question Report</h3>

          <p>Time: {question?.time_taken} sec</p>
          <p>Stress Index: {question?.SI?.toFixed(3)}</p>
          <p>BP Start: {question?.bpb}</p>
          <p>BP End: {question?.bpa}</p>
          <p>HR: {Math.round(question?.HR)} bpm</p>
          <p>RMSSD: {Math.round(question?.RMSSD)} ms</p>
          <p>SDNN: {Math.round(question?.SDNN)} ms</p>
          <p>pNN50: {Math.round(question?.pNN50)} %</p>

          <p>Stress Level: {
            question?.stress_level === 2 ? 'High' :
            question?.stress_level === 1 ? 'Medium' : 'Low'
          }</p>

          <p>Answer: {question?.Answers}</p>
          <p>ChatGPT: {question?.gptindex === 1 ? 'Used' : 'Not Used'}</p>
        </div>

        <div className="card wide-card">
          <h3 className="section-title">EEG Signals</h3>
          {renderChart(eeg.delta,'delta','#3b82f6')}
          {renderChart(eeg.theta,'theta','#10b981')}
          {renderChart(eeg.alpha,'alpha','#f59e0b')}
          {renderChart(eeg.beta,'beta','#ef4444')}
          {renderChart(eeg.gamma,'gamma','#8b5cf6')}
        </div>

        <div className="card wide-card">
          <h3 className="section-title">PPG Graph</h3>
          {renderPPG()}
        </div>

        <div className="card">
          <h3 className="section-title">Self Report</h3>

          {selfReport ? (
            <>
              <p>Mental Load: {selfReport.mentalLoad}</p>
              <p>Frustration: {selfReport.frustration}</p>
              <p>Effort: {selfReport.effort}</p>
              <p>Comment: {selfReport.comment}</p>
            </>
          ) : (
            <p>No Self Report Data</p>
          )}
        </div>

      </div>
    </div>
  );
}