import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { updateStudent, getStudentById } from "../../../api/studentApi";
import logo from "../../../assets/logo.png";
import "./EditStudent.css";

export default function EditStudent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state || {};
  const studentId = student?.sid;

  const [studentName, setStudentName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [gender, setGender] = useState("");
  const [semester, setSemester] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) return;

    const fetchStudent = async () => {
      try {
        setLoading(true);
        const data = await getStudentById(studentId);

        setStudentName(data.name || "");
        setRegNo(data.regno || "");
        setGender(data.gender || "");
        setSemester(String(data.semester || ""));
        setCgpa(String(data.cgpa || ""));
        setPassword(data.password || "");
      } catch {
        alert("Failed to load student");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!studentName || !regNo || !gender || !semester || !cgpa || !password) {
      alert("Fill all fields");
      return;
    }

    const updatedData = {
      name: studentName,
      regno: regNo,
      gender,
      semester: parseInt(semester),
      cgpa: parseFloat(cgpa),
      password,
    };

    try {
      setLoading(true);
      await updateStudent(studentId, updatedData);
      alert("Student updated");
      navigate(-1);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-container">

      {/* HEADER */}
      <div className="edit-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16}/> Back
        </button>

        <img src={logo} className="mini-logo" alt="logo" />
      </div>

      {/* CARD */}
      <div className="edit-card">
        <h2 className="form-title">Edit Student Account</h2>

        <form onSubmit={handleUpdate} className="edit-form">

          <div className="input-row">
            <div className="input-field">
              <label>Student Name</label>
              <input value={studentName} onChange={(e)=>setStudentName(e.target.value)} />
            </div>

            <div className="input-field">
              <label>Registration No</label>
              <input value={regNo} onChange={(e)=>setRegNo(e.target.value)} />
            </div>
          </div>

          <div className="input-row">
            <div className="input-field">
              <label>Gender</label>
              <div className="gender-container">
                <label className="radio-label">
                  <input type="radio" value="Male" checked={gender==="Male"} onChange={(e)=>setGender(e.target.value)} />
                  Male
                </label>
                <label className="radio-label">
                  <input type="radio" value="Female" checked={gender==="Female"} onChange={(e)=>setGender(e.target.value)} />
                  Female
                </label>
              </div>
            </div>

            <div className="input-field">
              <label>Semester</label>
              <input type="number" value={semester} onChange={(e)=>setSemester(e.target.value)} />
            </div>
          </div>

          <div className="input-row">
            <div className="input-field">
              <label>CGPA</label>
              <input type="number" value={cgpa} onChange={(e)=>setCgpa(e.target.value)} />
            </div>

            <div className="input-field">
              <label>Password</label>
              <div className="pass-input">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
                <span className="eye-icon" onClick={()=>setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </span>
              </div>
            </div>
          </div>

          <button className="reg-submit">
            {loading ? "Updating..." : "Update Student"}
          </button>

        </form>
      </div>
    </div>
  );
}