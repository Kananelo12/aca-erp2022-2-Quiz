// src/App.tsx
import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import QuizApp from './QuizApp';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import RankPage from './pages/RankPage';
import UserSummary from './pages/UserSummary';

function AppWrapper() {
  const location = useLocation();
  // const [user, setUser] = useState<{ name: string; avatarUrl?: string } | null>(null);
  const [user, setUser] = useState<{ name: string; avatarUrl?: string } | null | undefined>(undefined);

  // Fetch user once
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(u => setUser(u))
      .catch(() => setUser(null));
  }, []);

  // While loading
  if (user === undefined) return null;

  // If not logged in, redirect all to sign-in
  if (!user && location.pathname !== '/sign-up') {
    return <Navigate to="/sign-in" replace />;
  }

  // Hide header on auth pages
  const hideHeaderOn = ['/sign-in', '/sign-up'];
  const showHeader = user && !hideHeaderOn.includes(location.pathname);

  return (
    <>
      {showHeader && <Header user={user} />}
      <Routes>
        <Route path="/sign-in" element={<SignIn setUser={setUser} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/quiz"
          element={user ? <QuizApp /> : <Navigate to="/sign-in" replace />}
        />
        <Route path="/rank"    element={user ? <RankPage />   : <Navigate to="/sign-in" replace />} />
        <Route path="/usersummary" element={user ? <UserSummary />: <Navigate to="/sign-in" replace />} />
        {/* other protected routes */}
        <Route path="*" element={<Navigate to={user ? '/quiz' : '/sign-in'} replace />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
