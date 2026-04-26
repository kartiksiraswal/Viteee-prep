import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { Rocket, BarChart3, Trophy } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden relative">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center py-24 px-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Crack VITEEE with <span className="text-green-400">Smart Practice</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg">
          Practice real PYQs, analyze your performance, and improve faster with gamified learning.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/test')} className="px-8 py-4 text-lg bg-green-500 hover:bg-green-600 transition">
            Start Free Test
          </Button>
          <Button onClick={() => navigate('/admin')} variant="outline" className="px-8 py-4 text-lg border-gray-600 hover:bg-gray-800 transition">
            Admin Dashboard
          </Button>
        </div>
      </motion.div>

      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      <div className="grid md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto pb-20 relative z-10">
        {[
          { icon: <Rocket className="text-green-400" size={28} />, title: "Real PYQs", desc: "Practice VITEEE-level questions with detailed explanations." },
          { icon: <BarChart3 className="text-blue-400" size={28} />, title: "Smart Analytics", desc: "Track weak areas and monitor your progress visually." },
          { icon: <Trophy className="text-yellow-400" size={28} />, title: "Gamified Learning", desc: "Earn XP, maintain streaks, and compete on leaderboard." }
        ].map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} viewport={{ once: true }}>
            <Card className="bg-gray-900/70 backdrop-blur border border-gray-700 hover:scale-105 transition duration-300">
              <CardContent className="p-6">
                <div className="mb-3">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
