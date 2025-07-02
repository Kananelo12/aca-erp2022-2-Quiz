import React from 'react'
import { Question } from "../types/type"
import './QuestionCard.css';

interface Props {
  question: Question;
  onAnswer: (selected: number) => void;
  currentIndex: number;
  total: number;
}

const QuestionCard: React.FC<Props> = ({ question, onAnswer, currentIndex, total }) => (
  <div className="card">
    <div className="card-header">
      <span>Quiz: </span>
      <span>{String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
    <div className="card-body">
      <p className="question-text">{question.question}</p>
      <div className="options">
        {question.options.map((opt, idx) => (
          <button key={idx} className="option-button" onClick={() => onAnswer(idx)}>
            <span className="option-label">{String.fromCharCode(65 + idx)}</span>
            <span className="option-text">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default QuestionCard