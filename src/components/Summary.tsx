import React from "react";
import { Question } from "../types/type";
import "./Summary.css";

interface Props {
  questions: Question[];
  userAnswers: number[];
}

const Summary: React.FC<Props> = ({ questions, userAnswers }) => {
  const correctCount = userAnswers.filter(
    (ans, idx) => ans === questions[idx].answerIndex
  ).length;
  const percentage = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="summaryContainer">
      <div className="scoreBanner">
        <h2>Congrats!</h2>
        <p className="scoreText">{percentage}% Score</p>
        <p>Quiz completed successfully.</p>
        <p>
          You attempted{" "}
          <span className="blueText">{questions.length} questions</span> and
          from that <span className="greenText">{correctCount} answers</span>{" "}
          are correct.
        </p>
      </div>

      <div className="summaryList">
        {questions.map((q, i) => (
          <div key={q.id} className="summaryItem">
            <p>
              <strong>Q{i + 1}:</strong> {q.question}
            </p>
            <p>
              <strong>Your answer:</strong> {q.options[userAnswers[i]]}
            </p>
            <p>
              <strong>Correct:</strong> {q.options[q.answerIndex]}
            </p>
            <p>
              <em>Concept: {q.concept}</em>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
