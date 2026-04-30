import React, { useEffect, useState } from "react";
import API from "../lib/api";

export default function VITEEEMock() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(150 * 60); // ⏱️ 150 mins
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // 🔥 Fetch questions
  useEffect(() => {
    fetch(`${API}/questions`)
      .then(res => res.json())
      .then(setQuestions)
      .catch(() => console.log("Error loading questions"));
  }, []);
  useEffect(() => {
  if (timeLeft <= 0) {
    submitTest();
    return;
  }
    useEffect(() => {
  const qid = questions[current]?._id;
  if (qid && answers[qid]) {
    setSelected(answers[qid]);
  } else {
    setSelected(null);
  }
}, [current, questions]);

  const timer = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft]);

  const q = questions[current];

  const handleSubmit = () => {
    setShowAnswer(true);
    setAnswers({
  ...answers,
  [q._id]: selected
});
  };

  const handleNext = () => {
    setSelected(null);
    setShowAnswer(false);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    if (submitted) return; // prevent multiple submits
  setSubmitted(true);

    try {
      const res = await fetch(`${API}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        const formattedAnswers = Object.entries(answers).map(
  ([questionId, answer]) => ({ questionId, answer })
);

const res = await fetch(`${API}/submit`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ answers: formattedAnswers })
});
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.log("Submit failed", err);
    }
  };

  // 🧪 Loading state
  if (questions.length === 0) return <h2>Loading questions...</h2>;

  // 🎉 Result screen
  if (result) {
    return (
      <div style={{ padding: 40 }}>
        <h1>🎉 Test Completed</h1>
        <p>Score: {result.score} / {result.total}</p>
        <p>Accuracy: {result.accuracy?.toFixed(2)}%</p>
        <p>XP: ⭐ {result.xp}</p>
        <p>Streak: 🔥 {result.streak}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h3>
  ⏱️ Time Left: {Math.floor(timeLeft / 60)}:
  {("0" + (timeLeft % 60)).slice(-2)}
</h3>
      <div style={{ marginBottom: 20 }}>
  {questions.map((_, index) => {
    const qid = questions[index]._id;
    const isAnswered = answers[qid];
    const isCurrent = index === current;

    return (
      <button
        key={index}
        onClick={() => setCurrent(index)}
        style={{
          margin: 5,
          padding: "10px",
          width: 40,
          background: isCurrent
            ? "blue"
            : isAnswered
            ? "green"
            : "gray",
          color: "white",
          border: "none",
          borderRadius: "6px"
        }}
      >
        {index + 1}
      </button>
    );
  })}
</div>
      <h2>Question {current + 1}</h2>
      <p>{q.question}</p>

      {q.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => !showAnswer && setSelected(opt)}
          style={{
            display: "block",
            margin: "10px 0",
            background: selected === opt ? "blue" : "gray",
            color: "white"
          }}
        >
          {opt}
        </button>
      ))}

      {!showAnswer ? (
        <button onClick={handleSubmit} disabled={!selected}>
          Submit
        </button>
      ) : (
        <div>
          <p>✅ Correct: {q.answer}</p>
          <p>{q.explanation}</p>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
}
