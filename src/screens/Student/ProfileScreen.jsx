import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Hash, GraduationCap, Award, Lock, Save } from 'lucide-react';
import { updateStudent, getStudentById } from '../../api/studentApi';
import profileIcon from '../../assets//Profilew.png';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sid } = location.state || {}; 
  const studentId = sid || localStorage.getItem('sid');// Navigated state se ID nikalna

  // States
  const [studentData, setStudentData] = useState({
    name: '',
    regno: '',
    gender: '',
    semester: '',
    cgpa: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Load student data
  useEffect(() => {
    if (!studentId) return;
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const data = await getStudentById(studentId);
        setStudentData({
          name: data.name || '',
          regno: data.regno || '',
          gender: data.gender || '',
          semester: String(data.semester || ''),
          cgpa: String(data.cgpa || ''),
          password: data.password || ''
        });
      } catch (error) {
        alert('Error: Failed to load student data');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [sid]);

  // 🔹 Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { name, regno, gender, semester, cgpa, password } = studentData;

    if (!name || !regno || !gender || !semester || !cgpa || !password) {
      alert('Please fill all fields');
      return;
    }

    if (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 4) {
      alert('CGPA must be between 0 and 4');
      return;
    }

    const updatedData = {
      ...studentData,
      semester: parseInt(semester),
      cgpa: parseFloat(cgpa)
    };

    try {
      setLoading(true);
      await updateStudent(sid, updatedData);
      alert('Success: Profile updated successfully');
    } catch (error) {
      alert('Update Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  return (
    <>
        <header className="content-header">
          <h1 className="profile-main-title">My Profile</h1>
        </header>

        <section className="profile-card">
          <div className="profile-header">
            <img src={profileIcon} alt="Profile" className="profile-avatar" />
            <h2>{studentData.name || 'Student Profile'}</h2>
            <p>{studentData.regno}</p>
          </div>

          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="form-grid">
              {/* Name */}
              <div className="input-box">
                <label><User size={16}/> Student Name</label>
                <input name="name" value={studentData.name} onChange={handleChange} />
              </div>

              {/* Reg No */}
              <div className="input-box">
                <label><Hash size={16}/> ARID Reg No</label>
                <input name="regno" value={studentData.regno} onChange={handleChange} />
              </div>

              {/* Gender */}
              <div className="input-box">
                <label>Gender</label>
                <select name="gender" value={studentData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Semester */}
              <div className="input-box">
                <label><GraduationCap size={16}/> Semester</label>
                <input name="semester" type="number" value={studentData.semester} onChange={handleChange} />
              </div>

              {/* CGPA */}
              <div className="input-box">
                <label><Award size={16}/> CGPA</label>
                <input name="cgpa" type="number" step="0.01" value={studentData.cgpa} onChange={handleChange} />
              </div>

              {/* Password */}
              <div className="input-box">
                <label><Lock size={16}/> Password</label>
                <div className="web-password-wrapper">
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    value={studentData.password} 
                    onChange={handleChange} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="save-profile-btn" disabled={loading}>
              {loading ? 'Updating...' : <><Save size={18}/> Save Changes</>}
            </button>
          </form>
      </section>
    </>
  );
};

export default ProfileScreen;