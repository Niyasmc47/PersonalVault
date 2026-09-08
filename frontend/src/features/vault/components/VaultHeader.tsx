import { useVaultLock } from '../contexts/VaultLockContext';
import type { VaultTab } from '../types';
import {
  KeyRound,
  FileCheck2,
  Building2,
  GraduationCap,
  FolderLock,
  Lock,
  Unlock,
  Plus,
} from 'lucide-react';

interface VaultHeaderProps {
  activeTab: VaultTab;
  onTabChange: (tab: VaultTab) => void;
  onAddNew: () => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
}

export default function VaultHeader({
  activeTab,
  onTabChange,
  onAddNew,
  searchTerm,
  onSearchChange,
}: VaultHeaderProps) {
  const { isUnlocked, autoLockMinutes, lockVault } = useVaultLock();

  const tabs: { key: VaultTab; label: string; icon: typeof KeyRound }[] = [
    { key: 'passwords', label: 'Passwords', icon: KeyRound },
    { key: 'identity', label: 'Identity Documents', icon: FileCheck2 },
    { key: 'finance', label: 'Financial Accounts', icon: Building2 },
    { key: 'education', label: 'Education & Career', icon: GraduationCap },
    { key: 'other', label: 'Other Documents', icon: FolderLock },
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
              SECURE VAULT
            </h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '1600px',
                fontSize: '12px',
                fontWeight: 700,
                border: '1px solid var(--color-carbon)',
                background: isUnlocked ? 'var(--color-mint-pop)' : 'var(--color-soft-mist)',
              }}
            >
              {isUnlocked ? <Unlock size={13} /> : <Lock size={13} />}
              {isUnlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>

          <p style={{ color: '#555', fontSize: '15px', maxWidth: '650px', margin: 0 }}>
            Zero-knowledge, encrypted storage for your passwords, Aadhaar, PAN, bank accounts, and sensitive PDF/image records.
          </p>
        </div>

        {isUnlocked && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>
              Auto-locks on {autoLockMinutes}m idle
            </span>
            <button
              type="button"
              className="pv-btn pv-btn--light pv-btn--sm"
              onClick={lockVault}
              title="Immediately lock vault"
            >
              <Lock size={14} />
              <span>Lock Now</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs and Controls */}
      {isUnlocked && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Navigation Pill Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onTabChange(tab.key)}
                  className={`pv-btn ${isActive ? 'pv-btn--dark' : 'pv-btn--light'}`}
                  style={{
                    borderRadius: '1600px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Row: Search & Add */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px', maxWidth: '400px' }}>
              <input
                type="text"
                className="pv-input"
                style={{ width: '100%', borderRadius: '1600px', padding: '10px 18px', fontSize: '13px' }}
                placeholder={`Search in ${tabs.find((t) => t.key === activeTab)?.label}...`}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="pv-btn pv-btn--dark"
              style={{ borderRadius: '1600px', padding: '10px 20px', fontSize: '13px' }}
              onClick={onAddNew}
            >
              <Plus size={16} />
              <span>Add Record</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
