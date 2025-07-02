import React, { useEffect, useState } from 'react';
import questionsData from './data/questions.json';
import { Question } from './types/type';
import './App.css';
import QuestionCard from './components/QuestionCard';
import Summary from './components/Summary';

const STORAGE_KEY = 'aca-quiz-score';

function App() {
  const [questions] = useState<Question[]>(questionsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const handleAnswer = (selected: number) => {
    setUserAnswers(prev => [...prev, selected]);
    if (currentIndex + 1 < questions.length) setCurrentIndex(currentIndex + 1);
    else setShowSummary(true);
  };

  useEffect(() => {
    if (showSummary) {
      const score = userAnswers.filter((ans, idx) => ans === questions[idx].answerIndex).length;
      localStorage.setItem(STORAGE_KEY, score.toString());
    }
  }, [questions, showSummary, userAnswers]);

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
