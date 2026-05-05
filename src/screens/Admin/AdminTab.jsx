import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, LogOut, Trash2, Edit3, BarChart2, Plus } from 'lucide-react';
import { getAllStudents, deleteStudent } from '../../api/studentApi';
import { getAllQuestions, deleteQuestion } from '../../api/questionApi';
import logoImage from '../../assets/logo.png';
import './AdminTab.css';

const AdminTab = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(() => sessionStorage.getItem('adminTab') || 'students');//student/question issue
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Save tab to sessionStorage so it survives screen navigation
  useEffect(() => {
    sessionStorage.setItem('adminTab', tab);
  }, [tab]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const sData = await getAllStudents();
      const qData = await getAllQuestions();
      setStudents(sData || []);
      setQuestions(qData || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteStudent = async (sid) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(sid);
        fetchData();
      } catch (error) { 
        alert(error.message); 
      }
    }
  };

  const handleDeleteQuestion = async (qid) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(qid);
        fetchData();
      } catch (error) { 
        alert(error.message); 
      }
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-wrapper">
            <img src={logoImage} alt="Logo" className="sidebar-logo-img" />
          </div>
          <div className="brand-text">
            <h2 className="brand-name">Code<span>Mide</span></h2>
            <span className="brand-tagline">Admin Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={tab === 'students' ? 'active' : ''} onClick={() => setTab('students')}>
            <Users size={20} /> <span>Students</span>
          </button>
          <button className={tab === 'questions' ? 'active' : ''} onClick={() => setTab('questions')}>
            <BookOpen size={20} /> <span>Questions</span>
          </button>
        </nav>

        <button className="sidebar-logout" onClick={() => navigate('/login')}>
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="main-header">
          <div className="header-info">
            <h1>Welcome Back!</h1>
            <p>Admin Portal (Student & Question Management)</p>
          </div>
          <button className="add-primary-btn" onClick={() => navigate(tab === 'students' ? '/admin/add-student' : '/admin/add-question')}>
            <Plus size={18} /> {tab === 'students' ? 'Add Student' : 'Add Question'}
          </button>
        </header>

        <div className="content-card">
          <div className="table-wrapper">
            {loading ? (
              <div className="loading-state">Loading data...</div>
            ) : tab === 'students' ? (
              <table className="web-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Reg No</th>
                    <th>Semester</th>
                    <th>CGPA</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((item) => (
                    <tr key={item.sid}>
                      <td><div className="name-cell"><strong>{item.name}</strong></div></td>
                      <td>{item.regno}</td>
                      <td>{item.semester}</td>
                      <td><span className="cgpa-badge">{item.cgpa}</span></td>
                      <td className="action-cells">
                        {/* 🔹 FIXED: Passing full student object like Farhan's mobile app */}
                        <button 
                          className="icon-btn report" 
                          title="All Sessions" 
                          onClick={() => navigate('/admin/student-session', { state: { student: item } })}
                        >
                          <BarChart2 size={18} />
                        </button>
                        
                        <button 
                          className="icon-btn edit" 
                          title="Edit" 
                          onClick={() => navigate('/admin/edit-student', { state: { student: item } })}
                        >
                          <Edit3 size={18} />
                        </button>

                        <button 
                          className="icon-btn delete" 
                          title="Delete" 
                          onClick={() => handleDeleteStudent(item.sid)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="web-table">
                <thead>
                  <tr>
                    <th>Question Description</th>
                    <th>Level</th>
                    <th>Attempts</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((item, index) => (
                    <tr key={item.qid}>
                      <td className="desc-cell"><strong>Q{index + 1}:</strong> {item.description}</td>
                      <td><span className={`level-tag ${item.questionlevel?.toLowerCase()}`}>{item.questionlevel}</span></td>
                      <td>{item.count}</td>
                      <td className="action-cells">
                        {/* 🔹 FIXED: Passing question object like Farhan's logic */}
                        <button 
                          className="icon-btn report" 
                          title="Report" 
                          onClick={() => navigate('/admin/report-question', { state: { question: item } })}
                        >
                          <BarChart2 size={18} />
                        </button>

                        <button 
                          className="icon-btn edit" 
                          title="Edit" 
                          onClick={() => navigate('/admin/edit-question', { state: { question: item } })}
                        >
                          <Edit3 size={18} />
                        </button>

                        <button 
                          className="icon-btn delete" 
                          title="Delete" 
                          onClick={() => handleDeleteQuestion(item.qid)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTab;