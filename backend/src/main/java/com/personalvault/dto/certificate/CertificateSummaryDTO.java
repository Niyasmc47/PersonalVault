package com.personalvault.dto.certificate;

import com.personalvault.entity.certificate.CertificateCategory;

import java.util.Map;

public class CertificateSummaryDTO {

    private long totalCertificates;
    private long activeCertificates;
    private long expiringSoonCertificates;
    private long expiredCertificates;
    private long noExpirationCertificates;
    private Map<CertificateCategory, Long> categoryCounts;

    public CertificateSummaryDTO() {
    }

    public CertificateSummaryDTO(long totalCertificates, long activeCertificates, 
                                 long expiringSoonCertificates, long expiredCertificates, 
                                 long noExpirationCertificates, Map<CertificateCategory, Long> categoryCounts) {
        this.totalCertificates = totalCertificates;
        this.activeCertificates = activeCertificates;
        this.expiringSoonCertificates = expiringSoonCertificates;
        this.expiredCertificates = expiredCertificates;
        this.noExpirationCertificates = noExpirationCertificates;
        this.categoryCounts = categoryCounts;
    }

    public long getTotalCertificates() {
        return totalCertificates;
    }

    public void setTotalCertificates(long totalCertificates) {
        this.totalCertificates = totalCertificates;
    }

    public long getActiveCertificates() {
        return activeCertificates;
    }

    public void setActiveCertificates(long activeCertificates) {
        this.activeCertificates = activeCertificates;
    }

    public long getExpiringSoonCertificates() {
        return expiringSoonCertificates;
    }

    public void setExpiringSoonCertificates(long expiringSoonCertificates) {
        this.expiringSoonCertificates = expiringSoonCertificates;
    }

    public long getExpiredCertificates() {
        return expiredCertificates;
    }

    public void setExpiredCertificates(long expiredCertificates) {
        this.expiredCertificates = expiredCertificates;
    }

    public long getNoExpirationCertificates() {
        return noExpirationCertificates;
    }

    public void setNoExpirationCertificates(long noExpirationCertificates) {
        this.noExpirationCertificates = noExpirationCertificates;
    }

    public Map<CertificateCategory, Long> getCategoryCounts() {
        return categoryCounts;
    }

    public void setCategoryCounts(Map<CertificateCategory, Long> categoryCounts) {
        this.categoryCounts = categoryCounts;
    }
}
