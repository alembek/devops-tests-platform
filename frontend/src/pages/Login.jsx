import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/login", { username, password });
      navigate("/dashboard");
    } catch (error) {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-sm p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">Вход</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Имя пользователя
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Войти
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Нет аккаунта? <a href="/register" className="text-indigo-600 hover:underline">Зарегистрируйтесь</a>
        </p>
      </div>
    </div>
  );
}
