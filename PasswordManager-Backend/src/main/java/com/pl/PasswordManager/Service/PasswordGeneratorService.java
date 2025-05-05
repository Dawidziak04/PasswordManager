package com.pl.PasswordManager.Service;

import com.pl.PasswordManager.DTO.GeneratedPassword;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class PasswordGeneratorService {

    public String generatePassword(GeneratedPassword generatedPassword) throws IllegalArgumentException {
        Random random = new Random();
        List<Character> lowercaseLetters = List.of(
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
        );

        List<Character> uppercaseLetters = List.of(
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        );

        List<Character> digits = List.of(
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        );

        List<Character> symbols = List.of(
                '!', '@', '#', '$', '%', '^', '&', '*', '-', '_',
                '=', '+', ';', ':', ',', '.', '<', '>', '?'
        );


        List<Character> allCharacters = new ArrayList<>();

        if (generatedPassword.isLower()) {
            allCharacters.addAll(lowercaseLetters);
        }
        if (generatedPassword.isUpper()) {
            allCharacters.addAll(uppercaseLetters);
        }
        if (generatedPassword.isDigit()) {
            allCharacters.addAll(digits);
        }
        if (generatedPassword.isSymbols()) {
            allCharacters.addAll(symbols);
        }

        StringBuilder password = new StringBuilder();

        for (int i = 0; i < generatedPassword.getLength(); i++) {
            int randomIndex = random.nextInt(allCharacters.size());
            password.append(allCharacters.get(randomIndex));
        }

        return password.toString();

        }

    }