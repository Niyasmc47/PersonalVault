import type { ResumeContent } from '../types';

interface TemplateProps {
  content: ResumeContent;
}

export default function AcademicTemplate({ content }: TemplateProps) {
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
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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
          <div key="summary" className="pv-resume-section pv-resume-section--academic">
            <h2 className="pv-resume-academic-title">
              {sectionTitles['summary'] || 'Research Interests & Profile'}
            </h2>
            <p className="pv-resume-text" style={{ textAlign: 'justify' }}>{personalInfo.summary}</p>
          </div>
        );

      case 'education':
        if (enabledEducation.length === 0) return null;
        return (
          <div key="education" className="pv-resume-section pv-resume-section--academic">
            <h2 className="pv-resume-academic-title">
              {sectionTitles['education'] || 'Education & Credentials'}
            </h2>
            <div className="pv-resume-items">
              {enabledEducation.map((edu) => (
                <div key={edu.id} className="pv-resume-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <span style={{ fontWeight: 700 }}>{edu.institution}</span>
                      <div>
                        {edu.degree} {edu.fieldOfStudy && <span>in {edu.fieldOfStudy}</span>}
                      </div>
                    </div>
                    <div className="pv-resume-item__date">
                      {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </div>
                  </div>
                  {edu.grade && <div style={{ fontSize: '13px', fontStyle: 'italic' }}>Cumulative GPA: {edu.grade}</div>}
                  {edu.description && <p className="pv-resume-text">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        if (enabledAchievements.length === 0) return null;
        return (
          <div key="achievements" className="pv-resume-section pv-resume-section--academic">
            <h2 className="pv-resume-academic-title">
              {sectionTitles['achievements'] || 'Honors, Awards & Publications'}
            </h2>
            <div className="pv-resume-items">
              {enabledAchievements.map((ach) => (
                <div key={ach.id || ach.title} className="pv-resume-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <span style={{ fontWeight: 700 }}>{ach.title}</span>
                      <span style={{ fontStyle: 'italic' }}> — {ach.organization}</span>
                    </div>
                    <div className="pv-resume-item__date">{formatDate(ach.achievementDate)}</div>
                  </div>
                  {ach.description && <p className="pv-resume-text">{ach.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'experience':
        if (enabledExperience.length === 0) return null;
        return (
          <div key="experience" className="pv-resume-section pv-resume-section--academic">
            <h2 className="pv-resume-academic-title">
              {sectionTitles['experience'] || 'Academic & Professional Experience'}
            </h2>
            <div className="pv-resume-items">
              {enabledExperience.map((exp) => (
                <div key={exp.id} className="pv-resume-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <span style={{ fontWeight: 700 }}>{exp.role}</span>
                      <span style={{ fontStyle: 'italic' }}>, {exp.company}</span>
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
          <div key="projects" className="pv-resume-section pv-resume-section--academic">
            <h2 className="pv-resume-academic-title">
              {sectionTitles['projects'] || 'Research & Key Projects'}
            </h2>
            <div className="pv-resume-items">
              {enabledProjects.map((proj) => (
                <div key={proj.id || proj.title} className="pv-resume-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <span style={{ fontWeight: 700 }}>{proj.title}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span style={{ fontStyle: 'italic' }}> ({proj.technologies.join(', ')})</span>
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

      case 'skills':
        if (enabledSkills.length === 0) return null;
        return (
          <div key="skills" className="pv-resume-section pv-resume-section--academic">
            <h2 className="pv-resume-academic-title">
              {sectionTitles['skills'] || 'Technical & Methodological Proficiencies'}
            </h2>
            <p className="pv-resume-text">
              {enabledSkills.map((s) => s.name).join(' · ')}
            </p>
          </div>
        );

      case 'certificates':
        if (enabledCertificates.length === 0) return null;
        return (
          <div key="certificates" className="pv-resume-section pv-resume-section--academic">
            <h2 className="pv-resume-academic-title">
              {sectionTitles['certificates'] || 'Certifications & Accreditations'}
            </h2>
            <div className="pv-resume-items">
              {enabledCertificates.map((cert) => (
                <div key={cert.id || cert.title} className="pv-resume-item">
                  <div className="pv-resume-item__header">
                    <div>
                      <span style={{ fontWeight: 700 }}>{cert.title}</span>
                      <span style={{ fontStyle: 'italic' }}> — {cert.issuer}</span>
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

  const contactList: string[] = [];
  if (personalInfo.email) contactList.push(personalInfo.email);
  if (personalInfo.phone) contactList.push(personalInfo.phone);
  if (personalInfo.location) contactList.push(personalInfo.location);
  if (personalInfo.website) contactList.push(personalInfo.website);
  enabledSocials.forEach((s) => contactList.push(s.label));

  return (
    <div className="pv-resume-sheet pv-resume-sheet--academic">
      <header style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '26px', fontWeight: 'bold', margin: '0 0 6px 0', letterSpacing: '0.04em' }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.headline && (
          <div style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '15px', marginBottom: '6px' }}>
            {personalInfo.headline}
          </div>
        )}
        <div style={{ fontSize: '12px', fontStyle: 'italic' }}>
          {contactList.join('  •  ')}
        </div>
      </header>

      <main>
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </main>
    </div>
  );
}
