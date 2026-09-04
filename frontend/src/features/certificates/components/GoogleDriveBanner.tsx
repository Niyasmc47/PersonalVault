import { useState } from 'react';
import type { GoogleDriveStatus } from '../types';
import { certificateService } from '../services/certificateService';
import { HardDrive, CheckCircle2, AlertCircle, ExternalLink, Unlink, Loader2 } from 'lucide-react';

interface GoogleDriveBannerProps {
  status: GoogleDriveStatus | undefined;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function GoogleDriveBanner({
  status,
  isLoading,
  onRefresh,
}: GoogleDriveBannerProps) {
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isConnected = status?.connected ?? false;

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setErrorMsg(null);
      const { authUrl } = await certificateService.getDriveAuthUrl();
      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch (err: unknown) {
      console.error('Failed to get Drive authorization URL:', err);
      setErrorMsg((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to initiate Google Drive authorization');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect Google Drive? You will need to reconnect to upload or preview certificates.')) {
      return;
    }
    try {
      setDisconnecting(true);
      await certificateService.disconnectDrive();
      onRefresh();
    } catch (err: unknown) {
      console.error('Failed to disconnect Google Drive:', err);
      setErrorMsg((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to disconnect Google Drive');
    } finally {
      setDisconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pv-drive-banner pv-drive-banner--loading">
        <Loader2 size={20} className="pv-spin" />
        <span>Checking Google Drive connection...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="pv-drive-banner pv-drive-banner--connected">
        <div className="pv-drive-banner__left">
          <div className="pv-drive-banner__icon pv-drive-banner__icon--connected">
            <HardDrive size={22} color="var(--color-carbon)" />
          </div>
          <div className="pv-drive-banner__text">
            <div className="pv-drive-banner__status-row">
              <span className="pv-drive-banner__status-badge">
                <CheckCircle2 size={14} color="var(--color-mint-pop)" />
                Google Drive Connected
              </span>
              {status?.driveEmail && (
                <span className="pv-drive-banner__account">
                  ({status.driveEmail})
                </span>
              )}
            </div>
            <p className="pv-drive-banner__description">
              Your certificates are stored in <code>My Drive/PersonalVault/Certificates</code>. Files remain completely private in your own Google Drive.
            </p>
          </div>
        </div>

        <div className="pv-drive-banner__right">
          <button
            className="pv-btn pv-btn--light pv-btn--sm"
            onClick={handleDisconnect}
            disabled={disconnecting}
            title="Disconnect Google Drive"
          >
            {disconnecting ? (
              <Loader2 size={14} className="pv-spin" />
            ) : (
              <Unlink size={14} />
            )}
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pv-drive-banner pv-drive-banner--disconnected">
      <div className="pv-drive-banner__left">
        <div className="pv-drive-banner__icon pv-drive-banner__icon--disconnected">
          <HardDrive size={24} color="var(--color-carbon)" />
        </div>
        <div className="pv-drive-banner__text">
          <h3 className="pv-drive-banner__title">Connect Google Drive</h3>
          <p className="pv-drive-banner__description">
            PersonalVault stores your certificates in your own Google Drive. Authorize PersonalVault to automatically organize your credentials in a dedicated <code>PersonalVault/Certificates</code> folder.
          </p>
          {errorMsg && (
            <div className="pv-drive-banner__error">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pv-drive-banner__right">
        <button
          className="pv-btn pv-btn--dark"
          onClick={handleConnect}
          disabled={connecting}
        >
          {connecting ? (
            <>
              <Loader2 size={16} className="pv-spin" />
              <span>Redirecting...</span>
            </>
          ) : (
            <>
              <ExternalLink size={16} />
              <span>Connect Google Drive</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
