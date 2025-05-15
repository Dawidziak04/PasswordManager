package com.pl.PasswordManager.Service;


import org.springframework.stereotype.Service;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
public class AesService {


    private SecretKey getAesKey() {
        String keyAsString = "cZ4xrIEESUMCnEFe1T5YVszV4tg2oIvOw3UziD8FnTo=";
        byte[] decodedKey = Base64.getDecoder().decode(keyAsString);
        return new SecretKeySpec(decodedKey, 0, decodedKey.length, "AES");
    }




    public String encryptPassword(String password) throws NoSuchPaddingException,
            NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {

        Cipher cipherEncrypt = Cipher.getInstance("AES");

        cipherEncrypt.init(Cipher.ENCRYPT_MODE, getAesKey());
        byte [] encryptedBytes = cipherEncrypt.doFinal(password.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public String decryptPassword(String password) throws NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, NoSuchPaddingException {

        Cipher cipherDecrypt = Cipher.getInstance("AES");

        cipherDecrypt.init(Cipher.DECRYPT_MODE, getAesKey());
        byte [] decryptedBytes = cipherDecrypt.doFinal(Base64.getDecoder().decode(password));
        return new String(decryptedBytes);

    }

}
