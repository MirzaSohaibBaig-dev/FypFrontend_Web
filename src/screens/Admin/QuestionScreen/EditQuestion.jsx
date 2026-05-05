import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getQuestionById, updateQuestion } from '../../../api/questionApi';
import logoImage from '../../../assets/logo.png';
import './EditQuestion.css';

const EditQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { question } = location.state || {};
  const questionId = question?.qid;

  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const levels = ['Hard', 'Medium', 'Easy'];

  useEffect(() => {
    if (!questionId) return;
    const fetchQuestion = async () => {
      try {
        setFetching(true);
        const data = await getQuestionById(questionId);
        setDescription(data.description || '');
        setDuration(String(data.duration || ''));
        const lvl = data.questionlevel;
        if (lvl) setLevel(lvl.charAt(0).toUpperCase() + lvl.slice(1));
      } catch (error) {
        alert('Error: Failed to load data');
      } finally { setFetching(false); }
    };
    fetchQuestion();
  }, [questionId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!description.trim() || !duration || !level) {
      alert('Validation Error: Please fill all fields');
      return;
    }
    const updatedData = {
      description: description.trim(),
      duration: parseInt(duration),
      questionlevel: level.toLowerCase(),
    };
    try {
      setLoading(true);
      await updateQuestion(questionId, updatedData);
      alert('Success: Question updated successfully');
      navigate(-1);
    } catch (error) {
      alert('Update Failed: ' + error.message);
    } finally { setLoading(false); }
  };

  if (fetching) {
    return (
      <div className="edit-screen-container loading-state">
        <Loader2 className="animate-spin" color="white" size={50} />
      </div>
    );
  }

  return (
    <div className="edit-screen-container">
      {/* 🔹 HEADER: Exactly as AddQuestionScreen logic */}
      <header className="edit-header">
        <button className="edit-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <img src={logoImage} alt="CodeMide" className="edit-web-logo" />
      </header>

      <main className="edit-content">
        <h2 className="edit-title">Edit Coding Question</h2>
        <div className="edit-form-box">
          <form onSubmit={handleUpdate}>
            <div className="edit-input-group">
              <label>Question Description :</label>
              <textarea
                className="edit-web-input edit-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Edit coding question..."
                rows="6"
              />
            </div>
            <div className="edit-input-group">
              <label>Duration (Minutes) :</label>
              <input
                type="number"
                className="edit-web-input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="edit-input-group">
              <label>Question Level :</label>
              <div className="edit-capsule-row">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`edit-capsule ${level === lvl ? 'selected' : ''}`}
                    onClick={() => setLevel(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="edit-update-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Question"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditQuestion;