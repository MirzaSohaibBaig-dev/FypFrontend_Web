import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { insertQuestion } from '../../../api/questionApi'; // Farhan's API
import logoImage from '../../../assets/logo.png'; 
import './AddQuestionScreen.css';

const AddQuestionScreen = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);

  const levels = ['Hard', 'Medium', 'Low']; // Farhan's exact levels

  const handleInsert = async (e) => {
    e.preventDefault();

    // Farhan's exact validations
    if (!description.trim() || !duration || !level) {
      alert('Validation Error: Please fill all fields');
      return;
    }

    if (isNaN(duration) || parseInt(duration) <= 0) {
      alert('Validation Error: Duration must be greater than 0 minutes');
      return;
    }

    const questionData = {
      description: description.trim(),
      duration: parseInt(duration),
      questionlevel: level.toLowerCase(),
    };

    try {
      setLoading(true);
      await insertQuestion(questionData); // API Call
      alert('Success: Question added successfully');
      navigate(-1); // Back to previous screen
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-question-container">
      <header className="add-question-header">
        <button className="back-link-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <img src={logoImage} alt="CodeMide" className="web-logo" />
      </header>

      <main className="add-question-content">
        <h2 className="title-text">Insert Coding Question</h2>

        <div className="form-box">
          <form onSubmit={handleInsert}>
            {/* Description */}
            <div className="input-group">
              <label>Question Description :</label>
              <textarea
                className="web-input web-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write coding question here..."
                rows="6"
              />
            </div>

            {/* Duration */}
            <div className="input-group">
              <label>Duration (Minutes) :</label>
              <input
                type="number"
                className="web-input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration in minutes"
              />
            </div>

            {/* Professional Capsule Selector for Question Level */}
            <div className="input-group">
              <label>Question Level :</label>
              <div className="level-capsule-row">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`capsule-option ${level === lvl ? 'selected' : ''}`}
                    onClick={() => setLevel(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="insert-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Inserting...
                </>
              ) : (
                'Insert Question'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddQuestionScreen;