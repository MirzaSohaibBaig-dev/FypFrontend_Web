// api/Question api
const BASE_URL = 'http://192.168.1.12:5000/api';

// const BASE_URL = 'http://192.168.100.12:5000/api';


// GET ALL QUESTIONS

export const getAllQuestions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/question/getall`);
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

// DELETE QUESTION

export const deleteQuestion = async (qid) => {
  try {
    const response = await fetch(`${BASE_URL}/question/delete/${qid}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete question because it is used in some quiz');
    }

    return data;
  } catch (error) {
    throw error;
  }
};




// INSERT QUESTION
export const insertQuestion = async (questionData) => {
  const response = await fetch(`${BASE_URL}/question/insert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(questionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to insert question');
  }

  return data;
};





// GET QUESTION BY ID
export const getQuestionById = async (qid) => {
  const response = await fetch(`${BASE_URL}/question/getbyid/${qid}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch question');
  }

  return data;
};


// UPDATE QUESTION
export const updateQuestion = async (qid, updatedData) => {
  const response = await fetch(`${BASE_URL}/question/update/${qid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update question');
  }

  return data;
};