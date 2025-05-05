package com.pl.PasswordManager.Controller;

import com.pl.PasswordManager.DTO.GeneratedPassword;
import com.pl.PasswordManager.Service.PasswordGeneratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PasswordGeneratorController {

    private final PasswordGeneratorService passwordGeneratorService;

    public PasswordGeneratorController(PasswordGeneratorService passwordGeneratorService) {
        this.passwordGeneratorService = passwordGeneratorService;
    }

    @PostMapping("/generatePassword")
    public ResponseEntity<String> generatePassword(@RequestBody GeneratedPassword generatedPassword) {
        if (!generatedPassword.isLower() && !generatedPassword.isUpper() && !generatedPassword.isDigit() && !generatedPassword.isSymbols()) {
            return ResponseEntity.badRequest().body("Please select at least one option");
        }
        if (generatedPassword.getLength() == 0) {
            return ResponseEntity.badRequest().body("Password length cannot be zero");
        }
        return ResponseEntity.ok(passwordGeneratorService.generatePassword(generatedPassword));
    }
}