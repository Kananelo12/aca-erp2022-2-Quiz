import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

interface User {
  name: string;
  avatarUrl?: string;
}

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/signout`, {
      method: 'POST',
      credentials: 'include'
    });
    navigate('/sign-in');
  };

  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/quiz" className="logo">
          Quiz <span className="logo-accent">App</span>
        </Link>
      </div>

      <nav className="header-nav">
        <Link
          to="/quiz"
          className={location.pathname === '/quiz' ? 'nav-item active' : 'nav-item'}
        >
          Quiz
        </Link>
        <Link
          to="/rank"
          className={location.pathname === '/rank' ? 'nav-item active' : 'nav-item'}
        >
          Rank
        </Link>
        <Link
          to="/usersummary"
          className={location.pathname === '/usersummary' ? 'nav-item active' : 'nav-item'}
        >
          Summary
        </Link>
      </nav>

      <div className="header-right" ref={menuRef}>
        <button className="avatar-button" onClick={() => setMenuOpen(!menuOpen)}>
          {user.avatarUrl
            ? <img src={user.avatarUrl} alt="avatar" className="avatar-img" />
            : <span className="avatar-initials">{initials}</span>}
        </button>

        {menuOpen && (
          <div className="avatar-menu">
            <div className="avatar-menu-user">{user.name}</div>
            <button className="avatar-menu-signout" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
