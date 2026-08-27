import { Link } from 'react-router-dom';
// import { useAuth } from '../../../contexts/AuthContext';
import {
  Lock,
  Wallet,
  Award,
  Briefcase,
  Trophy,
  GraduationCap,
  Link as LinkIcon,
  FileText,
  // User
} from 'lucide-react';

export default function HomePage() {
  // const { user } = useAuth();

  return (
    <div>
      {/* ── Marquee ──────────────────────────────────────── */}
      <div className="pv-marquee">
        <p>ALL YOUR DATA · ONE VAULT · SECURE AND PRIVATE · ALL YOUR DATA · ONE VAULT · SECURE AND PRIVATE · ALL YOUR DATA · ONE VAULT · SECURE AND PRIVATE · ALL YOUR DATA · ONE VAULT · SECURE AND PRIVATE · ALL YOUR DATA · ONE VAULT · SECURE AND PRIVATE</p>
      </div>

      {/* ── 1. Hero Poster ─────────────────────────────────── */}
      <section className="pv-hero">
        <div className="pv-hero-content" style={{ position: 'relative', zIndex: 10 }}>
          <h1>PERSONAL VAULT</h1>
          <p>
            One secure place for your credentials, finances, skills, projects, and career data.
          </p>
          <div style={{ display: 'flex', gap: 'var(--sp-12)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#portfolio"
              className="pv-btn pv-btn--dark"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Features
            </a>
            <Link to="/resume" className="pv-btn pv-btn--light">
              Get Resume
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Core Modules (Concrete Gray) ────────────────── */}
      <section id="features" className="pv-section pv-section--gray" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="pv-container" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center' }}>

            <div style={{ flex: '1 1 400px' }}>
              <h2 className="pv-section-title" style={{ textAlign: 'left', marginBottom: '24px' }}>CORE<br />TOOLS</h2>
              <p style={{ fontSize: '24px', maxWidth: '400px', marginBottom: '32px' }}>
                Secure everything. Track anything. The essential modules to keep your digital life intact.
              </p>
            </div>

            <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Link to="/vault" className="pv-feature-card" style={{ transform: 'rotate(-2deg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="pv-feature-card__icon" style={{ background: 'var(--color-mint-pop)' }}>
                    <Lock size={22} color="var(--color-carbon)" strokeWidth={2.5} />
                  </div>
                  <div className="pv-feature-card__name">Secure Vault</div>
                </div>
                <div className="pv-feature-card__desc">Store and manage sensitive personal information with encryption-level security. No one else has access.</div>
              </Link>

              <Link to="/expenses" className="pv-feature-card" style={{ transform: 'rotate(1deg)', alignSelf: 'flex-end', width: '90%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="pv-feature-card__icon" style={{ background: 'var(--color-sunburst)' }}>
                    <Wallet size={22} color="var(--color-carbon)" strokeWidth={2.5} />
                  </div>
                  <div className="pv-feature-card__name">Expense Tracker</div>
                </div>
                <div className="pv-feature-card__desc">Track daily expenses, set budgets, and gain insights into your spending habits effortlessly.</div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Career & Portfolio (Paper White) ────────────── */}
      <section id="portfolio" className="pv-section pv-section--white" style={{ minHeight: '80vh', padding: '120px 0' }}>
        <div className="pv-container">
          <h2 className="pv-section-title" style={{ textAlign: 'center', marginBottom: '64px' }}>YOUR<br />PORTFOLIO</h2>

          <div className="pv-features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

            <Link to="/vault" className="pv-feature-card" style={{ background: 'var(--color-soft-mist)', borderRadius: '40px' }}>
              <div className="pv-feature-card__icon" style={{ background: 'var(--color-paper-white)' }}>
                <Lock size={22} color="var(--color-carbon)" strokeWidth={2.5} />
              </div>
              <div className="pv-feature-card__name">Secure Vault</div>
              <div className="pv-feature-card__desc">Store and manage sensitive personal information with encryption-level security.</div>
            </Link>

            <Link to="/expenses" className="pv-feature-card" style={{ background: 'var(--color-soft-mist)', borderRadius: '40px' }}>
              <div className="pv-feature-card__icon" style={{ background: 'var(--color-paper-white)' }}>
                <Wallet size={22} color="var(--color-carbon)" strokeWidth={2.5} />
              </div>
              <div className="pv-feature-card__name">Expense Tracker</div>
              <div className="pv-feature-card__desc">Track daily expenses, set budgets, and gain insights into your spending habits.</div>
            </Link>

            <Link to="/skills" className="pv-feature-card" style={{ background: 'var(--color-soft-mist)', borderRadius: '40px' }}>
              <div className="pv-feature-card__icon" style={{ background: 'var(--color-paper-white)' }}>
                <Award size={22} color="var(--color-carbon)" strokeWidth={2.5} />
              </div>
              <div className="pv-feature-card__name">Skills</div>
              <div className="pv-feature-card__desc">Catalog your technical and soft skills with proficiency levels.</div>
            </Link>

            <Link to="/projects" className="pv-feature-card" style={{ background: 'var(--color-soft-mist)', borderRadius: '40px' }}>
              <div className="pv-feature-card__icon" style={{ background: 'var(--color-paper-white)' }}>
                <Briefcase size={22} color="var(--color-carbon)" strokeWidth={2.5} />
              </div>
              <div className="pv-feature-card__name">Projects</div>
              <div className="pv-feature-card__desc">Organize academic and personal projects with status tracking.</div>
            </Link>

            <Link to="/achievements" className="pv-feature-card" style={{ background: 'var(--color-soft-mist)', borderRadius: '40px' }}>
              <div className="pv-feature-card__icon" style={{ background: 'var(--color-paper-white)' }}>
                <Trophy size={22} color="var(--color-carbon)" strokeWidth={2.5} />
              </div>
              <div className="pv-feature-card__name">Achievements</div>
              <div className="pv-feature-card__desc">Record awards, hackathon wins, and professional milestones.</div>
            </Link>

            <Link to="/certificates" className="pv-feature-card" style={{ background: 'var(--color-soft-mist)', borderRadius: '40px' }}>
              <div className="pv-feature-card__icon" style={{ background: 'var(--color-paper-white)' }}>
                <GraduationCap size={22} color="var(--color-carbon)" strokeWidth={2.5} />
              </div>
              <div className="pv-feature-card__name">Certificates</div>
              <div className="pv-feature-card__desc">Manage certifications and credentials with verification links.</div>
            </Link>

            <Link to="/social" className="pv-feature-card" style={{ background: 'var(--color-soft-mist)', borderRadius: '40px' }}>
              <div className="pv-feature-card__icon" style={{ background: 'var(--color-paper-white)' }}>
                <LinkIcon size={22} color="var(--color-carbon)" strokeWidth={2.5} />
              </div>
              <div className="pv-feature-card__name">Social Links</div>
              <div className="pv-feature-card__desc">Consolidate GitHub, LinkedIn, and professional profile links.</div>
            </Link>

            <Link to="/resume" className="pv-feature-card" style={{ background: 'var(--color-electric-blue)', color: 'var(--color-paper-white)', borderRadius: '40px' }}>
              <div className="pv-feature-card__icon" style={{ background: 'var(--color-paper-white)' }}>
                <FileText size={22} color="var(--color-carbon)" strokeWidth={2.5} />
              </div>
              <div className="pv-feature-card__name">Resume Builder</div>
              <div className="pv-feature-card__desc" style={{ color: 'var(--color-paper-white)' }}>Build and maintain your resume data that feeds directly into generated documents.</div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── 4. Account Section ───────────────────────────── */}
      {/* <section className="pv-section pv-section--blue" style={{ borderTop: '1px solid var(--color-carbon)', padding: '80px 0' }}>
        <div className="pv-container">
          <div className="pv-account-bar" style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--color-paper-white)', borderRadius: '40px' }}>
            <div className="pv-account-bar__info">
              <div className="pv-account-bar__name">{user?.name || 'User Account'}</div>
              <div className="pv-account-bar__meta">
                <span>{user?.email}</span>
              </div>
            </div>
            <Link to="/profile" className="pv-btn pv-btn--dark">
              <User size={16} strokeWidth={2.5} />
              Manage Profile
            </Link>
          </div>
        </div>
      </section> */}
    </div>
  );
}
