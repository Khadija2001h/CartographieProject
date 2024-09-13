package com.pfa.backend.controller;

import com.pfa.backend.Exceptions.ResourceNotFoundException;
import com.pfa.backend.entity.Notification;
import com.pfa.backend.entity.ResponseRequest;
import com.pfa.backend.entity.SupportRequest;
import com.pfa.backend.repository.SupportRequestRepository;
import com.pfa.backend.service.EmailService;
import com.pfa.backend.service.NotificationService;
import com.pfa.backend.service.SupportRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/support")
public class SupportRequestController {

    @Autowired
    private SupportRequestService supportRequestService;

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/respond")
    public ResponseEntity<?> respondToRequest(@RequestBody ResponseRequest responseRequest) {
        SupportRequest request = supportRequestRepository.findById(responseRequest.getId())
                .orElseThrow(() -> new ResourceNotFoundException("SupportRequest not found"));

        // Update the fields
        request.setHasResponded(true);
        supportRequestRepository.save(request);

        // Send the response email
        emailService.sendEmail(request.getEmail(), "Response to your support request", responseRequest.getMessage());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/submit")
    public ResponseEntity<SupportRequest> createSupportRequest(@RequestBody SupportRequest supportRequest) {
        SupportRequest savedSupportRequest = supportRequestService.saveSupportRequest(supportRequest);

        // Create a notification for the new support request
        Notification notification = new Notification();
        notification.setMessage("New support request from " + supportRequest.getName());
        notification.setTimestamp(LocalDateTime.now());
        notification.setSupportRequest(savedSupportRequest);
        notificationService.saveNotification(notification);

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

    @PatchMapping("/notifications/{id}/mark-as-read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id) {
        Notification notification = notificationService.getNotificationById(id);
        if (notification != null) {
            notification.setRead(true);
            notificationService.saveNotification(notification);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
