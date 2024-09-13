package com.pfa.backend.Auth;

import com.pfa.backend.config.JwtService;
import com.pfa.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @Autowired
    private ServiceJwtTokenProvider jwtTokenProvider; // Assurez-vous d'avoir un service pour manipuler les tokens JWT
    private final JwtService jwtService;  // Utilisé pour traiter les tokens JWT
    @GetMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            boolean isValid = jwtTokenProvider.validateToken(token);
            if (isValid) {
                return ResponseEntity.ok("Valid token");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token validation failed");
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthenticationResponse response = service.register(request);
            return ResponseEntity.ok(response);
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        try {
            AuthenticationResponse response = service.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Retourner une réponse JSON même pour les erreurs d'authentification
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Accès refusé: " + e.getMessage()));
        }
    }


    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUser(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // Extraire le token de l'en-tête
            String token = authorizationHeader.replace("Bearer ", "");

            // Extraire l'email à partir du token
            String email = jwtService.extractUsername(token);

            // Récupérer l'utilisateur à partir de l'email
            User user = service.findByEmail(email);

            if (user != null) {
                // Retourner les informations de l'utilisateur (sans le mot de passe)
                return ResponseEntity.ok(Map.of(
                        "firstname", user.getFirstname(),
                        "lastname", user.getLastname(),
                        "email", user.getEmail(),
                        "role", user.getRole().name()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non trouvé");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalide ou expiré");
        }
    }

}