import type { ResumeContent } from '../types';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

interface TemplateProps {
  content: ResumeContent;
}

export default function ModernTemplate({ content }: TemplateProps) {
  const {
    personalInfo,
    socialLinks,
    skills,
    experience,
    education,
    projects,
    certificates,
    achievements,
    sectionOrder,
    sectionTitles,
    sectionVisibility,
    formatting,
  } = content;

  const enabledSkills = skills.filter((s) => s.enabled);
  const enabledProjects = projects.filter((p) => p.enabled);
  const enabledExperience = experience.filter((e) => e.enabled);
  const enabledEducation = education.filter((e) => e.enabled);
  const enabledCertificates = certificates.filter((c) => c.enabled);
  const enabledAchievements = achievements.filter((a) => a.enabled);
  const enabledSocials = socialLinks.filter((s) => s.enabled);

  const primaryColor = formatting?.primaryColor || 'var(--color-electric-blue)';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const renderSection = (sectionKey: string) => {
    if (sectionVisibility[sectionKey] === false) return null;

    switch (sectionKey) {
      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <div key="summary" className="pv-resume-section pv-resume-section--modern">
            <h2 className="pv-resume-modern-title" style={{ color: primaryColor }}>
              {sectionTitles['summary'] || 'About Me'}
            </h2>
            <p className="pv-resume-text">{personalInfo.summary}</p>
          </div>
        );

      case 'skills':
        if (enabledSkills.length === 0) return null;
        return (
          <div key="skills" className="pv-resume-section pv-resume-section--modern">
            <h2 className="pv-resume-modern-title" style={{ color: primaryColor }}>
              {sectionTitles['skills'] || 'Skills & Expertise'}
            </h2>
            <div className="pv-resume-skills-pills">
              {enabledSkills.map((sk) => (
                <span key={sk.id || sk.name} className="pv-resume-skill-pill">
                  {sk.name}
                  {sk.proficiency && (
                    <span className="pv-resume-skill-pill__level"> · {sk.proficiency.toLowerCase()}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        );

      case 'experience':
        if (enabledExperience.length === 0) return null;
        return (
          <div key="experience" className="pv-resume-section pv-resume-section--modern">
            <h2 className="pv-resume-modern-title" style={{ color: primaryColor }}>
              {sectionTitles['experience'] || 'Experience'}
            </h2>
            <div className="pv-resume-items">
              {enabledExperience.map((exp) => (
                <div key={exp.id} className="pv-resume-modern-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <span className="pv-resume-item__title">{exp.role}</span>
                      <span className="pv-resume-item__subtitle" style={{ color: primaryColor }}> @ {exp.company}</span>
                    </div>
                    <div className="pv-resume-item__date">
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.location && <div className="pv-resume-item__loc">{exp.location}</div>}
                  {exp.description && <p className="pv-resume-text">{exp.description}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="pv-resume-bullets">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (enabledProjects.length === 0) return null;
        return (
          <div key="projects" className="pv-resume-section pv-resume-section--modern">
            <h2 className="pv-resume-modern-title" style={{ color: primaryColor }}>
              {sectionTitles['projects'] || 'Projects'}
            </h2>
            <div className="pv-resume-items">
              {enabledProjects.map((proj) => (
                <div key={proj.id || proj.title} className="pv-resume-modern-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <span className="pv-resume-item__title">{proj.title}</span>
                    </div>
                    <div className="pv-resume-item__date">
                      {proj.startDate && formatDate(proj.startDate)}
                      {proj.endDate && ` – ${formatDate(proj.endDate)}`}
                    </div>
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="pv-resume-tech-tags">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="pv-resume-tech-tag">{t}</span>
                      ))}
                    </div>
                  )}
                  {proj.description && <p className="pv-resume-text">{proj.description}</p>}
                  {proj.liveUrl && (
                    <div className="pv-resume-link-row">
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="pv-resume-link">
                        <ExternalLink size={11} /> {proj.liveUrl}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (enabledEducation.length === 0) return null;
        return (
          <div key="education" className="pv-resume-section pv-resume-section--modern">
            <h2 className="pv-resume-modern-title" style={{ color: primaryColor }}>
              {sectionTitles['education'] || 'Education'}
            </h2>
            <div className="pv-resume-items">
              {enabledEducation.map((edu) => (
                <div key={edu.id} className="pv-resume-modern-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <span className="pv-resume-item__title">{edu.degree}</span>
                      {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                      <span className="pv-resume-item__subtitle"> · {edu.institution}</span>
                    </div>
                    <div className="pv-resume-item__date">
                      {formatDate(edu.startDate)}
                      {edu.endDate && ` – ${edu.current ? 'Present' : formatDate(edu.endDate)}`}
                    </div>
                  </div>
                  {edu.grade && <div className="pv-resume-item__meta">Grade: {edu.grade}</div>}
                  {edu.description && <p className="pv-resume-text">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        if (enabledAchievements.length === 0) return null;
        return (
          <div key="achievements" className="pv-resume-section pv-resume-section--modern">
            <h2 className="pv-resume-modern-title" style={{ color: primaryColor }}>
              {sectionTitles['achievements'] || 'Achievements & Honors'}
            </h2>
            <div className="pv-resume-items">
              {enabledAchievements.map((ach) => (
                <div key={ach.id || ach.title} className="pv-resume-modern-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <span className="pv-resume-item__title">{ach.title}</span>
                      <span className="pv-resume-item__subtitle"> · {ach.organization}</span>
                    </div>
                    <div className="pv-resume-item__date">{formatDate(ach.achievementDate)}</div>
                  </div>
                  {ach.description && <p className="pv-resume-text">{ach.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'certificates':
        if (enabledCertificates.length === 0) return null;
        return (
          <div key="certificates" className="pv-resume-section pv-resume-section--modern">
            <h2 className="pv-resume-modern-title" style={{ color: primaryColor }}>
              {sectionTitles['certificates'] || 'Certifications'}
            </h2>
            <div className="pv-resume-items">
              {enabledCertificates.map((cert) => (
                <div key={cert.id || cert.title} className="pv-resume-modern-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <span className="pv-resume-item__title">{cert.title}</span>
                      <span className="pv-resume-item__subtitle"> · {cert.issuer}</span>
                    </div>
                    <div className="pv-resume-item__date">{formatDate(cert.issueDate)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pv-resume-sheet pv-resume-sheet--modern">
      {/* ── Modern Header ───────────────────────────────────── */}
      <header className="pv-resume-header pv-resume-header--modern" style={{ borderBottomColor: primaryColor }}>
        <h1 className="pv-resume-name" style={{ color: primaryColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.headline && (
          <div className="pv-resume-headline">{personalInfo.headline}</div>
        )}

        <div className="pv-resume-contact-row">
          {personalInfo.email && (
            <span className="pv-resume-contact-item">
              <Mail size={12} />
              <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
            </span>
          )}
          {personalInfo.phone && (
            <span className="pv-resume-contact-item">
              <Phone size={12} />
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.location && (
            <span className="pv-resume-contact-item">
              <MapPin size={12} />
              <span>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.website && (
            <span className="pv-resume-contact-item">
              <Globe size={12} />
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </span>
          )}
          {enabledSocials.map((soc) => (
            <span key={soc.id || soc.label} className="pv-resume-contact-item">
              <ExternalLink size={12} />
              <a href={soc.url} target="_blank" rel="noopener noreferrer">
                {soc.label}
              </a>
            </span>
          ))}
        </div>
      </header>

      {/* ── Dynamic Sections ─────────────────────────────────── */}
      <main className="pv-resume-body">
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </main>
    </div>
  );
}
