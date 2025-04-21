import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    axios.get('/questions/random?count=5').then(res => setQuestions(res.data))
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (!submitted) {
      handleSubmit()
    }
  }, [timeLeft])

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: parseInt(value) })
  }

  const handleSubmit = () => {
    axios.post('/submit', { answers }).then(res => {
      setResult(res.data)
      setSubmitted(true)
    })
  }

  if (submitted) {
    return <div>Результат: {result.correct}/{result.total}</div>
  }

  return (
    <div>
      <h1>Тест DevOps</h1>
      <p>Оставшееся время: {timeLeft} сек</p>
      {questions.map(q => (
        <div key={q.id}>
          <p>{q.question}</p>
          {Object.entries(q.options).map(([k, v]) => (
            <label key={k}>
              <input
                type="radio"
                name={`q_${q.id}`}
                value={k}
                onChange={e => handleChange(q.id, e.target.value)}
              /> {v}<br/>
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Отправить</button>
    </div>
  )
}

export default App
