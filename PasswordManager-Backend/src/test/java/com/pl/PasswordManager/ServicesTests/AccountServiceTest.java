package com.pl.PasswordManager.ServicesTests;

import com.pl.PasswordManager.Entities.Account;
import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Repository.AccountRepository;
import com.pl.PasswordManager.Repository.AppUserRepository;
import com.pl.PasswordManager.Service.AccountService;
import com.pl.PasswordManager.Service.AwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {

    @InjectMocks
    private AccountService accountService;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private AwtService awtService;


    @Test
    public void testGetAccountsByOrderID_shouldReturnOrders() throws IllegalBlockSizeException, NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account = new Account();
        account.setAccountName("accountName");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail");
        account.setAccountPassword("encryptedPassword");

        Account account1 = new Account();
        account.setAccountName("accountName1");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail1");
        account.setAccountPassword("encryptedPassword1");

        List<Account> accounts = List.of(account, account1);

        when(appUserRepository.findById(appUser.getAppUserID()))
                .thenReturn(Optional.of(appUser));
        when(accountRepository.findByAppUserProfileID(appUser))
                .thenReturn(accounts);
        when(awtService.decryptPassword(any()))
                .thenReturn("decryptedPassword");



    }

}
