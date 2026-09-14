import { useState, useEffect } from 'react';
import type { SocialLink, CreateSocialLinkPayload, UpdateSocialLinkPayload, SocialPlatform } from '../types';
import { X, Link as LinkIcon } from 'lucide-react';

interface SocialLinkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSocialLinkPayload | { id: number; data: UpdateSocialLinkPayload }) => void;
  initialData?: SocialLink | null;
  isSubmitting?: boolean;
}

const defaultLabels: Record<SocialPlatform, string> = {
  GITHUB: 'GitHub',
  LINKEDIN: 'LinkedIn',
  PORTFOLIO: 'Portfolio',
  LEETCODE: 'LeetCode',
  CODECHEF: 'CodeChef',
  HACKERRANK: 'HackerRank',
  KAGGLE: 'Kaggle',
  BEHANCE: 'Behance',
  DRIBBBLE: 'Dribbble',
  X: 'X (Twitter)',
  YOUTUBE: 'YouTube',
  PERSONAL_WEBSITE: 'Personal Website',
  OTHER: 'Custom Link',
};

const defaultPlaceholders: Record<SocialPlatform, string> = {
  GITHUB: 'https://github.com/username',
  LINKEDIN: 'https://linkedin.com/in/username',
  PORTFOLIO: 'https://yourname.dev',
  LEETCODE: 'https://leetcode.com/username',
  CODECHEF: 'https://codechef.com/users/username',
  HACKERRANK: 'https://hackerrank.com/username',
  KAGGLE: 'https://kaggle.com/username',
  BEHANCE: 'https://behance.net/username',
  DRIBBBLE: 'https://dribbble.com/username',
  X: 'https://x.com/username',
  YOUTUBE: 'https://youtube.com/@username',
  PERSONAL_WEBSITE: 'https://example.com',
  OTHER: 'https://...',
};

const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

export default function SocialLinkFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: SocialLinkFormModalProps) {
  const [platform, setPlatform] = useState<SocialPlatform>('GITHUB');
  const [label, setLabel] = useState('GitHub');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [includeInResume, setIncludeInResume] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setPlatform(initialData.platform || 'GITHUB');
      setLabel(initialData.label || '');
      setUrl(initialData.url || '');
      setUsername(initialData.username || '');
      setIncludeInResume(initialData.includeInResume !== false);
      setDisplayOrder(initialData.displayOrder ?? 0);
    } else {
      setPlatform('GITHUB');
      setLabel('GitHub');
      setUrl('');
      setUsername('');
      setIncludeInResume(true);
      setDisplayOrder(0);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handlePlatformChange = (newPlatform: SocialPlatform) => {
    setPlatform(newPlatform);
    if (!initialData) {
      setLabel(defaultLabels[newPlatform] || '');
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!label.trim()) {
      newErrors.label = 'Label is required';
    } else if (label.length > 100) {
      newErrors.label = 'Max 100 characters';
    }

    if (!url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!urlRegex.test(url.trim())) {
      newErrors.url = 'Please enter a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateSocialLinkPayload = {
      platform,
      label: label.trim(),
      url: url.trim(),
      username: username.trim() ? username.trim() : null,
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
        style={{ maxWidth: '520px' }}
      >
        <div className="pv-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="pv-feature-card__icon"
              style={{ width: '36px', height: '36px', background: 'var(--color-electric-blue)' }}
            >
              <LinkIcon size={18} color="var(--color-paper-white)" />
            </div>
            <h2 className="pv-modal__title">
              {initialData ? 'Edit Social Link' : 'Add Social / Profile Link'}
            </h2>
          </div>
          <button type="button" className="pv-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="pv-form">
          <div className="pv-form-group">
            <label className="pv-label" htmlFor="social-platform">
              Platform <span style={{ color: 'var(--color-ember)' }}>*</span>
            </label>
            <select
              id="social-platform"
              className="pv-select"
              value={platform}
              onChange={(e) => handlePlatformChange(e.target.value as SocialPlatform)}
            >
              <option value="GITHUB">GitHub</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="PORTFOLIO">Portfolio</option>
              <option value="LEETCODE">LeetCode</option>
              <option value="CODECHEF">CodeChef</option>
              <option value="HACKERRANK">HackerRank</option>
              <option value="KAGGLE">Kaggle</option>
              <option value="BEHANCE">Behance</option>
              <option value="DRIBBBLE">Dribbble</option>
              <option value="X">X (formerly Twitter)</option>
              <option value="YOUTUBE">YouTube</option>
              <option value="PERSONAL_WEBSITE">Personal Website</option>
              <option value="OTHER">Other / Custom</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="pv-form-group">
              <label className="pv-label" htmlFor="social-label">
                Display Label <span style={{ color: 'var(--color-ember)' }}>*</span>
              </label>
              <input
                id="social-label"
                type="text"
                className={`pv-input ${errors.label ? 'pv-input--error' : ''}`}
                placeholder="e.g. GitHub Profile"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
              {errors.label && <p className="pv-form-error">{errors.label}</p>}
            </div>

            <div className="pv-form-group">
              <label className="pv-label" htmlFor="social-username">
                Username / Handle (optional)
              </label>
              <input
                id="social-username"
                type="text"
                className="pv-input"
                placeholder="e.g. john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="pv-form-group">
            <label className="pv-label" htmlFor="social-url">
              Full Profile URL <span style={{ color: 'var(--color-ember)' }}>*</span>
            </label>
            <input
              id="social-url"
              type="url"
              className={`pv-input ${errors.url ? 'pv-input--error' : ''}`}
              placeholder={defaultPlaceholders[platform] || 'https://...'}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {errors.url && <p className="pv-form-error">{errors.url}</p>}
          </div>

          <div style={{ margin: '8px 0 16px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
              <input
                type="checkbox"
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-carbon)' }}
                checked={includeInResume}
                onChange={(e) => setIncludeInResume(e.target.checked)}
              />
              <span>Include in Resume Header</span>
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
              {isSubmitting ? 'Saving...' : initialData ? 'Update Link' : 'Add Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

