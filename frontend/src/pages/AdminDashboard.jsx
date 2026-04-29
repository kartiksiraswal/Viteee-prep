import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../lib/api";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [gamification, setGamification] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch(`${https://viteee-prep-backend.onrender.com}/gamification`)
      .then(res => res.json())
      .then(data => setGamification(data))
      .catch(err => console.log("Backend not connected yet"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">🚀 Admin Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Gamification Stats */}
          <Card className="bg-gray-900 border border-gray-700 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">🎮 User Leaderboard</h2>
              <div className="space-y-3">
                {gamification.length > 0 ? gamification.map((u, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg border border-gray-700">
                    <span className="font-medium">{i + 1}. {u.name || "Anonymous User"}</span>
                    <span className="text-sm">🔥 {u.streak} | ⭐ {u.xp}</span>
                  </div>
                )) : <p className="text-gray-500 text-sm">No user data found. Start a test!</p>}
              </div>
            </CardContent>
          </Card>

          {/* Quick Upload Stub */}
          <Card className="bg-gray-900 border border-gray-700 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-400">📂 Manage Questions</h2>
              <p className="text-sm text-gray-400 mb-4">Upload a CSV file to bulk import new PYQs into the database.</p>
              <input type="file" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer mb-4" />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6">Upload Dataset</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
