package com.pl.PasswordManager.Controller;


import com.pl.PasswordManager.Entities.Account;
import com.pl.PasswordManager.Service.AccountService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/getAccountByAppUser/{appUserId}")
    public List<Account> getAccountsByAppUser(@PathVariable int appUserId) {
        return accountService.getAccountsByAppUserID(appUserId);
    }

    @PostMapping("/addAcount")
    public Account addAccount(@RequestBody Account account) {
        return accountService.addAccount(account);
    }

}
