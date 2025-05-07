package com.pl.PasswordManager.Service;


import com.pl.PasswordManager.Auth.JwtService;
import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Repository.AppUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AppUser register(AppUser appUser) {
        if (appUserRepository.findByUsername(appUser.getUsername()) != null) {
            throw new IllegalStateException("Username already exists");
        }
        appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));
        return appUserRepository.save(appUser);
    }

    @Transactional
    public boolean deleteAppUser(AppUser appUser) {
        if (appUserRepository.existsById(appUser.getAppUserID())) {
            appUserRepository.delete(appUser);
            return true;
        }
        return false;

    }

    public String verify(AppUser appUser) throws AuthenticationException, IllegalAccessException {
        try {
            Authentication authentication = authenticationManager.authenticate
                    (new UsernamePasswordAuthenticationToken
                            (appUser.getUsername(), appUser.getPassword()
                            ));
            if (authentication.isAuthenticated()) {
                return jwtService.generateToken(appUser);
            }
            else {
                throw new IllegalAccessException("User not authenticated");
            }
        } catch (AuthenticationException e) {
            throw new IllegalAccessException("Bad credentials");
        }


    }

}
