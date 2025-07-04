import React, { useEffect, useState } from "react";
import emptyState from "./char.png";
import { Question } from "./types/type";
import "./App.css";
import QuestionCard from "./components/QuestionCard";
import Summary from "./components/Summary";
import { loadQuestions } from "./firebase/crud.action";
import ConcentricLoader from "./components/mvpblocks/concentric-loader";
import { useNavigate } from "react-router-dom";
// import SignUp from "./SignUp";

const STORAGE_KEY = "aca-quiz-score";

function App() {
  const navigate = useNavigate(); // omit if you’ll use window.location
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/me`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((user) => {
        if (!user) return navigate("/sign-in");
        setUserId(user.id);
      })
      .catch(() => navigate("/sign-in"));
  }, [navigate]);

  useEffect(() => {
    loadQuestions()
      .then((qs) => setQuestions(qs))
      .catch((err) => console.error("Error loading questions:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAnswer = (selected: number) => {
    setUserAnswers((prev) => [...prev, selected]);
    if (currentIndex + 1 < questions.length) setCurrentIndex(currentIndex + 1);
    else setShowSummary(true);
  };

  // when summary shows, submit to backend
  useEffect(() => {
    if (!showSummary || !userId) return;

    const correct = userAnswers.filter(
      (ans, idx) => ans === questions[idx].answerIndex
    ).length;
    const total = questions.length;
    const pct = Math.round((correct / total) * 100);

    // creative message
    let message = "Keep practicing!";
    if (pct === 100) message = "Outstanding! Perfect score!";
    else if (pct >= 80) message = "Great job!";
    else if (pct >= 50) message = "You did okay.";

    console.log("\nSubmitting score:", {
      userId,
      score: correct,
      total,
      message,
      timestamp: Date.now(),
    });

    console.log("\nBACKEND URL", process.env.REACT_APP_BACKEND_URL);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/submit-quiz`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        score: correct,
        total,
        timestamp: Date.now(),
        message,
      }),
    })
      .then((res) => {
        if (!res.ok) console.error("Submit failed:", res.statusText);
      })
      .catch((err) => console.error("Submit error:", err));
  }, [showSummary, userId, userAnswers, questions]);

  useEffect(() => {
    if (showSummary) {
      const score = userAnswers.filter(
        (ans, idx) => ans === questions[idx].answerIndex
      ).length;
      localStorage.setItem(STORAGE_KEY, score.toString());
    }
  }, [questions, showSummary, userAnswers]);

  if (loading)
    return (
      <div className="flex-center">
        <ConcentricLoader />
      </div>
    );

  // const empty = true; TODO: FOR TESTING ONLY
  // if (empty) TODO: FOR TESTING ONLY
  if (!loading && questions.length === 0)
    return (
      <div className="flex-column empty-state-container">
        <img src={emptyState} width={200} alt="empty state" />
        <h2>No questions found.</h2>
        <p>Please check back later or contact support.</p>
      </div>
    );

  return (
    <div className="App">
      {!showSummary ? (
        <QuestionCard
          question={questions[currentIndex]}
          onAnswer={handleAnswer}
          currentIndex={currentIndex}
          total={questions.length}
        />
      ) : (
        <Summary questions={questions} userAnswers={userAnswers} />
      )}
    </div>
  );
}

export default App;
