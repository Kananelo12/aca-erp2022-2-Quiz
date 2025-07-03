import React, { useEffect, useState } from "react";
// import questionsData from './data/questions.json';
import { Question } from "./types/type";
import "./App.css";
import QuestionCard from "./components/QuestionCard";
import Summary from "./components/Summary";
import { loadQuestions } from "./firebase/crud.action";

const STORAGE_KEY = "aca-quiz-score";

function App() {
  // const [questions] = useState<Question[]>(questionsData);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (showSummary) {
      const score = userAnswers.filter(
        (ans, idx) => ans === questions[idx].answerIndex
      ).length;
      localStorage.setItem(STORAGE_KEY, score.toString());
    }
  }, [questions, showSummary, userAnswers]);

  if (loading) return <div>Loading questions…</div>;
  if (!loading && questions.length === 0) return <div>No questions found.</div>;

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
