package com.pl.PasswordManager.ServicesTests;

import com.pl.PasswordManager.DTO.GeneratedPassword;
import com.pl.PasswordManager.Service.PasswordGeneratorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class PasswordGeneratorServiceTest {

    @InjectMocks
    private PasswordGeneratorService passwordGeneratorService;

    @Test
    public void testGeneratePassword_onlyLowercase_shouldGeneratePassword() {
        GeneratedPassword input = new GeneratedPassword(true, false, false, false, 1000);
        String password = passwordGeneratorService.generatePassword(input);
        assertEquals(1000, password.length());
        assertTrue(password.matches("[a-z]+"));
    }

    @Test
    public void testGeneratePassword_onlyUppercase_shouldGeneratePassword() {
        GeneratedPassword input = new GeneratedPassword(false, true, false, false, 1000);
        String password = passwordGeneratorService.generatePassword(input);
        assertEquals(1000, password.length());
        assertTrue(password.matches("[A-Z]+"));
    }

    @Test
    public void testGeneratePassword_onlyDigit_shouldGeneratePassword() {
        GeneratedPassword input = new GeneratedPassword(false, false, true, false, 1000);
        String password = passwordGeneratorService.generatePassword(input);
        assertEquals(1000, password.length());
        assertTrue(password.matches("[0-9]+"));
    }

    @Test
    public void testGeneratePassword_onlySymbols_shouldGeneratePassword() {
        GeneratedPassword input = new GeneratedPassword(false, false, false, true, 1000);
        String password = passwordGeneratorService.generatePassword(input);
        assertEquals(1000, password.length());
        assertTrue(password.matches("[!@#$%^&*-_=+;:,.<>?]+"));
    }

    @Test
    public void testGeneratePassword_allOptions_shouldGeneratePassword() {
        GeneratedPassword input = new GeneratedPassword(true, true, true, true, 1500);
        String password = passwordGeneratorService.generatePassword(input);
        assertEquals(1500, password.length());
        assertTrue(password.matches("[a-zA-Z0-9!@#$%^&*\\-_=+;:,.<>?]+"));
    }

    @Test
    public void testGeneratePassword_allOptionsOFF_shouldGenerateEmptyPassword() {
        GeneratedPassword input = new GeneratedPassword(false, false, false, false, 0);
        String password = passwordGeneratorService.generatePassword(input);
        assertEquals(0, password.length());
    }

    @Test
    public void testGeneratePassword_allOptionsOFF_shouldThrowIllegalArgumentException() {
        GeneratedPassword input = new GeneratedPassword(false, false, false, false, 10);
        assertThrows(IllegalArgumentException.class, () -> passwordGeneratorService.generatePassword(input));
    }

}
