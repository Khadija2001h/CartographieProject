package com.pfa.backend.service;


import com.pfa.backend.entity.SupportRequest;
import com.pfa.backend.repository.SupportRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupportRequestService {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    public SupportRequest saveSupportRequest(SupportRequest supportRequest) {
        return supportRequestRepository.save(supportRequest);
    }

    public List<SupportRequest> getAllSupportRequests() {
        return supportRequestRepository.findAll();
    }

    public SupportRequest getSupportRequestById(Long id) {
        return supportRequestRepository.findById(id).orElse(null);
    }

    public void deleteSupportRequest(Long id) {
        supportRequestRepository.deleteById(id);
    }
}