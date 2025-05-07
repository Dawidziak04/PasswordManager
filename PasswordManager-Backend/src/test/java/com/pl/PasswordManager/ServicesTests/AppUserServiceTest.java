package com.pl.PasswordManager.ServicesTests;

import com.pl.PasswordManager.Auth.JwtService;
import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Repository.AppUserRepository;
import com.pl.PasswordManager.Service.AppUserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AppUserServiceTest {

    @InjectMocks
    private AppUserService appUserService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;


    @Test
    public void testregister_shouldSaveAppUser() {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("rawpassword");

        when(appUserRepository.findByUsername("username"))
                .thenReturn(null);
        when(passwordEncoder.encode(appUser.getPassword()))
                .thenReturn("encodedPassword");
        when(appUserRepository.save(any(AppUser.class)))
                .thenReturn(appUser);

        AppUser savedAppUser = appUserService.register(appUser);

        assertEquals("username", savedAppUser.getUsername());
        assertEquals("encodedPassword", savedAppUser.getPassword());
    }

    @Test
    public void testregister_AlreadyUsedUsername_shouldThrowIllegalStateException() {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("rawpassword");

        AppUser appUser2 = new AppUser();
        appUser2.setUsername("username");
        appUser2.setPassword("rawpassword2");

        when(appUserRepository.findByUsername("username"))
                .thenReturn(appUser2);
        assertThrows(IllegalStateException.class, () -> appUserService.register(appUser));
    }

    @Test
    public void testDeleteAppUser_shouldDeleteAppUser() {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("rawpassword");
        when(appUserRepository.existsById(appUser.getAppUserID()))
                .thenReturn(true);
        doNothing().when(appUserRepository).delete(appUser);

        boolean result = appUserService.deleteAppUser(appUser);

        assertTrue(result);

        verify(appUserRepository, times(1)).delete(appUser);

    }

    @Test
    public void testDeleteAppUser_shouldReturnFalse() {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("rawpassword");
        when(appUserRepository.existsById(appUser.getAppUserID()))
                .thenReturn(false);

        boolean result = appUserService.deleteAppUser(appUser);

        assertFalse(result);
    }

    @Test
    public void testVerify_shouldReturnToken() throws IllegalAccessException {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.isAuthenticated())
                .thenReturn(true);
        when(jwtService.generateToken(appUser))
                .thenReturn("mocked-jwt-token");

        String token = appUserService.verify(appUser);

        assertEquals("mocked-jwt-token", token);
        verify(jwtService, times(1)).generateToken(appUser);
    }

    @Test
    public void testVerify_badCredentials_shouldThrowIllegalAccessException() {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new AuthenticationException("Bad credentials") {});


        IllegalAccessException exception = assertThrows(IllegalAccessException.class,
                () -> appUserService.verify(appUser));

        assertEquals("Bad credentials", exception.getMessage());

    }

    @Test
    public void testVerify_notAuthenticated_shouldThrowIllegalAccessException() {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.isAuthenticated())
                .thenReturn(false);

        assertThrows(IllegalAccessException.class, () -> appUserService.verify(appUser));

    }



}
