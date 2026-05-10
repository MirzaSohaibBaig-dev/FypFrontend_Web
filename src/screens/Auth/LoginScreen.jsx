import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { loginUser } from '../../api/loginApi'; 
import logoImage from '../../assets/logo.png';
import './loginscreen.css';

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState(''); //input save krny k liye state
  const [password, setPassword] = useState(''); //input save krny k liye state
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ SAME AS REACT NATIVE (ONLY REGNO LOAD)
  useEffect(() => {
    const savedRegNo = localStorage.getItem('savedRegNo');

    if (savedRegNo) {
      setUsername(savedRegNo);
      setRememberMe(true);
    }

    if (location.state?.signupData?.regNo) {
      setUsername(location.state.signupData.regNo);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Please enter Reg No and Password');
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(username, password);
      console.log('Login response:', data);

      // ✅ SAME AS REACT NATIVE (ONLY REGNO SAVE)
      if (rememberMe) {
        localStorage.setItem('savedRegNo', username);
      } else {
        localStorage.removeItem('savedRegNo');
      }

      // 🔹 AUTH DATA (UNCHANGED)
      localStorage.setItem('token', data.token || ''); 
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('sid', data.sid);

      const role = data.role?.toLowerCase(); 

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'student') {
        // ⚠️ DO NOT CHANGE THIS
        navigate('/student/home', { state: { sid: data.sId } }); //home screen show which student will be displayed
      } else {
        alert("Unknown user role received from server");
      }

    } catch (error) {
      alert('Login Failed: ' + error.message);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="login-content">
        <img src={logoImage} alt="CodeMide" className="login-logo" />
        <h2 className="login-title">Login to continue</h2>

        <div className="login-card">
          <form onSubmit={handleLogin} autoComplete="off">

            {/* REG NO */}
            <div className="input-group">
              <label>Reg No</label>
              <input 
                type="text" 
                placeholder="Enter your Reg No"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="new-username"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <span 
                  className="eye-icon" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>

            {/* BUTTON */}
            <button 
              type="submit" 
              className="login-submit-btn" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* SIGNUP */}
            <p 
              className="signup-link" 
              onClick={() => navigate('/register')}
            >
              New Here? <span>Register Now</span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;