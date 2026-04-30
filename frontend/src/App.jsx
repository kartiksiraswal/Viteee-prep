import React, { useEffect, useState } from "react";
import API from "./lib/api";

export default function App() {
  const [data, setData] = useState("Loading...");

  useEffect(() => {
    fetch(API)
      .then((res) => res.text())
      .then((result) => setData(result))
      .catch(() => setData("Error connecting backend"));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>🚀 VITEEE Prep App</h1>
      <p>Backend says:</p>
      <h2>{data}</h2>
    </div>
  );
}
