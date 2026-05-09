const BASE_URL = 'http://192.168.1.20:5000/api';

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/admin`, { // Farhan se confirm karein kya endpoint yahi hai?
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        users: username,   
        passwords: password,   
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend se aane wala error message dikhayen
      throw new Error(data.message || data.error || 'Invalid Credentials');
    }

    return data; 
  } catch (error) {
    console.error("API Error:", error.message);
    throw error; // Isay throw karein taake LoginScreen catch kar sakay
  }
};