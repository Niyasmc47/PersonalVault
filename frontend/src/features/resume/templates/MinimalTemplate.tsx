import type { ResumeContent } from '../types';

interface TemplateProps {
  content: ResumeContent;
}

export default function MinimalTemplate({ content }: TemplateProps) {
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
  } = content;

  const enabledSkills = skills.filter((s) => s.enabled);
  const enabledProjects = projects.filter((p) => p.enabled);
  const enabledExperience = experience.filter((e) => e.enabled);
  const enabledEducation = education.filter((e) => e.enabled);
  const enabledCertificates = certificates.filter((c) => c.enabled);
  const enabledAchievements = achievements.filter((a) => a.enabled);
  const enabledSocials = socialLinks.filter((s) => s.enabled);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });
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
          <div key="summary" className="pv-resume-section pv-resume-section--minimal">
            <h2 className="pv-resume-minimal-title">
              {sectionTitles['summary'] || 'Profile'}
            </h2>
            <p className="pv-resume-text">{personalInfo.summary}</p>
          </div>
        );

      case 'skills':
        if (enabledSkills.length === 0) return null;
        return (
          <div key="skills" className="pv-resume-section pv-resume-section--minimal">
            <h2 className="pv-resume-minimal-title">
              {sectionTitles['skills'] || 'Skills'}
            </h2>
            <p className="pv-resume-text">
              {enabledSkills.map((s) => s.name).join(' · ')}
            </p>
          </div>
        );

      case 'experience':
        if (enabledExperience.length === 0) return null;
        return (
          <div key="experience" className="pv-resume-section pv-resume-section--minimal">
            <h2 className="pv-resume-minimal-title">
              {sectionTitles['experience'] || 'Experience'}
            </h2>
            <div className="pv-resume-items">
              {enabledExperience.map((exp) => (
                <div key={exp.id} className="pv-resume-minimal-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <strong>{exp.role}</strong>, {exp.company}
                    </div>
                    <div className="pv-resume-item__date">
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
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
          <div key="projects" className="pv-resume-section pv-resume-section--minimal">
            <h2 className="pv-resume-minimal-title">
              {sectionTitles['projects'] || 'Projects'}
            </h2>
            <div className="pv-resume-items">
              {enabledProjects.map((proj) => (
                <div key={proj.id || proj.title} className="pv-resume-minimal-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <strong>{proj.title}</strong>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span> — {proj.technologies.join(', ')}</span>
                      )}
                    </div>
                    <div className="pv-resume-item__date">
                      {proj.startDate && formatDate(proj.startDate)}
                    </div>
                  </div>
                  {proj.description && <p className="pv-resume-text">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (enabledEducation.length === 0) return null;
        return (
          <div key="education" className="pv-resume-section pv-resume-section--minimal">
            <h2 className="pv-resume-minimal-title">
              {sectionTitles['education'] || 'Education'}
            </h2>
            <div className="pv-resume-items">
              {enabledEducation.map((edu) => (
                <div key={edu.id} className="pv-resume-minimal-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <strong>{edu.degree}</strong>, {edu.institution}
                    </div>
                    <div className="pv-resume-item__date">
                      {formatDate(edu.startDate)}
                      {edu.endDate && ` – ${edu.current ? 'Present' : formatDate(edu.endDate)}`}
                    </div>
                  </div>
                  {edu.description && <p className="pv-resume-text">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        if (enabledAchievements.length === 0) return null;
        return (
          <div key="achievements" className="pv-resume-section pv-resume-section--minimal">
            <h2 className="pv-resume-minimal-title">
              {sectionTitles['achievements'] || 'Achievements'}
            </h2>
            <div className="pv-resume-items">
              {enabledAchievements.map((ach) => (
                <div key={ach.id || ach.title} className="pv-resume-minimal-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <strong>{ach.title}</strong> — {ach.organization}
                    </div>
                    <div className="pv-resume-item__date">{formatDate(ach.achievementDate)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certificates':
        if (enabledCertificates.length === 0) return null;
        return (
          <div key="certificates" className="pv-resume-section pv-resume-section--minimal">
            <h2 className="pv-resume-minimal-title">
              {sectionTitles['certificates'] || 'Certifications'}
            </h2>
            <div className="pv-resume-items">
              {enabledCertificates.map((cert) => (
                <div key={cert.id || cert.title} className="pv-resume-minimal-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <strong>{cert.title}</strong> — {cert.issuer}
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

  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.website) contactParts.push(personalInfo.website.replace(/^https?:\/\//, ''));
  enabledSocials.forEach((soc) => contactParts.push(soc.label));

  return (
    <div className="pv-resume-sheet pv-resume-sheet--minimal">
      <header className="pv-resume-header pv-resume-header--minimal">
        <h1 className="pv-resume-name">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.headline && (
          <div className="pv-resume-headline" style={{ fontStyle: 'italic', marginBottom: '8px' }}>
            {personalInfo.headline}
          </div>
        )}
        <div className="pv-resume-text" style={{ fontSize: '12px', opacity: 0.8 }}>
          {contactParts.join('  ·  ')}
        </div>
      </header>

      <main className="pv-resume-body" style={{ marginTop: '20px' }}>
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </main>
    </div>
  );
}
