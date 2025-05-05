package com.pl.PasswordManager.Service;

import com.pl.PasswordManager.Entities.Account;
import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Repository.AccountRepository;
import com.pl.PasswordManager.Repository.AppUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final AppUserRepository appUserRepository;
    private final AwtService awtService;


public List<Account> getAccountsByAppUserID(int appUserID) {
        AppUser appUser = appUserRepository.findById(appUserID)
           .orElseThrow(() -> new RuntimeException("User not found"));
        List<Account> accounts = accountRepository.findByAppUserProfileID(appUser);
        accounts.parallelStream().forEach(account -> {
            String decryptedPassword;
            try {
                decryptedPassword = awtService.decryptPassword(account.getAccountPassword());
            } catch (NoSuchAlgorithmException | InvalidKeyException | IllegalBlockSizeException | BadPaddingException |
                     NoSuchPaddingException e) {
                throw new RuntimeException(e);
            }
            account.setAccountPassword(decryptedPassword);
        });
    return accounts;
}

public Account addAccount(Account account) throws Exception {
    try {
        account.setAccountPassword(awtService.encryptPassword(account.getAccountPassword()));
    } catch (NoSuchPaddingException | NoSuchAlgorithmException | InvalidKeyException | IllegalBlockSizeException |
             BadPaddingException e) {
        throw new Exception("Server error");
    }
    return accountRepository.save(account);
}

@Transactional
public boolean deleteAccount(Account account) {
    if (accountRepository.existsById(account.getAccountID())) {
        accountRepository.delete(account);
        return true;
    }
    return false;

}

public Account updateAccount(Account updatedAccount) throws Exception {
    Optional<Account> existingAccount = accountRepository.findByAccountID(updatedAccount.getAccountID());
    try {
    if (existingAccount.isPresent()) {
        Account accountToUpdate = existingAccount.get();
        accountToUpdate.setAccountID(updatedAccount.getAccountID());
        accountToUpdate.setAccountEmail(updatedAccount.getAccountEmail());
        accountToUpdate.setAccountPassword(awtService.encryptPassword(updatedAccount.getAccountPassword()));
        accountRepository.save(accountToUpdate);
        return accountToUpdate;
    }
    } catch (NoSuchPaddingException | NoSuchAlgorithmException | InvalidKeyException | IllegalBlockSizeException |
             BadPaddingException e) {
        throw new Exception("Server error");
    }
    return null;
}

}
