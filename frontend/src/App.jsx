import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import Register from './pages/Register'; 
import Login from './pages/Login';
import './index.css';
import Quiz from './pages/Quiz';

function App() {
  return (
    <Router>
       <nav> 
	     <Link to="/register">Register</Link> |
	     <Link to="/login">Login</Link> |
             <Link to="/quiz">Quiz</Link>
	 </nav> 
<h1 className="text-3xl font-bold text-blue-600">Tailwind работает!</h1>

      <Routes>
        <Route path="/register" element={<Register />} /> 
	<Route path="/login" element={<Login />} /> 
	<Route path="/quiz" element={<Quiz />} />
      </Routes>
  </Router>
 );
}
export default App;
