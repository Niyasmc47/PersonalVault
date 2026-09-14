import { useState, useEffect } from 'react';
import type { Achievement, CreateAchievementPayload, UpdateAchievementPayload, AchievementCategory } from '../types';
import { X, Trophy } from 'lucide-react';

interface AchievementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAchievementPayload | { id: number; data: UpdateAchievementPayload }) => void;
  initialData?: Achievement | null;
  isSubmitting?: boolean;
}

export default function AchievementFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: AchievementFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organization, setOrganization] = useState('');
  const [achievementDate, setAchievementDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<AchievementCategory>('HACKATHON');
  const [url, setUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [includeInResume, setIncludeInResume] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setOrganization(initialData.organization || '');
      setAchievementDate(initialData.achievementDate || new Date().toISOString().split('T')[0]);
      setCategory(initialData.category || 'HACKATHON');
      setUrl(initialData.url || '');
      setFeatured(!!initialData.featured);
      setIncludeInResume(initialData.includeInResume !== false);
      setDisplayOrder(initialData.displayOrder ?? 0);
    } else {
      setTitle('');
      setDescription('');
      setOrganization('');
      setAchievementDate(new Date().toISOString().split('T')[0]);
      setCategory('HACKATHON');
      setUrl('');
      setFeatured(false);
      setIncludeInResume(true);
      setDisplayOrder(0);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Max 200 characters';
    }

    if (!organization.trim()) {
      newErrors.organization = 'Organization / Issuer is required';
    } else if (organization.length > 150) {
      newErrors.organization = 'Max 150 characters';
    }

    if (!achievementDate) {
      newErrors.achievementDate = 'Date is required';
    }

    if (url.trim() && !/^https?:\/\/.+/i.test(url.trim())) {
      newErrors.url = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateAchievementPayload = {
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      organization: organization.trim(),
      achievementDate,
      category,
      url: url.trim() ? url.trim() : null,
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
        style={{ maxWidth: '600px' }}
      >
        <div className="pv-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="pv-feature-card__icon"
              style={{ width: '36px', height: '36px', background: 'var(--color-sunburst)' }}
            >
              <Trophy size={18} color="var(--color-carbon)" />
            </div>
            <h2 className="pv-modal__title">
              {initialData ? 'Edit Achievement' : 'Add New Achievement'}
            </h2>
          </div>
          <button type="button" className="pv-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="pv-form">
          <div className="pv-form-group">
            <label className="pv-label" htmlFor="achievement-title">
              Achievement Title <span style={{ color: 'var(--color-ember)' }}>*</span>
            </label>
            <input
              id="achievement-title"
              type="text"
              className={`pv-input ${errors.title ? 'pv-input--error' : ''}`}
              placeholder="e.g. 1st Place - Smart India Hackathon 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p className="pv-form-error">{errors.title}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="pv-form-group">
              <label className="pv-label" htmlFor="achievement-org">
                Organization / Host <span style={{ color: 'var(--color-ember)' }}>*</span>
              </label>
              <input
                id="achievement-org"
                type="text"
                className={`pv-input ${errors.organization ? 'pv-input--error' : ''}`}
                placeholder="e.g. Ministry of Education, IEEE, Google"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
              {errors.organization && (
                <p className="pv-form-error">{errors.organization}</p>
              )}
            </div>

            <div className="pv-form-group">
              <label className="pv-label" htmlFor="achievement-date">
                Date <span style={{ color: 'var(--color-ember)' }}>*</span>
              </label>
              <input
                id="achievement-date"
                type="date"
                className={`pv-input ${errors.achievementDate ? 'pv-input--error' : ''}`}
                value={achievementDate}
                onChange={(e) => setAchievementDate(e.target.value)}
              />
              {errors.achievementDate && (
                <p className="pv-form-error">{errors.achievementDate}</p>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="pv-form-group">
              <label className="pv-label" htmlFor="achievement-category">
                Category <span style={{ color: 'var(--color-ember)' }}>*</span>
              </label>
              <select
                id="achievement-category"
                className="pv-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as AchievementCategory)}
              >
                <option value="COMPETITION">Competition</option>
                <option value="HACKATHON">Hackathon</option>
                <option value="AWARD">Award</option>
                <option value="ACADEMIC">Academic</option>
                <option value="LEADERSHIP">Leadership</option>
                <option value="RESEARCH">Research</option>
                <option value="PUBLICATION">Publication</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="SPORTS">Sports</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="pv-form-group">
              <label className="pv-label" htmlFor="achievement-url">
                Link / URL (optional)
              </label>
              <input
                id="achievement-url"
                type="url"
                className={`pv-input ${errors.url ? 'pv-input--error' : ''}`}
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {errors.url && <p className="pv-form-error">{errors.url}</p>}
            </div>
          </div>

          <div className="pv-form-group">
            <label className="pv-label" htmlFor="achievement-desc">
              Description / Summary (optional)
            </label>
            <textarea
              id="achievement-desc"
              rows={3}
              className="pv-textarea"
              placeholder="What did you build, lead, or achieve? What was the impact?"
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
              {isSubmitting ? 'Saving...' : initialData ? 'Update Achievement' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

