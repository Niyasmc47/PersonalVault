import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Lock,
  Wallet,
  Award,
  Briefcase,
  Trophy,
  GraduationCap,
  Link as LinkIcon,
  FileText,
  ArrowRight,
  Shield,
  User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ── Feature definitions ─────────────────────────────────── */
interface Feature {
  path: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

const FEATURES: Feature[] = [
  {
    path: '/vault',
    name: 'Vault',
    description: 'Store and manage sensitive personal information with encryption-level security.',
    icon: Lock,
  },
  {
    path: '/expenses',
    name: 'Expenses',
    description: 'Track daily expenses, set budgets, and gain insights into your spending habits.',
    icon: Wallet,
  },
  {
    path: '/skills',
    name: 'Skills',
    description: 'Catalog your technical and soft skills with proficiency levels and categories.',
    icon: Award,
  },
  {
    path: '/projects',
    name: 'Projects',
    description: 'Organize academic and personal projects with descriptions, links, and status tracking.',
    icon: Briefcase,
  },
  {
    path: '/achievements',
    name: 'Achievements',
    description: 'Record academic awards, hackathon wins, and professional milestones in one place.',
    icon: Trophy,
  },
  {
    path: '/certificates',
    name: 'Certificates',
    description: 'Manage certifications and credentials with issue dates, providers, and verification links.',
    icon: GraduationCap,
  },
  {
    path: '/social',
    name: 'Social Links',
    description: 'Consolidate GitHub, LinkedIn, portfolio, and other professional profile links.',
    icon: LinkIcon,
  },
  {
    path: '/resume',
    name: 'Resume',
    description: 'Build and maintain your resume data that feeds directly into generated documents.',
    icon: FileText,
  },
];

/* ── Quick access items ──────────────────────────────────── */
const QUICK_ACCESS = [
  { path: '/vault', label: 'Open Vault', icon: Shield },
  { path: '/expenses', label: 'Track Expenses', icon: Wallet },
  { path: '/skills', label: 'My Skills', icon: Award },
  { path: '/profile', label: 'Account Settings', icon: User },
];

/* ── Component ───────────────────────────────────────────── */
export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      {/* ── 1. Hero Section ────────────────────────────────── */}
      <section className="pv-hero" style={{ margin: 'var(--sp-24) auto', maxWidth: 'var(--page-max)' }}>
        <div className="pv-section-eyebrow" style={{ color: 'var(--color-signal-blue)', marginBottom: 'var(--sp-16)' }}>
          Welcome back, {user?.name || 'User'}
        </div>
        <h1>Your Personal Digital Vault</h1>
        <p>
          One secure place for your credentials, finances, skills, projects, and career data.
          PersonalVault keeps everything organized so you can focus on what matters.
        </p>
        <div style={{ display: 'flex', gap: 'var(--sp-12)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/vault" className="pv-btn pv-btn--light">
            Open Vault
            <ArrowRight size={16} />
          </Link>
          <Link to="#features" className="pv-btn" style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--color-paper-white)', border: '1px solid rgba(255,255,255,0.15)' }}>
            Explore Features
          </Link>
        </div>
      </section>

      <div className="pv-container">
        {/* ── 2. Quick Access ──────────────────────────────── */}
        <section style={{ marginBottom: 'var(--section-gap)' }}>
          <div className="pv-section-eyebrow">Quick Access</div>
          <div className="pv-quick-row">
            {QUICK_ACCESS.map((item) => (
              <Link key={item.path} to={item.path} className="pv-quick-pill">
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. Feature Overview ──────────────────────────── */}
        <section id="features" style={{ marginBottom: 'var(--section-gap)' }}>
          <div className="pv-section-eyebrow">Everything you need</div>
          <h2 className="pv-section-title">All your data, one vault.</h2>
          <p className="pv-section-subtitle" style={{ marginBottom: 'var(--sp-36)' }}>
            PersonalVault is organized into focused modules. Each one is independently managed so your team can build and extend features without conflicts.
          </p>

          <div className="pv-features-grid">
            {FEATURES.map((f) => (
              <Link key={f.path} to={f.path} className="pv-feature-card">
                <div className="pv-feature-card__icon">
                  <f.icon size={22} color="var(--color-ink-black)" />
                </div>
                <div className="pv-feature-card__name">{f.name}</div>
                <div className="pv-feature-card__desc">{f.description}</div>
                <div className="pv-feature-card__action">
                  Open {f.name} <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 4. Account Section ───────────────────────────── */}
        <section style={{ marginBottom: 'var(--section-gap)' }}>
          <div className="pv-section-eyebrow">Your Account</div>
          <div className="pv-account-bar">
            <div className="pv-account-bar__info">
              <div className="pv-account-bar__name">{user?.name || 'User'}</div>
              <div className="pv-account-bar__meta">
                <span>{user?.email}</span>
                <span className="pv-account-bar__badge">
                  {user?.provider === 'GOOGLE' ? '● Google' : '● Local'}
                </span>
              </div>
            </div>
            <Link to="/profile" className="pv-btn pv-btn--ghost">
              <User size={16} />
              Manage Profile
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
