import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RankPage.css';
import { getInitials } from '../lib/utils';
import { Leader } from '../types/type';
import ConcentricLoader from '../components/mvpblocks/concentric-loader';

const RankPage = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure user is signed in
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(u => {
        if (!u) navigate('/sign-in');
      });

    // Load leaderboard
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/leaderboard`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setLeaders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="flex-center">
    <ConcentricLoader />
  </div>;

  // Top 3 for podium
  const top3 = leaders.slice(0, 3);

  return (
    <div className="rp-container">
      {/* Podium */}
      <div className="rp-podium">
        {[1,0,2].map(idx => {
          const user = top3[idx];
          const positions = [2,1,3]; // maps idx 0→2nd place, 1→1st, 2→3rd
          return user ? (
            <div key={user.id} className={`podium-step step-${positions[idx]}`}>
              <div className="podium-score">${user.score}</div>
              <div className="podium-avatar">{getInitials(user.name)}</div>
              <div className="podium-name">{user.name}</div>
              {positions[idx] === 1 && <span className="podium-crown">👑</span>}
            </div>
          ) : <div key={idx} className={`podium-step empty step-${positions[idx]}`} />;
        })}
      </div>

      {/* List */}
      <div className="rp-list">
        <h3>Leaderboard</h3>
        <table>
          <thead>
            <tr>
              <th>#</th><th>User</th><th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((u, i) => (
              <tr key={u.id} className={i < 3 ? 'top-three' : ''}>
                <td>{i+1}</td>
                <td>
                  <div className="rp-user-cell">
                    <div className="rp-avatar">{getInitials(u.name)}</div>
                    <span>{u.name}</span>
                  </div>
                </td>
                <td>${u.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RankPage
