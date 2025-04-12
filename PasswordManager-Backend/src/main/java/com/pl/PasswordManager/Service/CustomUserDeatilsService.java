package com.pl.PasswordManager.Service;

import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Entities.AppUserPrincipal;
import com.pl.PasswordManager.Repository.AppUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDeatilsService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    public CustomUserDeatilsService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = appUserRepository.findByUsername(username);

        if (appUser == null) {
            System.out.printf("Username %s not found: ", username);
            throw new UsernameNotFoundException("Username: " + username + " not found");
        }

        return new AppUserPrincipal(appUser);
    }
    }
