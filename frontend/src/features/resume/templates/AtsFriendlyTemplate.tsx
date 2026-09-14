import type { ResumeContent } from '../types';

interface TemplateProps {
  content: ResumeContent;
}

export default function AtsFriendlyTemplate({ content }: TemplateProps) {
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
          <div key="summary" className="pv-resume-ats-section">
            <h2 className="pv-resume-ats-heading">
              {sectionTitles['summary']?.toUpperCase() || 'PROFESSIONAL SUMMARY'}
            </h2>
            <hr className="pv-resume-ats-hr" />
            <p className="pv-resume-ats-text">{personalInfo.summary}</p>
          </div>
        );

      case 'skills':
        if (enabledSkills.length === 0) return null;
        const groupedSkills: Record<string, string[]> = {};
        enabledSkills.forEach((sk) => {
          const cat = sk.category || 'OTHER';
          if (!groupedSkills[cat]) groupedSkills[cat] = [];
          groupedSkills[cat].push(sk.name);
        });

        return (
          <div key="skills" className="pv-resume-ats-section">
            <h2 className="pv-resume-ats-heading">
              {sectionTitles['skills']?.toUpperCase() || 'TECHNICAL SKILLS'}
            </h2>
            <hr className="pv-resume-ats-hr" />
            <div className="pv-resume-ats-text">
              {Object.entries(groupedSkills).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: '4px' }}>
                  <strong>{cat.replace(/_/g, ' ')}:</strong> {items.join(', ')}
                </div>
              ))}
            </div>
          </div>
        );

      case 'experience':
        if (enabledExperience.length === 0) return null;
        return (
          <div key="experience" className="pv-resume-ats-section">
            <h2 className="pv-resume-ats-heading">
              {sectionTitles['experience']?.toUpperCase() || 'PROFESSIONAL EXPERIENCE'}
            </h2>
            <hr className="pv-resume-ats-hr" />
            {enabledExperience.map((exp) => (
              <div key={exp.id} className="pv-resume-ats-item">
                <div className="pv-resume-ats-item-row">
                  <strong>{exp.role}</strong> — {exp.company}
                  {exp.location && <span>, {exp.location}</span>}
                  <span className="pv-resume-ats-date">
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && <p className="pv-resume-ats-text">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="pv-resume-ats-bullets">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case 'projects':
        if (enabledProjects.length === 0) return null;
        return (
          <div key="projects" className="pv-resume-ats-section">
            <h2 className="pv-resume-ats-heading">
              {sectionTitles['projects']?.toUpperCase() || 'PROJECTS'}
            </h2>
            <hr className="pv-resume-ats-hr" />
            {enabledProjects.map((proj) => (
              <div key={proj.id || proj.title} className="pv-resume-ats-item">
                <div className="pv-resume-ats-item-row">
                  <strong>{proj.title}</strong>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span> | Technologies: {proj.technologies.join(', ')}</span>
                  )}
                  {proj.startDate && (
                    <span className="pv-resume-ats-date">{formatDate(proj.startDate)}</span>
                  )}
                </div>
                {proj.description && <p className="pv-resume-ats-text">{proj.description}</p>}
                {proj.liveUrl && <div className="pv-resume-ats-text">Link: {proj.liveUrl}</div>}
              </div>
            ))}
          </div>
        );

      case 'education':
        if (enabledEducation.length === 0) return null;
        return (
          <div key="education" className="pv-resume-ats-section">
            <h2 className="pv-resume-ats-heading">
              {sectionTitles['education']?.toUpperCase() || 'EDUCATION'}
            </h2>
            <hr className="pv-resume-ats-hr" />
            {enabledEducation.map((edu) => (
              <div key={edu.id} className="pv-resume-ats-item">
                <div className="pv-resume-ats-item-row">
                  <strong>{edu.institution}</strong>
                  <span className="pv-resume-ats-date">
                    {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="pv-resume-ats-text">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  {edu.grade && ` | GPA: ${edu.grade}`}
                </div>
                {edu.description && <p className="pv-resume-ats-text">{edu.description}</p>}
              </div>
            ))}
          </div>
        );

      case 'achievements':
        if (enabledAchievements.length === 0) return null;
        return (
          <div key="achievements" className="pv-resume-ats-section">
            <h2 className="pv-resume-ats-heading">
              {sectionTitles['achievements']?.toUpperCase() || 'HONORS & AWARDS'}
            </h2>
            <hr className="pv-resume-ats-hr" />
            {enabledAchievements.map((ach) => (
              <div key={ach.id || ach.title} className="pv-resume-ats-item">
                <div className="pv-resume-ats-item-row">
                  <strong>{ach.title}</strong> — {ach.organization}
                  <span className="pv-resume-ats-date">{formatDate(ach.achievementDate)}</span>
                </div>
                {ach.description && <p className="pv-resume-ats-text">{ach.description}</p>}
              </div>
            ))}
          </div>
        );

      case 'certificates':
        if (enabledCertificates.length === 0) return null;
        return (
          <div key="certificates" className="pv-resume-ats-section">
            <h2 className="pv-resume-ats-heading">
              {sectionTitles['certificates']?.toUpperCase() || 'CERTIFICATIONS'}
            </h2>
            <hr className="pv-resume-ats-hr" />
            {enabledCertificates.map((cert) => (
              <div key={cert.id || cert.title} className="pv-resume-ats-item">
                <div className="pv-resume-ats-item-row">
                  <strong>{cert.title}</strong> — {cert.issuer}
                  <span className="pv-resume-ats-date">{formatDate(cert.issueDate)}</span>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const contactList: string[] = [];
  if (personalInfo.email) contactList.push(personalInfo.email);
  if (personalInfo.phone) contactList.push(personalInfo.phone);
  if (personalInfo.location) contactList.push(personalInfo.location);
  if (personalInfo.website) contactList.push(personalInfo.website);
  enabledSocials.forEach((s) => contactList.push(`${s.label}: ${s.url}`));

  return (
    <div className="pv-resume-sheet pv-resume-sheet--ats">
      <header style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.headline && (
          <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
            {personalInfo.headline}
          </div>
        )}
        <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
          {contactList.join(' | ')}
        </div>
      </header>

      <main>
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </main>
    </div>
  );
}
