import React, { useState, useEffect } from "react";
import API_URL from "../api";

export default function VITEEEMock() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/questions`)
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(() => console.log("Error fetching"));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>VITEEE Mock Test</h1>
      <p>Total Questions: {questions.length}</p>
    </div>
  );
}
