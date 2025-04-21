import { useState } from 'react';
import { register } from '../api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(email, password);
    setMsg(res.message || res.detail);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <button type="submit">Register</button>
      <p>{msg}</p>
    </form>
  );
}
