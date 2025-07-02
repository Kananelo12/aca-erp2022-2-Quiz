import React from 'react';
import { Question } from '../types/type';
import './Summary.css';

interface Props {
  questions: Question[];
  userAnswers: number[];
}

const Summary: React.FC<Props> = ({ questions, userAnswers }) => (
  <div className="summary">
    <h2>Quiz Summary</h2>
    {questions.map((q, i) => (
      <div key={q.id} className="summary-item">
        <p><strong>Q{i+1}:</strong> {q.question}</p>
        <p><strong>Your answer:</strong> {q.options[userAnswers[i]]}</p>
        <p><strong>Correct:</strong> {q.options[q.answerIndex]}</p>
        <p><em>Concept: {q.concept}</em></p>
      </div>
    ))}
  </div>
);

export default Summary;