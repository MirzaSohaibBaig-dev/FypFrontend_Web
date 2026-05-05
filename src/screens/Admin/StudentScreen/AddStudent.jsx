import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UserPlus, Eye, EyeOff } from 'lucide-react';
import { registerStudent } from '../../../api/studentApi'; 
import logoImage from '../../../assets/logo.png';
import './AddStudent.css';

const AddStudent = () => {
  const navigate = useNavigate();
  
  const [studentName, setStudentName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [gender, setGender] = useState('');
  const [semester, setSemester] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!studentName || !regNo || !gender || !semester || !cgpa || !password || !confirmPassword) {
      alert('Validation Error: Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Validation Error: Password and Confirm Password do not match');
      return;
    }

    if (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 4) {
      alert('Validation Error: CGPA must be between 0 and 4');
      return;
    }

    if (parseInt(semester) < 1 || parseInt(semester) > 8) {
      alert('Validation Error: Semester must be between 1 and 8');
      return;
    }

    if (!agreeTerms) {
      alert('Validation Error: Please agree to terms & privacy policy');
      return;
    }

    const studentData = {
      regno: regNo,
      name: studentName,
      gender,
      password,
      cgpa: parseFloat(cgpa),
      semester: parseInt(semester),
    };

    try {
      setLoading(true);
      await registerStudent(studentData);
      alert('Success: Student Registered Successfully');
      navigate('/admin');
    } catch (error) {
      alert('Registration Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-container">
      {/* 🚀 Header: Back Button and Corner Logo */}
      <header className="add-student-header">
        <button className="add-student-back-btn" onClick={() => navigate('/admin')}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        {/* LOGO: Class updated for Absolute Positioning */}
        <img src={logoImage} alt="Logo" className="add-student-web-logo" />
      </header>

      <div className="add-student-content">
        <div className="add-student-card">
          <div className="add-student-form-title">
            <UserPlus color="#48D1E4" size={40} />
            <h2>Create Student Account</h2>
          </div>

          <form onSubmit={handleRegister}>
            <div className="add-student-input-group">
              <label>Student Name :</label>
              <input 
                className="add-student-web-input" type="text" value={studentName} 
                onChange={(e) => setStudentName(e.target.value)} placeholder="Enter Full Name"
              />
            </div>

            <div className="add-student-input-group">
              <label>ARID Reg No :</label>
              <input 
                className="add-student-web-input" type="text" value={regNo} 
                onChange={(e) => setRegNo(e.target.value)} placeholder="2022-ARID-0000"
              />
            </div>

            <div className="add-student-input-group">
              <label>Gender :</label>
              <div className="add-student-gender-row">
                <label className="gender-label">
                  <input type="radio" name="gender" value="Male" onChange={(e) => setGender(e.target.value)} /> Male
                </label>
                <label className="gender-label">
                  <input type="radio" name="gender" value="Female" onChange={(e) => setGender(e.target.value)} /> Female
                </label>
              </div>
            </div>

            <div className="add-student-dual-row">
              <div className="add-student-input-group">
                <label>Semester :</label>
                <input 
                  className="add-student-web-input" type="number" value={semester} 
                  onChange={(e) => setSemester(e.target.value)} placeholder="1-8"
                />
              </div>
              <div className="add-student-input-group">
                <label>CGPA :</label>
                <input 
                  className="add-student-web-input" type="number" step="0.01" value={cgpa} 
                  onChange={(e) => setCgpa(e.target.value)} placeholder="0.0 - 4.0"
                />
              </div>
            </div>

            <div className="add-student-input-group">
              <label>Password :</label>
              <div className="add-student-pass-wrapper">
                <input 
                  className="add-student-web-input" 
                  type={showPassword ? "text" : "password"} value={password} 
                  onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"
                />
                <span className="add-student-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <div className="add-student-input-group">
              <label>Confirm Password :</label>
              <div className="add-student-pass-wrapper">
                <input 
                  className="add-student-web-input" 
                  type={showConfirmPassword ? "text" : "password"} value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password"
                />
                <span className="add-student-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <div className="add-student-terms">
              <input 
                type="checkbox" checked={agreeTerms} 
                onChange={(e) => setAgreeTerms(e.target.checked)} 
              />
              <span>I Agree to Privacy Policy</span>
            </div>

            <button type="submit" className="add-student-submit-btn" disabled={loading}>
              {loading ? 'Registering...' : <><Save size={18} /> Register Student</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;