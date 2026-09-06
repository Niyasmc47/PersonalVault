package com.personalvault.mapper.vault;

public class MaskingUtil {

    private MaskingUtil() {
    }

    public static String maskAadhaar(String raw) {
        if (raw == null || raw.isBlank()) return "";
        String clean = raw.replaceAll("\\s+", "").replaceAll("-", "");
        if (clean.length() <= 4) {
            return "XXXX-XXXX-" + clean;
        }
        String last4 = clean.substring(clean.length() - 4);
        return "XXXX-XXXX-" + last4;
    }

    public static String maskPan(String raw) {
        if (raw == null || raw.isBlank()) return "";
        String clean = raw.trim().toUpperCase();
        if (clean.length() <= 4) {
            return "XXXXXX" + clean;
        }
        String last4 = clean.substring(clean.length() - 4);
        return "XXXXXX" + last4;
    }

    public static String maskAccountNumber(String raw) {
        if (raw == null || raw.isBlank()) return "";
        String clean = raw.replaceAll("\\s+", "").replaceAll("-", "");
        if (clean.length() <= 4) {
            return "XXXXXXXX" + clean;
        }
        String last4 = clean.substring(clean.length() - 4);
        int maskLength = Math.max(clean.length() - 4, 4);
        return "X".repeat(maskLength) + last4;
    }

    public static String maskGenericId(String raw) {
        if (raw == null || raw.isBlank()) return "";
        String clean = raw.trim();
        if (clean.length() <= 4) {
            return "XXXX" + clean;
        }
        String last4 = clean.substring(clean.length() - 4);
        int maskLength = Math.max(clean.length() - 4, 4);
        return "X".repeat(maskLength) + last4;
    }
}
