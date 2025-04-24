import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/register", { username, password });
      navigate("/login");
    } catch (error) {
      alert("Ошибка регистрации");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Регистрация</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Имя пользователя
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Зарегистрироваться
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Уже есть аккаунт? <a href="/login" className="text-blue-600 hover:underline">Войти</a>
        </p>
      </div>
    </div>
  );
}
