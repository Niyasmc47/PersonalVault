import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, User, LogOut, Menu, X } from 'lucide-react';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path ? 'pv-nav-link pv-nav-link--active' : 'pv-nav-link';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="pv-header">
        <div className="pv-container pv-header-inner">
          <Link to="/home" className="pv-logo">PersonalVault</Link>

          <button
            className="pv-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className={`pv-nav ${menuOpen ? 'pv-nav--open' : ''}`}>
            <Link to="/home" className={isActive('/home')} onClick={() => setMenuOpen(false)}>
              <Home size={15} style={{ marginRight: 4, verticalAlign: -2 }} />
              Home
            </Link>
            <Link to="/profile" className={isActive('/profile')} onClick={() => setMenuOpen(false)}>
              <User size={15} style={{ marginRight: 4, verticalAlign: -2 }} />
              {user?.name || 'Profile'}
            </Link>
            <button className="pv-btn pv-btn--dark pv-btn--sm" onClick={logout}>
              <LogOut size={14} />
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="pv-footer">
        <div className="pv-container pv-footer-inner">
          <div className="pv-footer__brand">
            <div className="pv-logo" style={{ color: 'var(--color-carbon)' }}>PersonalVault</div>
            <p>Your secure personal digital vault. Manage credentials, expenses, skills, projects, and more — all from one place.</p>
          </div>
          <div className="pv-footer__links">
            <div className="pv-footer__links-title">Features</div>
            <ul>
              <li><Link to="/vault">Vault</Link></li>
              <li><Link to="/expenses">Expenses</Link></li>
              <li><Link to="/skills">Skills</Link></li>
              <li><Link to="/projects">Projects</Link></li>
            </ul>
          </div>
          <div className="pv-footer__links">
            <div className="pv-footer__links-title">More</div>
            <ul>
              <li><Link to="/achievements">Achievements</Link></li>
              <li><Link to="/certificates">Certificates</Link></li>
              <li><Link to="/social">Social Links</Link></li>
              <li><Link to="/resume">Resume</Link></li>
            </ul>
          </div>
          <div className="pv-footer__links">
            <div className="pv-footer__links-title">Account</div>
            <ul>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/home">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="pv-container pv-footer-bottom">
          © {new Date().getFullYear()} PersonalVault · College Microproject
        </div>
      </footer>
    </div>
  );
}
