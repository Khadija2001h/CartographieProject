package com.pfa.backend.controller;


import com.pfa.backend.entity.SupportRequest;
import com.pfa.backend.service.SupportRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "http://localhost:3000")
public class SupportRequestController {

    @Autowired
    private SupportRequestService supportRequestService;

    @PostMapping("/submit")
    public ResponseEntity<SupportRequest> createSupportRequest(@RequestBody SupportRequest supportRequest) {
        SupportRequest savedSupportRequest = supportRequestService.saveSupportRequest(supportRequest);
        return new ResponseEntity<>(savedSupportRequest, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SupportRequest>> getAllSupportRequests() {
        List<SupportRequest> supportRequests = supportRequestService.getAllSupportRequests();
        return new ResponseEntity<>(supportRequests, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupportRequest> getSupportRequestById(@PathVariable Long id) {
        SupportRequest supportRequest = supportRequestService.getSupportRequestById(id);
        return new ResponseEntity<>(supportRequest, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSupportRequest(@PathVariable Long id) {
        supportRequestService.deleteSupportRequest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
