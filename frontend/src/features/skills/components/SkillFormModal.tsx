import { useState, useEffect } from 'react';
import type { Skill, CreateSkillPayload, UpdateSkillPayload, SkillCategory, ProficiencyLevel } from '../types';
import { X, Award } from 'lucide-react';

interface SkillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSkillPayload | { id: number; data: UpdateSkillPayload }) => void;
  initialData?: Skill | null;
  isSubmitting?: boolean;
}

export default function SkillFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: SkillFormModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('PROGRAMMING_LANGUAGE');
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('INTERMEDIATE');
  const [yearsOfExperience, setYearsOfExperience] = useState<string>('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [includeInResume, setIncludeInResume] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || 'PROGRAMMING_LANGUAGE');
      setProficiency(initialData.proficiency || 'INTERMEDIATE');
      setYearsOfExperience(initialData.yearsOfExperience !== null && initialData.yearsOfExperience !== undefined ? String(initialData.yearsOfExperience) : '');
      setDescription(initialData.description || '');
      setFeatured(!!initialData.featured);
      setIncludeInResume(initialData.includeInResume !== false);
      setDisplayOrder(initialData.displayOrder ?? 0);
    } else {
      setName('');
      setCategory('PROGRAMMING_LANGUAGE');
      setProficiency('INTERMEDIATE');
      setYearsOfExperience('');
      setDescription('');
      setFeatured(false);
      setIncludeInResume(true);
      setDisplayOrder(0);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Skill name is required';
    } else if (name.length > 100) {
      newErrors.name = 'Max 100 characters';
    }

    if (yearsOfExperience.trim() !== '') {
      const num = Number(yearsOfExperience);
      if (isNaN(num) || num < 0) {
        newErrors.yearsOfExperience = 'Must be a valid positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateSkillPayload = {
      name: name.trim(),
      category,
      proficiency,
      yearsOfExperience: yearsOfExperience.trim() !== '' ? Number(yearsOfExperience) : null,
      description: description.trim() ? description.trim() : null,
      featured,
      includeInResume,
      displayOrder,
    };

    if (initialData) {
      onSubmit({ id: initialData.id, data: payload });
    } else {
      onSubmit(payload);
    }
  };

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal pv-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px' }}
      >
        <div className="pv-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="pv-feature-card__icon"
              style={{ width: '36px', height: '36px', background: 'var(--color-mint-pop)' }}
            >
              <Award size={18} color="var(--color-carbon)" />
            </div>
            <h2 className="pv-modal__title">
              {initialData ? 'Edit Skill' : 'Add New Skill'}
            </h2>
          </div>
          <button type="button" className="pv-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="pv-form">
          <div className="pv-form-group">
            <label className="pv-label" htmlFor="skill-name">
              Skill Name <span style={{ color: 'var(--color-ember)' }}>*</span>
            </label>
            <input
              id="skill-name"
              type="text"
              className={`pv-input ${errors.name ? 'pv-input--error' : ''}`}
              placeholder="e.g. TypeScript, React, Docker, SQL"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="pv-form-error">{errors.name}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="pv-form-group">
              <label className="pv-label" htmlFor="skill-category">
                Category <span style={{ color: 'var(--color-ember)' }}>*</span>
              </label>
              <select
                id="skill-category"
                className="pv-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
              >
                <option value="PROGRAMMING_LANGUAGE">Programming Language</option>
                <option value="FRAMEWORK">Framework</option>
                <option value="DATABASE">Database</option>
                <option value="CLOUD">Cloud</option>
                <option value="DEVOPS">DevOps</option>
                <option value="TOOLS">Tools</option>
                <option value="SOFT_SKILLS">Soft Skills</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="pv-form-group">
              <label className="pv-label" htmlFor="skill-proficiency">
                Proficiency Level <span style={{ color: 'var(--color-ember)' }}>*</span>
              </label>
              <select
                id="skill-proficiency"
                className="pv-select"
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value as ProficiencyLevel)}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>

          <div className="pv-form-group">
            <label className="pv-label" htmlFor="skill-experience">
              Years of Experience (optional)
            </label>
            <input
              id="skill-experience"
              type="number"
              step="0.5"
              min="0"
              className="pv-input"
              placeholder="e.g. 2.5"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
            />
            {errors.yearsOfExperience && (
              <p className="pv-form-error">{errors.yearsOfExperience}</p>
            )}
          </div>

          <div className="pv-form-group">
            <label className="pv-label" htmlFor="skill-description">
              Description / Notes (optional)
            </label>
            <textarea
              id="skill-description"
              rows={3}
              className="pv-textarea"
              placeholder="Key libraries, version proficiency, or real-world application details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="pv-form-error">{errors.description}</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '20px', margin: '8px 0 16px 0', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
              <input
                type="checkbox"
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-carbon)' }}
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              <span>Mark as Featured</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
              <input
                type="checkbox"
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-carbon)' }}
                checked={includeInResume}
                onChange={(e) => setIncludeInResume(e.target.checked)}
              />
              <span>Include in Resume Builder</span>
            </label>
          </div>

          <div className="pv-modal__actions">
            <button
              type="button"
              className="pv-btn pv-btn--light"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pv-btn pv-btn--dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

