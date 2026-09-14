import { useState } from 'react';
import type { ResumeSummary, ResumeTemplate } from '../types';
import { X, FileText, Plus, Trash2, Calendar, Briefcase } from 'lucide-react';

interface ResumeListModalProps {
  isOpen: boolean;
  resumes: ResumeSummary[];
  activeResumeId: number | null;
  onClose: () => void;
  onSelectResume: (id: number) => void;
  onCreateResume: (data: { name: string; targetRole?: string; template: ResumeTemplate; autoPopulate: boolean }) => void;
  onDeleteResume: (id: number) => void;
}

export default function ResumeListModal({
  isOpen,
  resumes,
  activeResumeId,
  onClose,
  onSelectResume,
  onCreateResume,
  onDeleteResume,
}: ResumeListModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTargetRole, setNewTargetRole] = useState('');
  const [newTemplate, setNewTemplate] = useState<ResumeTemplate>('PROFESSIONAL');
  const [autoPopulate, setAutoPopulate] = useState(true);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateResume({
      name: newName.trim(),
      targetRole: newTargetRole.trim() || undefined,
      template: newTemplate,
      autoPopulate,
    });
    setNewName('');
    setNewTargetRole('');
    setIsCreating(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal pv-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        <div className="pv-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="pv-feature-card__icon"
              style={{ width: '36px', height: '36px', background: 'var(--color-electric-blue)' }}
            >
              <FileText size={18} color="var(--color-paper-white)" />
            </div>
            <h2 className="pv-modal__title">Your Saved Resumes</h2>
          </div>
          <button type="button" className="pv-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {!isCreating ? (
          <div style={{ margin: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>
                {resumes.length} {resumes.length === 1 ? 'Resume Draft' : 'Resume Drafts'}
              </span>
              <button
                type="button"
                className="pv-btn pv-btn--dark pv-btn--sm"
                onClick={() => setIsCreating(true)}
              >
                <Plus size={14} />
                <span>Create New Resume</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
              {resumes.map((res) => {
                const isActive = res.id === activeResumeId;
                return (
                  <div
                    key={res.id}
                    className="pv-card"
                    style={{
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderWidth: isActive ? '2px' : '1px',
                      borderColor: isActive ? 'var(--color-carbon)' : 'var(--color-concrete-gray)',
                      background: isActive ? 'var(--color-sky-wash)' : 'var(--surface-paper-white)',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      onSelectResume(res.id);
                      onClose();
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{res.name}</h4>
                        {isActive && (
                          <span
                            className="pv-skill-card__category"
                            style={{ background: 'var(--color-mint-pop)', color: 'var(--color-carbon)', fontSize: '11px', padding: '2px 8px' }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', opacity: 0.75, marginTop: '4px' }}>
                        {res.targetRole && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Briefcase size={12} /> {res.targetRole}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> Updated {formatDate(res.updatedAt)}
                        </span>
                        <span style={{ textTransform: 'capitalize' }}>
                          Template: {res.template.replace('_', ' ').toLowerCase()}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                      {resumes.length > 1 && (
                        <button
                          type="button"
                          className="pv-btn pv-btn--ghost pv-btn--sm pv-btn--danger"
                          onClick={() => onDeleteResume(res.id)}
                          aria-label="Delete resume draft"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateSubmit} className="pv-form" style={{ margin: '20px 0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>New Resume Profile</h3>
            
            <div className="pv-form-group">
              <label className="pv-label">Resume Name <span style={{ color: 'var(--color-ember)' }}>*</span></label>
              <input
                type="text"
                className="pv-input"
                placeholder="e.g. Backend Engineer Resume, Academic CV, Internship"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="pv-form-group">
              <label className="pv-label">Target Role / Headline</label>
              <input
                type="text"
                className="pv-input"
                placeholder="e.g. Senior Java / Spring Boot Developer"
                value={newTargetRole}
                onChange={(e) => setNewTargetRole(e.target.value)}
              />
            </div>

            <div className="pv-form-group">
              <label className="pv-label">Template</label>
              <select
                className="pv-select"
                value={newTemplate}
                onChange={(e) => setNewTemplate(e.target.value as ResumeTemplate)}
              >
                <option value="PROFESSIONAL">Professional (Clean Corporate)</option>
                <option value="MODERN">Modern (Color Accent & Tags)</option>
                <option value="MINIMAL">Minimal (Monochrome Typography)</option>
                <option value="ATS_FRIENDLY">ATS Friendly (Linear Standard Hierarchy)</option>
                <option value="ACADEMIC">Academic (Curriculum Vitae)</option>
              </select>
            </div>

            <div style={{ margin: '12px 0 20px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={autoPopulate}
                  onChange={(e) => setAutoPopulate(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-carbon)' }}
                />
                <span>Auto-populate with current PersonalVault data</span>
              </label>
            </div>

            <div className="pv-modal__actions">
              <button
                type="button"
                className="pv-btn pv-btn--light"
                onClick={() => setIsCreating(false)}
              >
                Back to List
              </button>
              <button type="submit" className="pv-btn pv-btn--dark">
                Create & Open Editor
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
