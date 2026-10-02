package com.personalvault.service;

import com.personalvault.dto.*;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SmartDropService {
    List<SmartDropAnalysisResponse> analyzeFiles(String userEmail, List<MultipartFile> files);
    Resource previewTempFile(String userEmail, String tempFileId);
    SmartDropConfirmResponse confirmAndRoute(String userEmail, SmartDropConfirmRequest request, String vaultToken);
    SmartDropBatchConfirmResponse confirmBatch(String userEmail, SmartDropBatchConfirmRequest batchRequest, String vaultToken);
    void discardTempFile(String userEmail, String tempFileId);
}
