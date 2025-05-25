package com.pl.PasswordManager.Controller;


import com.pl.PasswordManager.Auth.JwtService;
import com.pl.PasswordManager.Auth.LoginRequired;
import com.pl.PasswordManager.DTO.AccountDTO;
import com.pl.PasswordManager.Entities.Account;
import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Repository.AppUserRepository;
import com.pl.PasswordManager.Service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AccountController {

    private final AccountService accountService;
    private final AppUserRepository appUserRepository;
    private final JwtService jwtService;

    public AccountController(AccountService accountService, AppUserRepository appUserRepository, JwtService jwtService) {
        this.accountService = accountService;
        this.appUserRepository = appUserRepository;
        this.jwtService = jwtService;
    }


    @LoginRequired
    @GetMapping("/getAccountsByAppUserId")
    public ResponseEntity<List<Account>> getAccountsByAppUser(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        List<Account> dbAccount;
        try {
            dbAccount = accountService.getAccountsByAppUserID(jwtService.extractID(token));
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
    public ResponseEntity<Account> addAccount(@RequestBody AccountDTO accountDTO,
                                              @RequestHeader("Authorization") String authHeader
                                              ) throws Exception {

        String token = authHeader.replace("Bearer ", "");
        Optional<AppUser> appUser = appUserRepository.findById(jwtService.extractID(token));

        Account account = new Account();
        appUser.ifPresent(account::setAppUserProfileID);
        account.setAccountName(accountDTO.getAccountName());
        account.setAccountEmail(accountDTO.getAccountEmail());
        account.setAccountPassword(accountDTO.getAccountPassword());

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
    @PutMapping("/updateAccount")
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
