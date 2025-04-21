const API_URL = 'http://0.0.0.0:8000';

export const register = async (email, password) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const getMe = async (token) => {
  const res = await fetch(`${API_URL}/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};
