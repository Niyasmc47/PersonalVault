import React from 'react';
import type { CertificateSummary } from '../types';
import { Award, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface CertificateStatsProps {
  summary: CertificateSummary | undefined;
  isLoading: boolean;
}

export default function CertificateStats({
  summary,
  isLoading,
}: CertificateStatsProps) {
  if (isLoading) {
    return (
      <div className="pv-stats-grid">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="pv-stat-card pv-stat-card--loading">
            <div className="pv-stat-card__icon-placeholder" />
            <div className="pv-stat-card__text-placeholder" />
          </div>
        ))}
      </div>
    );
  }

  const total = summary?.totalCertificates ?? 0;
  const active = summary?.activeCertificates ?? 0;
  const expiringSoon = summary?.expiringSoonCertificates ?? 0;
  const expired = summary?.expiredCertificates ?? 0;
  const noExpiration = summary?.noExpirationCertificates ?? 0;

  return (
    <div className="pv-stats-grid">
      <div className="pv-stat-card">
        <div className="pv-stat-card__icon" style={{ background: 'var(--color-sky-wash)' }}>
          <Award size={22} color="var(--color-carbon)" />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Total Certificates</span>
          <span className="pv-stat-card__value">{total}</span>
        </div>
      </div>

      <div className="pv-stat-card">
        <div className="pv-stat-card__icon" style={{ background: 'var(--color-mint-pop)' }}>
          <CheckCircle size={22} color="var(--color-carbon)" />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Active / Valid</span>
          <span className="pv-stat-card__value">{active + noExpiration}</span>
        </div>
      </div>

      <div className="pv-stat-card">
        <div className="pv-stat-card__icon" style={{ background: 'var(--color-sunburst)' }}>
          <Clock size={22} color="var(--color-carbon)" />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Expiring Soon (30d)</span>
          <span className="pv-stat-card__value">{expiringSoon}</span>
        </div>
      </div>

      <div className="pv-stat-card">
        <div className="pv-stat-card__icon" style={{ background: 'var(--color-lavender)' }}>
          <AlertTriangle size={22} color="var(--color-carbon)" />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Expired</span>
          <span className="pv-stat-card__value">{expired}</span>
        </div>
      </div>
    </div>
  );
}
