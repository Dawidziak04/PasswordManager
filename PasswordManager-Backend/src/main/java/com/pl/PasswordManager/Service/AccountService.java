package com.pl.PasswordManager.Service;

import com.pl.PasswordManager.Entities.Account;
import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Repository.AccountRepository;
import com.pl.PasswordManager.Repository.AppUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final AppUserRepository appUserRepository;

    public AccountService(AccountRepository accountRepository, AppUserRepository appUserRepository) {
        this.accountRepository = accountRepository;
        this.appUserRepository = appUserRepository;
    }

public List<Account> getAccountsByAppUserID(int appUserID) {
        AppUser appUser = appUserRepository.findById(appUserID)
           .orElseThrow(() -> new RuntimeException("User not found"));
    return accountRepository.findByAppUserProfileID(appUser);
}

public Account addAccount(Account account) {
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

public Account updateAccount(Account updatedAccount) {
    Optional<Account> existingAccount = accountRepository.findByAccountID(updatedAccount.getAccountID());
    if (existingAccount.isPresent()) {
        Account accountToUpdate = existingAccount.get();
        accountToUpdate.setAccountID(updatedAccount.getAccountID());
        accountToUpdate.setAccountEmail(updatedAccount.getAccountEmail());
        accountToUpdate.setAccountPassword(updatedAccount.getAccountPassword());
        accountRepository.save(accountToUpdate);
        return accountToUpdate;
    }
    return null;
}

}
