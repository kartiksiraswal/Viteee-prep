require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.SECRET;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
  name: { type: String, default: "Test User" },
  role: { type: String, default: "user" },
  xp: { type: Number, default: 0 }, 
  streak: { type: Number, default: 0 },
  lastActive: String 
});
const QuestionSchema = new mongoose.Schema({
  subject: String, chapter: String, year: Number, question: String, options: [String], answer: String, explanation: String,
});
const AttemptSchema = new mongoose.Schema({
  userId: String, score: Number, total: Number, accuracy: Number, subjectStats: Object, weakTopics: [String], date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Question = mongoose.model("Question", QuestionSchema);
const Attempt = mongoose.model("Attempt", AttemptSchema);

// Mock Auth Middleware for testing
const auth = async (req, res, next) => {
  // In production, use standard JWT validation here.
  // For local testing, we auto-create/find a mock user.
  let user = await User.findOne({ name: "Test User" });
  if (!user) user = await User.create({ name: "Test User" });
  req.userId = user._id;
  next();
};

// --- ROUTES ---

// 1. Get Questions (Creates dummy data if DB is empty)
app.get("/questions", async (req, res) => {
  let count = await Question.countDocuments();
  if (count === 0) {
    await Question.create({
      subject: "Physics", chapter: "Mechanics", year: 2023,
      question: "A 2 kg object moving at 3 m/s has momentum?",
      options: ["6 kg·m/s", "3 kg·m/s", "5 kg·m/s", "9 kg·m/s"],
      answer: "6 kg·m/s", explanation: "Momentum p = mv = 2×3 = 6 kg·m/s"
    });
  }
  const data = await Question.aggregate([{ $sample: { size: 10 } }]);
  res.json(data);
});

// 2. Submit Test & Update Gamification
app.post("/submit", auth, async (req, res) => {
  const { answers } = req.body; 
  if (!answers || answers.length === 0) return res.status(400).json({ error: "No answers provided" });

  const user = await User.findById(req.userId);
  const questionIds = answers.map(a => a.questionId);
  const questions = await Question.find({ _id: { $in: questionIds } });
  
  const qMap = {}; 
  questions.forEach(q => qMap[q._id.toString()] = q);

  let score = 0;
  let subjectStats = {};
  let weakTopics = {};

  answers.forEach((ans) => {
    const q = qMap[ans.questionId];
    if (!q) return;

    if (!subjectStats[q.subject]) subjectStats[q.subject] = { correct: 0, total: 0 };
    subjectStats[q.subject].total++;

    if (ans.answer === q.answer) {
      score++;
      subjectStats[q.subject].correct++;
    } else {
      weakTopics[q.chapter] = (weakTopics[q.chapter] || 0) + 1;
    }
  });

  const total = answers.length;
  const accuracy = (score / total) * 100;
  const weak = Object.keys(weakTopics).sort((a, b) => weakTopics[b] - weakTopics[a]).slice(0, 5);

  const attempt = new Attempt({ userId: user._id, score, total, accuracy, subjectStats, weakTopics: weak });
  await attempt.save();

  // Streak Logic (Strict UTC)
  const todayUTC = new Date().toISOString().split('T')[0];
  if (user.lastActive !== todayUTC) {
    const yesterdayUTC = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    user.streak = (user.lastActive === yesterdayUTC) ? user.streak + 1 : 1;
  }
  user.lastActive = todayUTC;
  user.xp += Math.floor(score * 10);
  await user.save();

  res.json({ score, total, accuracy, subjectStats, weakTopics: weak, xp: user.xp, streak: user.streak });
});

// 3. Admin Gamification Leaderboard
app.get("/gamification", async (req, res) => {
  const users = await User.find().select("name xp streak").sort({ xp: -1 }).limit(10);
  res.json(users);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
