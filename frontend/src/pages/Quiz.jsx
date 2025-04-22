import { useEffect, useState } from 'react';


export default function Quiz() {

  const [questions, setQuestions] = useState([]);

  const [index, setIndex] = useState(0);

  const [selected, setSelected] = useState('');

  const [result, setResult] = useState(null);

  const [seconds, setSeconds] = useState(60);


  useEffect(() => {

    const fetchQuestions = async () => {

      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:8000/questions', {

        headers: {

          Authorization: `Bearer ${token}`

        }

      });

      const data = await res.json();

      setQuestions(data);

    };


    fetchQuestions();

  }, []);


  useEffect(() => {

    const timer = setInterval(() => {

      setSeconds((s) => s - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, []);


  useEffect(() => {

    if (seconds <= 0) handleSubmit();

  }, [seconds]);


  const handleSubmit = async () => {

    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:8000/submit', {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

        Authorization: `Bearer ${token}`

      },

      body: JSON.stringify({

        answers: {

          [questions[index]?.id]: selected

        }

      })

    });

    const data = await res.json();

    setResult(data);

  };


  if (result) {

    return <div>✅ Result: {result.correct} correct out of {result.total}</div>;

  }


  if (!questions.length) return <div>Loading...</div>;


  const q = questions[index];


  return (

    <div>

      <h2>⏱️ Time Left: {seconds}s</h2>

      <h3>{q.text}</h3>

      {q.choices.map((choice, i) => (

        <div key={i}>

          <input

            type="radio"

            name="choice"

            value={choice}

            checked={selected === choice}

            onChange={(e) => setSelected(e.target.value)}

          />

          {choice}

        </div>

      ))}

      <button onClick={handleSubmit}>Submit</button>

    </div>

  );

}

