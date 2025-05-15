package com.pl.PasswordManager.Controller;


import com.pl.PasswordManager.Auth.LoginRequired;
import com.pl.PasswordManager.Entities.Account;
import com.pl.PasswordManager.Service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }


    @LoginRequired
    @GetMapping("/getAccountsByAppUserId/{appUserID}")
    public ResponseEntity<List<Account>> getAccountsByAppUser(@PathVariable int appUserID) {
        System.out.println(appUserID);
        List<Account> dbAccount;
        try {
            dbAccount = accountService.getAccountsByAppUserID(appUserID);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (dbAccount == null || Objects.requireNonNull(dbAccount).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        else {
            return new ResponseEntity<>(dbAccount, HttpStatus.OK);
        }


    }

    @LoginRequired
    @PostMapping("/addAccount")
    public ResponseEntity<Account> addAccount(@RequestBody Account account) throws Exception {
        try {
            return ResponseEntity.ok(accountService.addAccount(account));
        } catch (Exception e) {
            throw new Exception("Server error");
        }
    }

    @LoginRequired
    @DeleteMapping("/deleteAccount")
    public ResponseEntity<String> deleteAccount(@RequestBody Account account) {
        if (accountService.deleteAccount(account)) {
            return ResponseEntity.ok("Account: " + account.getAccountName() + " deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account: " + account.getAccountName() + "not found");
        }
    }

    @LoginRequired
    @PutMapping
    public ResponseEntity<Account> updateAccount(@RequestBody Account account) {
        if (account.getAccountName() == null ||
                account.getAccountEmail() == null ||
                account.getAccountPassword() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Account updatedAccount;

        try {
            updatedAccount = accountService.updateAccount(account);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (updatedAccount != null) {
            return ResponseEntity.ok(updatedAccount);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }




    }
