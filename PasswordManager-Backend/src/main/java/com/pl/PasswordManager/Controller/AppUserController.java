package com.pl.PasswordManager.Controller;

import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Repository.AppUserRepository;
import com.pl.PasswordManager.Service.AppUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
public class AppUserController {

    private final AppUserService appUserService;
    private final AppUserRepository appUserRepository;

    public AppUserController(AppUserService appUserService, AppUserRepository appUserRepository) {
        this.appUserService = appUserService;
        this.appUserRepository = appUserRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AppUser> register(@RequestBody AppUser appUser) {
        if (appUserRepository.existsByUsername(appUser.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        return ResponseEntity.ok(appUserService.register(appUser));
    }

    @DeleteMapping("/deleteAppUser")
    public ResponseEntity<String> deleteAppUser(@RequestBody AppUser appUser) {
        if (appUserService.deleteAppUser(appUser)) {
            return ResponseEntity.status(HttpStatus.OK).body("User: " + appUser.getUsername() + " deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User: " + appUser.getUsername() + " not found");
    }

}
