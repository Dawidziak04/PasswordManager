package com.pl.PasswordManager.Controller;

import com.pl.PasswordManager.Auth.LoginRequired;
import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Repository.AppUserRepository;
import com.pl.PasswordManager.Service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class AppUserController {

    private final AppUserService appUserService;
    private final AppUserRepository appUserRepository;

    @PostMapping("/register")
    public ResponseEntity<AppUser> register(@RequestBody AppUser appUser) throws IllegalStateException {
        if (appUserRepository.existsByUsername(appUser.getUsername())) {
            throw new IllegalStateException("Username already exists");
        }
        if (appUser.getPassword().length() < 6) {
            throw new IllegalStateException("Password must be at least 6 characters");
        }
        if (appUser.getUsername().isEmpty()) {
            throw new IllegalStateException("Username cannot be empty");
        }
        return ResponseEntity.ok(appUserService.register(appUser));
    }

    @LoginRequired
    @DeleteMapping("/deleteAppUser")
    public ResponseEntity<String> deleteAppUser(@RequestBody AppUser appUser) {
        if (appUserService.deleteAppUser(appUser)) {
            return ResponseEntity.status(HttpStatus.OK).body("User: " + appUser.getUsername() + " deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User: " + appUser.getUsername() + " not found");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AppUser appUser) throws IllegalAccessException {
        try {
            String token = appUserService.verify(appUser);
            if (token == null) {
                throw new IllegalAccessException("Bad token");
            }
            return ResponseEntity.ok(Map.of("token", token));
        } catch (AuthenticationException e) {
            throw new IllegalAccessException("Incorrect username or password");
        }

    }

}
