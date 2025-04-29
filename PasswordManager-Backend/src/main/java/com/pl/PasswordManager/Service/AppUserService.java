package com.pl.PasswordManager.Service;


import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Repository.AppUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public AppUser register(AppUser appUser) {
        if (appUserRepository.findByUsername(appUser.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }

    appUser.setPassword(encoder.encode(appUser.getPassword()));
    return appUserRepository.save(appUser);
}

    public boolean deleteAppUser(AppUser appUser) {
        if (appUserRepository.existsById(appUser.getAppUserID())) {
            appUserRepository.delete(appUser);
            return true;
        }
        return false;

    }

}
