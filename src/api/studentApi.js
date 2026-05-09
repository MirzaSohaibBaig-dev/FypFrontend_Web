// api/studentApi.js

const BASE_URL = 'http://192.168.1.20:5000/api';
// const BASE_URL = 'http://192.168.100.12:5000/api';

// INSERT STUDENT
export const registerStudent = async (studentData) => {
  const response = await fetch(`${BASE_URL}/student/insert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Arid Number already exists');
  }

  return data;
};


// GET ALL STUDENTS
export const getAllStudents = async () => {
  const response = await fetch(`${BASE_URL}/student/getall`);
  const data = await response.json();
  return data;
};


// DELETE STUDENT
export const deleteStudent = async (sid) => {
  const response = await fetch(`${BASE_URL}/student/delete/${sid}`, {
    method: 'DELETE',
  });

  let data = {};
  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Delete failed');
  }

  return data;
};


// GET STUDENT BY ID  ✅
export const getStudentById = async (studentId) => {
  console.log('getStudentById called with:', studentId);
  const response = await fetch(`${BASE_URL}/student/getbyid/${studentId}`);
  console.log('getStudentById response status:', response.status);
  const data = await response.json();
  console.log('getStudentById data:', data);

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch student');
  }

  return data;   // ⬅️ only return
};


// UPDATE STUDENT ✅
export const updateStudent = async (studentId, updatedData) => {
  const response = await fetch(`${BASE_URL}/student/update/${studentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Update failed');
  }

  return data;   // ⬅️ only return
};