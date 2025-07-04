// src/pages/UserSummary.tsx
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
// import { useWindowSize } from 'react-use';
import './UserSummary.css';

interface Submission {
  score: number;
  total: number;
  timestamp: number;
  message: string;
}

export default function UserSummary() {
  const [submission, setSubmission] = useState<Submission | null | undefined>(undefined);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch latest on mount
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user-summary`, {
      credentials: 'include'
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setSubmission(data);
        if (data) {
          setShowConfetti(true);
          // turn off confetti after 5s
          setTimeout(() => setShowConfetti(false), 5000);
        }
      })
      .catch(err => {
        console.error(err);
        setSubmission(null);
      });
  }, []);

  if (submission === undefined) return <div className="us-loading">Loading your latest score…</div>;
  if (submission === null)    return <div className="us-noattempt">You haven’t taken the quiz yet.</div>;

  const date = new Date(submission.timestamp).toLocaleString();

  return (
    <div className="us-container">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}
      <div className="us-card">
        <div className="us-header">
          <svg className="us-icon" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="#3399ff" />
            <polyline points="20,34 28,42 44,26" stroke="#fff" strokeWidth="4" fill="none" />
          </svg>
          <h2>Your Latest Quiz Result</h2>
        </div>
        <div className="us-body">
          <div className="us-row">
            <span className="us-label">Date:</span>
            <span className="us-value">{date}</span>
          </div>
          <div className="us-row">
            <span className="us-label">Score:</span>
            <span className="us-value">
              {submission.score} / {submission.total}
            </span>
          </div>
          <p className="us-message">{submission.message}</p>
        </div>
      </div>
    </div>
  );
}
