package com.pl.PasswordManager.Service;

import com.pl.PasswordManager.Entities.Account;
import com.pl.PasswordManager.Repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

public List<Account> getAccountsByAppUserID(int appUserID) {
    //AppUser appUser = appUserRepository.findByAppUserID(appUserID)
    //        .orElseThrow(() -> new RuntimeException("User not found"));
    //      We dont need verification if user exists, because we
    //                       cant create an account if we are not an app user
    //                                          but you can add up if you need to
    return accountRepository.findByAppUserID(appUserID);
}

public Account addAccount(Account account) {
        return accountRepository.save(account);
}

}
