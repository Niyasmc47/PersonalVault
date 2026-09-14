import { useState } from 'react';
import type {
  ResumeContent,
  ResumeTemplate,
  ResumeExperience,
  ResumeEducation,
} from '../types';
import {
  User,
  Award,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Trophy,
  Link as LinkIcon,
  Layers,
  Palette,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';

interface ResumeEditorControlsProps {
  content: ResumeContent;
  template: ResumeTemplate;
  onChange: (updatedContent: ResumeContent) => void;
  onTemplateChange: (template: ResumeTemplate) => void;
}

type TabType =
  | 'personal'
  | 'skills'
  | 'experience'
  | 'education'
  | 'projects'
  | 'certificates'
  | 'achievements'
  | 'social'
  | 'sections'
  | 'design';

export default function ResumeEditorControls({
  content,
  template,
  onChange,
  onTemplateChange,
}: ResumeEditorControlsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  // --- Personal Info Handlers ---
  const handlePersonalInfoChange = (field: string, value: string) => {
    onChange({
      ...content,
      personalInfo: {
        ...content.personalInfo,
        [field]: value,
      },
    });
  };

  // --- Skills Handlers ---
  const handleToggleSkill = (index: number) => {
    const updatedSkills = [...content.skills];
    updatedSkills[index].enabled = !updatedSkills[index].enabled;
    onChange({ ...content, skills: updatedSkills });
  };

  const handleUpdateSkill = (index: number, name: string) => {
    const updatedSkills = [...content.skills];
    updatedSkills[index].name = name;
    onChange({ ...content, skills: updatedSkills });
  };

  const handleAddCustomSkill = () => {
    const newSkill = {
      name: 'New Skill',
      category: 'OTHER' as const,
      proficiency: 'INTERMEDIATE' as const,
      enabled: true,
    };
    onChange({ ...content, skills: [...content.skills, newSkill] });
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = content.skills.filter((_, i) => i !== index);
    onChange({ ...content, skills: updatedSkills });
  };

  // --- Experience Handlers ---
  const handleAddExperience = () => {
    const newExp: ResumeExperience = {
      id: Math.random().toString(36).substring(2, 9),
      company: 'Company / Organization',
      role: 'Role / Job Title',
      location: 'City, Country',
      startDate: new Date().toISOString().split('T')[0],
      current: true,
      description: 'Describe your key impact, responsibilities, and achievements.',
      highlights: ['Led key engineering initiatives', 'Optimized performance by 30%'],
      enabled: true,
    };
    onChange({ ...content, experience: [newExp, ...content.experience] });
  };

  const handleUpdateExperience = (index: number, updated: ResumeExperience) => {
    const list = [...content.experience];
    list[index] = updated;
    onChange({ ...content, experience: list });
  };

  const handleDeleteExperience = (index: number) => {
    const list = content.experience.filter((_, i) => i !== index);
    onChange({ ...content, experience: list });
  };

  // --- Education Handlers ---
  const handleAddEducation = () => {
    const newEdu: ResumeEducation = {
      id: Math.random().toString(36).substring(2, 9),
      institution: 'University / College',
      degree: 'Bachelor of Technology',
      fieldOfStudy: 'Computer Science',
      startDate: '2022-09-01',
      endDate: '2026-06-01',
      current: true,
      grade: '8.8 GPA',
      description: '',
      enabled: true,
    };
    onChange({ ...content, education: [newEdu, ...content.education] });
  };

  const handleUpdateEducation = (index: number, updated: ResumeEducation) => {
    const list = [...content.education];
    list[index] = updated;
    onChange({ ...content, education: list });
  };

  const handleDeleteEducation = (index: number) => {
    const list = content.education.filter((_, i) => i !== index);
    onChange({ ...content, education: list });
  };

  // --- Projects Handlers ---
  const handleToggleProject = (index: number) => {
    const list = [...content.projects];
    list[index].enabled = !list[index].enabled;
    onChange({ ...content, projects: list });
  };

  const handleUpdateProjectDesc = (index: number, description: string) => {
    const list = [...content.projects];
    list[index].description = description;
    onChange({ ...content, projects: list });
  };

  // --- Certificates Handlers ---
  const handleToggleCertificate = (index: number) => {
    const list = [...content.certificates];
    list[index].enabled = !list[index].enabled;
    onChange({ ...content, certificates: list });
  };

  // --- Achievements Handlers ---
  const handleToggleAchievement = (index: number) => {
    const list = [...content.achievements];
    list[index].enabled = !list[index].enabled;
    onChange({ ...content, achievements: list });
  };

  const handleUpdateAchievementDesc = (index: number, description: string) => {
    const list = [...content.achievements];
    list[index].description = description;
    onChange({ ...content, achievements: list });
  };

  // --- Social Links Handlers ---
  const handleToggleSocial = (index: number) => {
    const list = [...content.socialLinks];
    list[index].enabled = !list[index].enabled;
    onChange({ ...content, socialLinks: list });
  };

  // --- Section Ordering & Visibility ---
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const order = [...content.sectionOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= order.length) return;
    const [moved] = order.splice(index, 1);
    order.splice(targetIdx, 0, moved);
    onChange({ ...content, sectionOrder: order });
  };

  const handleToggleSectionVisibility = (key: string) => {
    const visibility = { ...content.sectionVisibility };
    visibility[key] = visibility[key] === false ? true : false;
    onChange({ ...content, sectionVisibility: visibility });
  };

  const handleUpdateSectionTitle = (key: string, title: string) => {
    const titles = { ...content.sectionTitles };
    titles[key] = title;
    onChange({ ...content, sectionTitles: titles });
  };

  return (
    <div className="pv-resume-editor">
      {/* ── Editor Navigation Tabs ────────────────────────── */}
      <div className="pv-resume-tabs">
        <button
          type="button"
          className={`pv-resume-tab-btn ${activeTab === 'personal' ? 'pv-resume-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <User size={15} />
          <span>Profile</span>
        </button>

        <button
          type="button"
          className={`pv-resume-tab-btn ${activeTab === 'skills' ? 'pv-resume-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <Award size={15} />
          <span>Skills ({content.skills.filter((s) => s.enabled).length})</span>
        </button>

        <button
          type="button"
          className={`pv-resume-tab-btn ${activeTab === 'experience' ? 'pv-resume-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('experience')}
        >
          <Briefcase size={15} />
          <span>Experience ({content.experience.filter((e) => e.enabled).length})</span>
        </button>

        <button
          type="button"
          className={`pv-resume-tab-btn ${activeTab === 'education' ? 'pv-resume-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('education')}
        >
          <GraduationCap size={15} />
          <span>Education ({content.education.filter((e) => e.enabled).length})</span>
        </button>

        <button
          type="button"
          className={`pv-resume-tab-btn ${activeTab === 'projects' ? 'pv-resume-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <FolderGit2 size={15} />
          <span>Projects ({content.projects.filter((p) => p.enabled).length})</span>
        </button>

        <button
          type="button"
          className={`pv-resume-tab-btn ${activeTab === 'certificates' ? 'pv-resume-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          <GraduationCap size={15} />
          <span>Certificates ({content.certificates.filter((c) => c.enabled).length})</span>
        </button>

        <button
          type="button"
          className={`pv-resume-tab-btn ${activeTab === 'achievements' ? 'pv-resume-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <Trophy size={15} />
          <span>Achievements ({content.achievements.filter((a) => a.enabled).length})</span>
        </button>

        <button
          type="button"
          className={`pv-resume-tab-btn ${activeTab === 'social' ? 'pv-resume-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          <LinkIcon size={15} />
          <span>Social ({content.socialLinks.filter((s) => s.enabled).length})</span>
        </button>

        <button
          type="button"
          className={`pv-resume-tab-btn ${activeTab === 'sections' ? 'pv-resume-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          <Layers size={15} />
          <span>Sections</span>
        </button>

        <button
          type="button"
          className={`pv-resume-tab-btn ${activeTab === 'design' ? 'pv-resume-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('design')}
        >
          <Palette size={15} />
          <span>Template</span>
        </button>
      </div>

      {/* ── Tab Panels ─────────────────────────────────────── */}
      <div className="pv-resume-tab-content">
        {/* 1. Profile & Summary */}
        {activeTab === 'personal' && (
          <div className="pv-form">
            <h3 className="pv-editor-section-title">Personal & Contact Info</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="pv-form-group">
                <label className="pv-label">Full Name</label>
                <input
                  type="text"
                  className="pv-input"
                  value={content.personalInfo.fullName || ''}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                />
              </div>
              <div className="pv-form-group">
                <label className="pv-label">Target Headline / Title</label>
                <input
                  type="text"
                  className="pv-input"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={content.personalInfo.headline || ''}
                  onChange={(e) => handlePersonalInfoChange('headline', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="pv-form-group">
                <label className="pv-label">Email</label>
                <input
                  type="email"
                  className="pv-input"
                  value={content.personalInfo.email || ''}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                />
              </div>
              <div className="pv-form-group">
                <label className="pv-label">Phone</label>
                <input
                  type="tel"
                  className="pv-input"
                  placeholder="+1 (555) 000-0000"
                  value={content.personalInfo.phone || ''}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="pv-form-group">
                <label className="pv-label">Location</label>
                <input
                  type="text"
                  className="pv-input"
                  placeholder="San Francisco, CA"
                  value={content.personalInfo.location || ''}
                  onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                />
              </div>
              <div className="pv-form-group">
                <label className="pv-label">Personal Website</label>
                <input
                  type="url"
                  className="pv-input"
                  placeholder="https://..."
                  value={content.personalInfo.website || ''}
                  onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                />
              </div>
            </div>

            <div className="pv-form-group">
              <label className="pv-label">Professional Summary</label>
              <textarea
                rows={4}
                className="pv-textarea"
                placeholder="Brief summary of your professional background, key achievements, and strengths..."
                value={content.personalInfo.summary || ''}
                onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* 2. Skills */}
        {activeTab === 'skills' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="pv-editor-section-title" style={{ margin: 0 }}>Skills Selection</h3>
              <button
                type="button"
                className="pv-btn pv-btn--light pv-btn--sm"
                onClick={handleAddCustomSkill}
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>
            <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '16px' }}>
              Check skills to include on this resume. Editing names here only affects this resume draft.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {content.skills.map((sk, idx) => (
                <div key={idx} className="pv-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={sk.enabled}
                      onChange={() => handleToggleSkill(idx)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-carbon)' }}
                    />
                    <input
                      type="text"
                      className="pv-input"
                      value={sk.name}
                      onChange={(e) => handleUpdateSkill(idx, e.target.value)}
                      style={{ padding: '4px 10px', height: '32px' }}
                    />
                  </div>
                  <button
                    type="button"
                    className="pv-btn pv-btn--ghost pv-btn--sm pv-btn--danger"
                    onClick={() => handleDeleteSkill(idx)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Experience */}
        {activeTab === 'experience' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="pv-editor-section-title" style={{ margin: 0 }}>Work Experience</h3>
              <button
                type="button"
                className="pv-btn pv-btn--dark pv-btn--sm"
                onClick={handleAddExperience}
              >
                <Plus size={14} />
                <span>Add Position</span>
              </button>
            </div>

            {content.experience.length === 0 ? (
              <div className="pv-card" style={{ textAlign: 'center', padding: '24px' }}>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>No experience positions added yet.</p>
                <button
                  type="button"
                  className="pv-btn pv-btn--dark pv-btn--sm"
                  style={{ marginTop: '12px' }}
                  onClick={handleAddExperience}
                >
                  <Plus size={14} /> Add Role
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {content.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="pv-card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                        <input
                          type="checkbox"
                          checked={exp.enabled}
                          onChange={() => handleUpdateExperience(idx, { ...exp, enabled: !exp.enabled })}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--color-carbon)' }}
                        />
                        <span>{exp.role || 'Position'}</span>
                      </label>
                      <button
                        type="button"
                        className="pv-btn pv-btn--ghost pv-btn--sm pv-btn--danger"
                        onClick={() => handleDeleteExperience(idx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                      <div>
                        <label className="pv-label" style={{ fontSize: '12px' }}>Job Title</label>
                        <input
                          type="text"
                          className="pv-input"
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(idx, { ...exp, role: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="pv-label" style={{ fontSize: '12px' }}>Company</label>
                        <input
                          type="text"
                          className="pv-input"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(idx, { ...exp, company: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                      <div>
                        <label className="pv-label" style={{ fontSize: '12px' }}>Start Date</label>
                        <input
                          type="date"
                          className="pv-input"
                          value={exp.startDate || ''}
                          onChange={(e) => handleUpdateExperience(idx, { ...exp, startDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="pv-label" style={{ fontSize: '12px' }}>End Date</label>
                        <input
                          type="date"
                          className="pv-input"
                          disabled={exp.current}
                          value={exp.endDate || ''}
                          onChange={(e) => handleUpdateExperience(idx, { ...exp, endDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleUpdateExperience(idx, { ...exp, current: e.target.checked })}
                        />
                        <span>Currently working here</span>
                      </label>
                    </div>

                    <div>
                      <label className="pv-label" style={{ fontSize: '12px' }}>Description / Bullets</label>
                      <textarea
                        rows={3}
                        className="pv-textarea"
                        value={exp.description || ''}
                        onChange={(e) => handleUpdateExperience(idx, { ...exp, description: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Education */}
        {activeTab === 'education' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="pv-editor-section-title" style={{ margin: 0 }}>Education</h3>
              <button
                type="button"
                className="pv-btn pv-btn--dark pv-btn--sm"
                onClick={handleAddEducation}
              >
                <Plus size={14} />
                <span>Add Degree</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {content.education.map((edu, idx) => (
                <div key={edu.id || idx} className="pv-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                      <input
                        type="checkbox"
                        checked={edu.enabled}
                        onChange={() => handleUpdateEducation(idx, { ...edu, enabled: !edu.enabled })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-carbon)' }}
                      />
                      <span>{edu.degree || 'Degree'}</span>
                    </label>
                    <button
                      type="button"
                      className="pv-btn pv-btn--ghost pv-btn--sm pv-btn--danger"
                      onClick={() => handleDeleteEducation(idx)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                    <div>
                      <label className="pv-label" style={{ fontSize: '12px' }}>Degree / Program</label>
                      <input
                        type="text"
                        className="pv-input"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(idx, { ...edu, degree: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="pv-label" style={{ fontSize: '12px' }}>Institution</label>
                      <input
                        type="text"
                        className="pv-input"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(idx, { ...edu, institution: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                    <div>
                      <label className="pv-label" style={{ fontSize: '12px' }}>Field of Study</label>
                      <input
                        type="text"
                        className="pv-input"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => handleUpdateEducation(idx, { ...edu, fieldOfStudy: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="pv-label" style={{ fontSize: '12px' }}>Grade / GPA</label>
                      <input
                        type="text"
                        className="pv-input"
                        value={edu.grade || ''}
                        onChange={(e) => handleUpdateEducation(idx, { ...edu, grade: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="pv-label" style={{ fontSize: '12px' }}>Graduation Year</label>
                      <input
                        type="date"
                        className="pv-input"
                        value={edu.endDate || ''}
                        onChange={(e) => handleUpdateEducation(idx, { ...edu, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Projects */}
        {activeTab === 'projects' && (
          <div>
            <h3 className="pv-editor-section-title">Projects Selection & Resume Customization</h3>
            <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '16px' }}>
              Select which projects appear. Modifying descriptions here customizes your resume without altering original project records.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {content.projects.map((proj, idx) => (
                <div key={proj.id || idx} className="pv-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>
                      <input
                        type="checkbox"
                        checked={proj.enabled}
                        onChange={() => handleToggleProject(idx)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-carbon)' }}
                      />
                      <span>{proj.title}</span>
                    </label>
                    <span className="pv-skill-card__category" style={{ fontSize: '11px' }}>
                      {proj.technologies?.slice(0, 3).join(', ')}
                    </span>
                  </div>

                  <div className="pv-form-group">
                    <label className="pv-label" style={{ fontSize: '12px' }}>Resume-Specific Project Description</label>
                    <textarea
                      rows={2}
                      className="pv-textarea"
                      value={proj.description || ''}
                      onChange={(e) => handleUpdateProjectDesc(idx, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Certificates */}
        {activeTab === 'certificates' && (
          <div>
            <h3 className="pv-editor-section-title">Certifications & Credentials</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {content.certificates.map((cert, idx) => (
                <div key={cert.id || idx} className="pv-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={cert.enabled}
                      onChange={() => handleToggleCertificate(idx)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-carbon)' }}
                    />
                    <span>{cert.title}</span>
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>({cert.issuer})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Achievements */}
        {activeTab === 'achievements' && (
          <div>
            <h3 className="pv-editor-section-title">Achievements & Awards</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {content.achievements.map((ach, idx) => (
                <div key={ach.id || idx} className="pv-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                      <input
                        type="checkbox"
                        checked={ach.enabled}
                        onChange={() => handleToggleAchievement(idx)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-carbon)' }}
                      />
                      <span>{ach.title}</span>
                    </label>
                    <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.7 }}>{ach.organization}</span>
                  </div>
                  <textarea
                    rows={2}
                    className="pv-textarea"
                    placeholder="Resume description for this achievement..."
                    value={ach.description || ''}
                    onChange={(e) => handleUpdateAchievementDesc(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. Social Links */}
        {activeTab === 'social' && (
          <div>
            <h3 className="pv-editor-section-title">Header Social & Contact Links</h3>
            <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '16px' }}>
              Choose which links appear in the header contact banner of your resume.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {content.socialLinks.map((soc, idx) => (
                <div key={soc.id || idx} className="pv-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={soc.enabled}
                      onChange={() => handleToggleSocial(idx)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-carbon)' }}
                    />
                    <span>{soc.label}</span>
                    <span style={{ fontSize: '12px', opacity: 0.6 }}>({soc.url})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Sections Order & Visibility */}
        {activeTab === 'sections' && (
          <div>
            <h3 className="pv-editor-section-title">Section Ordering & Custom Titles</h3>
            <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '16px' }}>
              Reorder sections or customize the heading text displayed on your resume.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {content.sectionOrder.map((sectionKey, idx) => {
                const isVisible = content.sectionVisibility[sectionKey] !== false;
                return (
                  <div
                    key={sectionKey}
                    className="pv-card"
                    style={{
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      opacity: isVisible ? 1 : 0.6,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <button
                        type="button"
                        className="pv-btn pv-btn--ghost pv-btn--sm"
                        onClick={() => handleToggleSectionVisibility(sectionKey)}
                        title={isVisible ? 'Hide section' : 'Show section'}
                      >
                        {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <input
                        type="text"
                        className="pv-input"
                        value={content.sectionTitles[sectionKey] || sectionKey}
                        onChange={(e) => handleUpdateSectionTitle(sectionKey, e.target.value)}
                        style={{ height: '34px', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        className="pv-btn pv-btn--ghost pv-btn--sm"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(idx, 'up')}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        className="pv-btn pv-btn--ghost pv-btn--sm"
                        disabled={idx === content.sectionOrder.length - 1}
                        onClick={() => handleMoveSection(idx, 'down')}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 10. Design & Template */}
        {activeTab === 'design' && (
          <div>
            <h3 className="pv-editor-section-title">Resume Template</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {(['PROFESSIONAL', 'MODERN', 'MINIMAL', 'ATS_FRIENDLY', 'ACADEMIC'] as ResumeTemplate[]).map((tmpl) => (
                <button
                  key={tmpl}
                  type="button"
                  className={`pv-card ${template === tmpl ? 'pv-card--active' : ''}`}
                  onClick={() => onTemplateChange(tmpl)}
                  style={{
                    padding: '16px 12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderWidth: template === tmpl ? '2px' : '1px',
                    borderColor: template === tmpl ? 'var(--color-carbon)' : 'var(--color-concrete-gray)',
                    background: template === tmpl ? 'var(--color-sky-wash)' : 'var(--surface-paper-white)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '13px', textTransform: 'capitalize' }}>
                    {tmpl.replace('_', ' ').toLowerCase()}
                  </div>
                  {template === tmpl && (
                    <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'center' }}>
                      <Check size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <h3 className="pv-editor-section-title">Accent Color</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {['#000000', '#4da2ff', '#5c4ade', '#fb4903', '#16a34a'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...content,
                      formatting: {
                        ...content.formatting,
                        primaryColor: color,
                      },
                    })
                  }
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: content.formatting?.primaryColor === color ? '3px solid #000' : '1px solid #ccc',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
