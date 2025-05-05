package com.pl.PasswordManager.Service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.*;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AwtService {


    private SecretKey getAwtKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        return keyGen.generateKey();
    }


    public String encryptPassword(String password) throws NoSuchPaddingException,
            NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {

        Cipher cipherEncrypt = Cipher.getInstance("AES");

        cipherEncrypt.init(Cipher.ENCRYPT_MODE, getAwtKey());
        byte [] encryptedBytes = cipherEncrypt.doFinal(password.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public String decryptPassword(String password) throws NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, NoSuchPaddingException {

        Cipher cipherDecrypt = Cipher.getInstance("AES");

        cipherDecrypt.init(Cipher.DECRYPT_MODE, getAwtKey());
        byte [] decryptedBytes = cipherDecrypt.doFinal(Base64.getDecoder().decode(password));
        return new String(decryptedBytes);

    }

}
