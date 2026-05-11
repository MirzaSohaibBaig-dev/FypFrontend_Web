const BASE_URL = 'http://192.168.1.13:5000/api';
// const BASE_URL = 'http://192.168.100.12:5000/api';

// GET QUESTION REPORT
export const getQuestionReport = async (qid) => {
  try {
    const response = await fetch(`${BASE_URL}/report/qus_rep_admin/${qid}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch report");
    }

    return data;
  } catch (error) {
    console.error("Error fetching question report:", error);
    throw error;
  }
};

// GET all sessions for a student
export const getAllSessions = async (studentId) => {
  try {
    const url = `${BASE_URL}/report/allsession/${studentId}`;
    console.log("API URL:", url);
    const response = await fetch(url);

    if (!response.ok) {
      console.log("API ERROR STATUS:", response.status);
      return [];
    }

    const data = await response.json();
    console.log("API RESPONSE:", data);
    return data;
  } catch (error) {
    console.log("API ERROR:", error);
    return [];
  }
};

// 👉 Student Session Report
export const getStudentSessionReport = async (sid, sessionId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/report/student_session_report/${sid}/${sessionId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
};

// 👉 EEG Data
export const getEEGData = async (sid, sessionId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/devices/eeg/all?sessionid=${sessionId}&sid=${sid}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

// ✅ Question Report Graph APIs
export const getEEGDelta = async (sid, sessionId, qid) => {
  try {
    const res = await fetch(
      `${BASE_URL}/devices/eeg/delta?sessionid=${sessionId}&sid=${sid}&qid=${qid}`
    );
    return await res.json();
  } catch (err) {
    console.log("Delta Error:", err);
    return null;
  }
};

export const getEEGTheta = async (sid, sessionId, qid) => {
  try {
    const res = await fetch(
      `${BASE_URL}/devices/eeg/theta?sessionid=${sessionId}&sid=${sid}&qid=${qid}`
    );
    return await res.json();
  } catch (err) {
    console.log("Theta Error:", err);
    return null;
  }
};

export const getEEGAlpha = async (sid, sessionId, qid) => {
  try {
    const res = await fetch(
      `${BASE_URL}/devices/eeg/alpha?sessionid=${sessionId}&sid=${sid}&qid=${qid}`
    );
    return await res.json();
  } catch (err) {
    console.log("Alpha Error:", err);
    return null;
  }
};

export const getEEGBeta = async (sid, sessionId, qid) => {
  try {
    const res = await fetch(
      `${BASE_URL}/devices/eeg/beta?sessionid=${sessionId}&sid=${sid}&qid=${qid}`
    );
    return await res.json();
  } catch (err) {
    console.log("Beta Error:", err);
    return null;
  }
};

export const getEEGGamma = async (sid, sessionId, qid) => {
  try {
    const res = await fetch(
      `${BASE_URL}/devices/eeg/gamma?sessionid=${sessionId}&sid=${sid}&qid=${qid}`
    );
    return await res.json();
  } catch (err) {
    console.log("Gamma Error:", err);
    return null;
  }
};

// 👉 Student Question Report
export const getStudentQuestionReport = async (sid, qid) => {
  try {
    const response = await fetch(
      `${BASE_URL}/report/student_question_report/${sid}/${qid}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch question report");
    }

    return data;
  } catch (error) {
    console.log("Question Report API Error:", error);
    return null;
  }
};

// 👉 Top 5 Sessions (Dashboard)
export const getTopSessions = async (sid) => {
  try {
    console.log('getTopSessions called with:', sid);
    const url = `${BASE_URL}/report/sessiontop5/${sid}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.log("Top Sessions API Error:", response.status);
      return [];
    }

    return data;
  } catch (error) {
    console.log("Top Sessions ERROR:", error);
    return [];
  }
};

export const getAllQuestions = async (sid) => {
  try {
    const questions = [];
    let res = await fetch(`${BASE_URL}/report/unattemptedeasy/${sid}`);
    let data = await res.json();
    if (data?.count >= 0) questions.push(data);

    // res = await fetch(`${BASE_URL}/report/unattemptedmedium/${sid}`);
    // data = await res.json();
    // if (data?.count >= 0) questions.push(data);

    res = await fetch(`${BASE_URL}/report/unattemptedhard/${sid}`);
    data = await res.json();
    if (data?.count >= 0) questions.push(data);

    console.log("API DATA:", questions);
    return questions;
  } catch (error) {
    console.log("API ERROR:", error);
    return [];
  }
};

// 🔥 DELETE SESSION
export const deleteSession = async (sessionId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/report/delete_session/${sessionId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    const data = await response.json();
    if (!response.ok) return null;
    return data;
  } catch (error) {
    console.log("DELETE SESSION ERROR:", error);
    return null;
  }
};

// 👉 SELF REPORT BY SESSION
export const getSelfReport = async (sessionId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/report/selfreport/${sessionId}`
    );
    const data = await response.json();
    if (!response.ok) return null;
    return data;
  } catch (error) {
    console.log("SELF REPORT ERROR:", error);
    return null;
  }
};

// ==========================================
// 👉 PPG DATA FUNCTIONS (Farhan's Update)
// ==========================================

// 👉 PPG DATA (COMBINED)
export const getPPGAll = async (sid, sessionId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/devices/eeg/allp?sessionid=${sessionId}&sid=${sid}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("PPG API ERROR:", error);
    return null;
  }
};

// 👉 PPG DATA (single)
export const getPPGSingle = async (sid, sessionId, qid) => {
  try {
    const res = await fetch(
      `${BASE_URL}/devices/eeg/single?sessionid=${sessionId}&sid=${sid}&qid=${qid}`
    );
    return await res.json();
  } catch (err) {
    console.log("PPG SINGLE ERROR:", err);
    return null;
  }
};