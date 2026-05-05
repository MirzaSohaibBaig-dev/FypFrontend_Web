import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

// 1. UPDATE: Farhan ki studentApi se sahi function mangwa rahy hain
import { registerStudent } from '../../api/studentApi'; 
import logoImage from '../../assets/logo.png';
import './SignUpScreen.css';

const SignUpScreen = () => {
  const navigate = useNavigate();

  // States
  const [studentName, setStudentName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [gender, setGender] = useState('');
  const [semester, setSemester] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validations
    if (!studentName || !regNo || !gender || !semester || !cgpa || !password || !confirmPassword) {
      alert('Please fill all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Password and Confirm Password do not match.');
      return;
    }

    if (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 4) {
      alert('CGPA must be between 0 and 4.');
      return;
    }

    if (!agreeTerms) {
      alert('Please agree to the privacy policy.');
      return;
    }

    setLoading(true);
    try {
      // 🚀 2. UPDATE: Farhan ki API call (registerStudent) connect ho gayi
      // Hum exact wahi keys bhej rahy hain jo Backend (studentApi) maang raha hai
      await registerStudent({
        studentName,
        regNo,
        gender,
        semester,
        cgpa,
        password
      });

      alert('Registration successful! Please login.');
      // Registration ke baad seedha login screen par
      navigate('/login', { state: { signupData: { regNo } } });
    } catch (error) {
      // Farhan ki API error throw kregi to yahan catch hoga
      alert('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <img src={logoImage} alt="CodeMide" className="mini-logo" />
      </div>

      <div className="register-card">
        <h2 className="form-title">Please create a new account</h2>
        
        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-field full">
            <label>Student Name :</label>
            <input 
              type="text" 
              placeholder="Enter Your Name" 
              value={studentName} 
              onChange={(e) => setStudentName(e.target.value)} 
            />
          </div>

          <div className="input-row">
            <div className="input-field">
              <label>Reg No :</label>
              <input 
                type="text" 
                placeholder="0000-ARID-0000" 
                value={regNo} 
                onChange={(e) => setRegNo(e.target.value)} 
              />
            </div>
            <div className="input-field">
              <label>Gender :</label>
              <div className="gender-container">
                {['Male', 'Female'].map((g) => (
                  <label key={g} className="radio-label">
                    <input 
                      type="radio" 
                      name="gender" 
                      checked={gender === g} 
                      onChange={() => setGender(g)} 
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="input-row">
            <div className="input-field">
              <label>Semester :</label>
              <input 
                type="text" 
                placeholder="1 to 8" 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)} 
              />
            </div>
            <div className="input-field">
              <label>CGPA :</label>
              <input 
                type="text" 
                placeholder="Enter CGPA" 
                value={cgpa} 
                onChange={(e) => setCgpa(e.target.value)} 
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-field">
              <label>Password :</label>
              <div className="pass-input">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
            <div className="input-field">
              <label>Confirm Password :</label>
              <div className="pass-input">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm Password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
          </div>

          <div className="terms-container">
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreeTerms} 
              onChange={(e) => setAgreeTerms(e.target.checked)} 
            />
            <label htmlFor="terms">I Agree to Privacy Policy</label>
          </div>

          <button type="submit" className="reg-submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;