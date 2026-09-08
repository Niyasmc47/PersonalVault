import { useEffect, useState } from 'react';
import { certificateService } from '../../certificates/services/certificateService';
import type { GoogleDriveStatus } from '../../certificates/types';
import { HardDrive, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

export default function GoogleDriveVaultBanner() {
  const [driveStatus, setDriveStatus] = useState<GoogleDriveStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [connecting, setConnecting] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    certificateService
      .getDriveStatus()
      .then((status) => {
        if (active) setDriveStatus(status);
      })
      .catch(() => {
        if (active) setDriveStatus({ connected: false, certificatesCount: 0 });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const res = await certificateService.getDriveAuthUrl();
      if (res?.authUrl) {
        window.location.href = res.authUrl;
      }
    } catch (err) {
      console.error('Failed to get Drive authorization URL:', err);
      setConnecting(false);
    }
  };

  if (loading) return null;

  if (driveStatus?.connected) {
    return (
      <div
        className="pv-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'var(--color-mint-pop)',
          marginBottom: '24px',
          borderRadius: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={20} color="var(--color-carbon)" />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>
            Google Drive is connected ({driveStatus.driveEmail || 'Primary Account'}). Encrypted document backups active.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pv-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '16px 20px',
        background: 'var(--color-sunburst)',
        marginBottom: '24px',
        borderRadius: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AlertCircle size={22} color="var(--color-carbon)" />
        <div>
          <strong style={{ display: 'block', fontSize: '14px' }}>Google Drive is not connected</strong>
          <span style={{ fontSize: '13px' }}>
            Document attachments for Identity, Finance, and Education are safely stored in your private Google Drive.
          </span>
        </div>
      </div>

      <button
        type="button"
        className="pv-btn pv-btn--dark pv-btn--sm"
        onClick={handleConnect}
        disabled={connecting}
      >
        {connecting ? (
          <>
            <Loader2 size={14} className="pv-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <HardDrive size={14} />
            <span>Connect Google Drive</span>
            <ExternalLink size={12} />
          </>
        )}
      </button>
    </div>
  );
}
