package com.pl.PasswordManager.Controller;


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

    @GetMapping("/getAccountsByAppUser/{appUserId}")
    public ResponseEntity<List<Account>> getAccountsByAppUser(@PathVariable int appUserId) {
        List<Account> dbAccount = accountService.getAccountsByAppUserID(appUserId);

        if (dbAccount == null || Objects.requireNonNull(dbAccount).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        else {
            return new ResponseEntity<>(dbAccount, HttpStatus.OK);
        }


    }

    @PostMapping("/addAccount")
    public ResponseEntity<Account> addAccount(@RequestBody Account account) {
        return ResponseEntity.ok(accountService.addAccount(account));
    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<String> deleteAccount(@RequestBody Account account) {
            if (accountService.deleteAccount(account)) {
                return ResponseEntity.ok("Account: " + account.getAccountName() + " deleted successfully");
            }
            else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account: " + account.getAccountName() + "not found");
            }
        }
    @PutMapping
    public ResponseEntity<Account> updateAccount(@RequestBody Account account) {
        if (account.getAccountName() == null ||
                account.getAccountEmail() == null ||
                account.getAccountPassword() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Account updatedAccount = accountService.updateAccount(account);
        if (updatedAccount != null) {
            return ResponseEntity.ok(updatedAccount);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }




    }
