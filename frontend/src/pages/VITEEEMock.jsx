import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { API_BASE_URL } from "../lib/api";

export default function VITEEEMock() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]); 
  const [timeLeft, setTimeLeft] = useState(150 * 60); 
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/questions`)
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !finished && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questions.length > 0) {
      handleFinalSubmit();
    }
  }, [timeLeft, finished, questions]);

  const q = questions[current];

  const handleSubmit = () => {
    setShowAnswer(true);
    setUserAnswers([...userAnswers, { questionId: q._id, answer: selected }]);
  };

  const handleNext = () => {
    setSelected(null);
    setShowAnswer(false);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setFinished(true);
    const token = localStorage.getItem("token") || "test-user-token"; 
    
    try {
      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ answers: userAnswers })
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  if (questions.length === 0) return <div className="p-10 text-center text-white min-h-screen bg-gray-950">Loading Test Bank...</div>;

  if (finished && results) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center text-white">
        <Card className="w-full max-w-2xl rounded-2xl shadow-lg bg-gray-900 border border-gray-700">
          <CardContent className="p-6 text-center">
            <h2 className="text-3xl font-bold mb-4 text-green-400">Test Completed</h2>
            <p className="text-xl">Score: {results.score} / {results.total}</p>
            <p className="text-md mt-2 text-gray-400">Accuracy: {results.accuracy?.toFixed(2)}%</p>
            
            <div className="mt-6 text-left bg-gray-800 p-4 rounded-xl border border-gray-700">
              <h3 className="font-semibold text-red-400 mb-2">Weak Topics to Review:</h3>
              <ul className="list-disc pl-5 text-gray-300">
                {results.weakTopics?.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
               <div className="bg-gray-800 p-4 rounded-xl border border-yellow-700/50">
                 <p className="text-sm text-gray-400">Total XP</p>
                 <p className="text-2xl font-bold text-yellow-400">⭐ {results.xp}</p>
               </div>
               <div className="bg-gray-800 p-4 rounded-xl border border-orange-700/50">
                 <p className="text-sm text-gray-400">Current Streak</p>
                 <p className="text-2xl font-bold text-orange-500">🔥 {results.streak} Days</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white flex items-center justify-center">
      <Card className="w-full max-w-2xl rounded-2xl shadow-lg bg-gray-900 border border-gray-700">
        <CardContent className="p-6">
          <div className="flex justify-between mb-4 text-gray-400 font-mono text-sm border-b border-gray-800 pb-2">
            <span>Question {current + 1} of {questions.length}</span>
            <span className="text-orange-400">⏱️ {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}</span>
          </div>

          <p className="text-xs tracking-wider uppercase text-blue-400 mb-2 font-semibold">{q.subject} • {q.chapter}</p>
          <p className="mb-6 text-xl leading-relaxed">{q.question}</p>

          <div className="space-y-3">
            {q.options.map((opt, index) => (
              <Button
                key={index}
                variant={selected === opt ? "default" : "outline"}
                className={`w-full justify-start py-6 text-left px-4 rounded-xl transition-all ${selected === opt ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200'}`}
                onClick={() => !showAnswer && setSelected(opt)}
              >
                {opt}
              </Button>
            ))}
          </div>

          {!showAnswer ? (
            <Button className="mt-8 w-full py-6 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white rounded-xl" onClick={handleSubmit} disabled={!selected}>
              Submit Answer
            </Button>
          ) : (
            <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-green-400 mb-3 text-lg"><strong>Correct Answer:</strong> {q.answer}</p>
              <p className="text-sm text-gray-300 bg-gray-800 p-4 rounded-xl leading-relaxed border border-gray-700">{q.explanation}</p>
              
              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-900/50 rounded-xl text-sm text-blue-300 flex items-start gap-3">
                <span>💡</span>
                <p>Focus on accuracy here. Ensure you know the formula application before moving on.</p>
              </div>

              <Button className="mt-6 w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl" onClick={handleNext}>
                Next Question
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
