package com.pfa.backend.config;

import com.pfa.backend.Auth.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

@Configuration
public class AdminInitializer {

    private final AuthenticationService authenticationService;

    @Autowired
    public AdminInitializer(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostConstruct
    public void init() {
        authenticationService.registerAdmin();
    }
}