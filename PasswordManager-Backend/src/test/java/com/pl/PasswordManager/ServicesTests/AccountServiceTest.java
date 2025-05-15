package com.pl.PasswordManager.ServicesTests;

import com.pl.PasswordManager.Entities.Account;
import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Repository.AccountRepository;
import com.pl.PasswordManager.Repository.AppUserRepository;
import com.pl.PasswordManager.Service.AccountService;
import com.pl.PasswordManager.Service.AesService;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {

    @InjectMocks
    private AccountService accountService;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private AesService aesService;


    @Test
    public void testGetAccountsByOrderID_shouldReturnOrders() throws IllegalBlockSizeException, NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account = new Account();
        account.setAccountName("accountName");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail");
        account.setAccountPassword("encryptedPassword1");

        Account account1 = new Account();
        account1.setAccountName("accountName1");
        account1.setAppUserProfileID(appUser);
        account1.setAccountEmail("accountEmail1");
        account1.setAccountPassword("encryptedPassword2");

        List<Account> encryptedAccounts = List.of(account, account1);

        when(appUserRepository.findById(appUser.getAppUserID()))
                .thenReturn(Optional.of(appUser));
        when(accountRepository.findByAppUserProfileID(appUser))
                .thenReturn(encryptedAccounts);
        when(aesService.decryptPassword("encryptedPassword1"))
                .thenReturn("decryptedPassword1");
        when(aesService.decryptPassword("encryptedPassword2"))
                .thenReturn("decryptedPassword2");


        List<Account> result = accountService.getAccountsByAppUserID(appUser.getAppUserID());

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("decryptedPassword1", result.get(0).getAccountPassword());
        assertEquals("decryptedPassword2", result.get(1).getAccountPassword());

        verify(appUserRepository).findById(appUser.getAppUserID());
        verify(accountRepository).findByAppUserProfileID(appUser);
        verify(aesService, times(2)).decryptPassword(anyString());

    }

    @Test
    public void testGetAccountsByOrderID_NoUserInDb_shouldThrowRuntimeException() {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");


        when(appUserRepository.findById(appUser.getAppUserID()))
                .thenReturn(null);

        assertThrows(RuntimeException.class, () -> accountService.getAccountsByAppUserID(appUser.getAppUserID()));


    }

    @Test
    public void testGetAccountsByOrderID_NoSuchAlgorithmException_shouldThrowNoSuchAlgoritm()
            throws IllegalBlockSizeException, NoSuchPaddingException,
            NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {

        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account = new Account();
        account.setAccountName("accountName");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail");
        account.setAccountPassword("encryptedPassword1");

        Account account1 = new Account();
        account1.setAccountName("accountName1");
        account1.setAppUserProfileID(appUser);
        account1.setAccountEmail("accountEmail1");
        account1.setAccountPassword("encryptedPassword2");

        List<Account> encryptedAccounts = List.of(account, account1);

        when(appUserRepository.findById(appUser.getAppUserID()))
                .thenReturn(Optional.of(appUser));
        when(accountRepository.findByAppUserProfileID(appUser))
                .thenReturn(encryptedAccounts);
        when(aesService.decryptPassword("encryptedPassword1"))
                .thenThrow(NoSuchAlgorithmException.class);

        assertThrows(RuntimeException.class, () -> accountService.getAccountsByAppUserID(appUser.getAppUserID()));

    }

    @Test
    public void testGetAccountsByOrderID_InvalidKeyException_shouldThrowNoSuchAlgoritm()
            throws IllegalBlockSizeException, NoSuchPaddingException,
            NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {

        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account = new Account();
        account.setAccountName("accountName");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail");
        account.setAccountPassword("encryptedPassword1");

        Account account1 = new Account();
        account1.setAccountName("accountName1");
        account1.setAppUserProfileID(appUser);
        account1.setAccountEmail("accountEmail1");
        account1.setAccountPassword("encryptedPassword2");

        List<Account> encryptedAccounts = List.of(account, account1);

        when(appUserRepository.findById(appUser.getAppUserID()))
                .thenReturn(Optional.of(appUser));
        when(accountRepository.findByAppUserProfileID(appUser))
                .thenReturn(encryptedAccounts);
        when(aesService.decryptPassword("encryptedPassword1"))
                .thenThrow(InvalidKeyException.class);

        assertThrows(RuntimeException.class, () -> accountService.getAccountsByAppUserID(appUser.getAppUserID()));

    }

    @Test
    public void testGetAccountsByOrderID_BadPaddingException_shouldThrowNoSuchAlgoritm()
            throws IllegalBlockSizeException, NoSuchPaddingException,
            NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {

        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account = new Account();
        account.setAccountName("accountName");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail");
        account.setAccountPassword("encryptedPassword1");

        Account account1 = new Account();
        account1.setAccountName("accountName1");
        account1.setAppUserProfileID(appUser);
        account1.setAccountEmail("accountEmail1");
        account1.setAccountPassword("encryptedPassword2");

        List<Account> encryptedAccounts = List.of(account, account1);

        when(appUserRepository.findById(appUser.getAppUserID()))
                .thenReturn(Optional.of(appUser));
        when(accountRepository.findByAppUserProfileID(appUser))
                .thenReturn(encryptedAccounts);
        when(aesService.decryptPassword("encryptedPassword1"))
                .thenThrow(BadPaddingException.class);

        assertThrows(RuntimeException.class, () -> accountService.getAccountsByAppUserID(appUser.getAppUserID()));

    }

    @Test
    public void testGetAccountsByOrderID_IIllegalBlockSizeException_shouldThrowNoSuchAlgoritm()
            throws IllegalBlockSizeException, NoSuchPaddingException,
            NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {

        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account = new Account();
        account.setAccountName("accountName");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail");
        account.setAccountPassword("encryptedPassword1");

        Account account1 = new Account();
        account1.setAccountName("accountName1");
        account1.setAppUserProfileID(appUser);
        account1.setAccountEmail("accountEmail1");
        account1.setAccountPassword("encryptedPassword2");

        List<Account> encryptedAccounts = List.of(account, account1);

        when(appUserRepository.findById(appUser.getAppUserID()))
                .thenReturn(Optional.of(appUser));
        when(accountRepository.findByAppUserProfileID(appUser))
                .thenReturn(encryptedAccounts);
        when(aesService.decryptPassword("encryptedPassword1"))
                .thenThrow(IllegalBlockSizeException.class);

        assertThrows(RuntimeException.class, () -> accountService.getAccountsByAppUserID(appUser.getAppUserID()));

    }

    @Test
    public void testGetAccountsByOrderID_NoSuchPaddingException_shouldThrowNoSuchAlgoritm()
            throws IllegalBlockSizeException, NoSuchPaddingException,
            NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {

        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account = new Account();
        account.setAccountName("accountName");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail");
        account.setAccountPassword("encryptedPassword1");

        Account account1 = new Account();
        account1.setAccountName("accountName1");
        account1.setAppUserProfileID(appUser);
        account1.setAccountEmail("accountEmail1");
        account1.setAccountPassword("encryptedPassword2");

        List<Account> encryptedAccounts = List.of(account, account1);

        when(appUserRepository.findById(appUser.getAppUserID()))
                .thenReturn(Optional.of(appUser));
        when(accountRepository.findByAppUserProfileID(appUser))
                .thenReturn(encryptedAccounts);
        when(aesService.decryptPassword("encryptedPassword1"))
                .thenThrow(NoSuchPaddingException.class);

        assertThrows(RuntimeException.class, () -> accountService.getAccountsByAppUserID(appUser.getAppUserID()));

    }

    @Test
    public void testAddAccount_shouldAddAccount() throws Exception {

        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account = new Account();
        account.setAccountName("accountName");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail");
        account.setAccountPassword("password");

        when(aesService.encryptPassword(anyString()))
                .thenReturn("encryptedPassword");
        when(accountRepository.save(any(Account.class)))
                .thenReturn(account);

        Account result = accountService.addAccount(account);

        assertNotNull(result);
        assertEquals(account.getAccountName(), result.getAccountName());
        assertEquals(account.getAppUserProfileID(), result.getAppUserProfileID());
        assertEquals(account.getAccountEmail(), result.getAccountEmail());
        assertEquals("encryptedPassword", result.getAccountPassword());
    }

    @Test
    public void testAddAccount_NoSuchAlgoritm_Works_onEveryEceptionInCatchBlock_shouldThrowException()
            throws Exception {

        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account = new Account();
        account.setAccountName("accountName");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail");
        account.setAccountPassword("password");

        when(aesService.encryptPassword(anyString()))
                .thenThrow(NoSuchAlgorithmException.class);

        assertThrows(Exception.class, () -> accountService.addAccount(account));
    }

    @Test
    public void testDeleteAccount_shouldDeleteAccountAndReturnTrue() {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account = new Account();
        account.setAccountName("accountName");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail");
        account.setAccountPassword("password");

        when(accountRepository.existsById(anyInt()))
                .thenReturn(true);
        doNothing().when(accountRepository).delete(account);

        boolean result = accountService.deleteAccount(account);
        assertTrue(result);
    }

    @Test
    public void testDeleteAccount_shouldReturnFalse() {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account = new Account();
        account.setAccountName("accountName");
        account.setAppUserProfileID(appUser);
        account.setAccountEmail("accountEmail");
        account.setAccountPassword("password");

        when(accountRepository.existsById(anyInt()))
                .thenReturn(false);

        boolean result = accountService.deleteAccount(account);
        assertFalse(result);
    }

    @Test
    public void testUpdateAccount_shouldUpdateAccount() throws Exception {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account existingAccount = new Account();
        existingAccount.setAccountName("accountName");
        existingAccount.setAppUserProfileID(appUser);
        existingAccount.setAccountEmail("accountEmail");
        existingAccount.setAccountPassword("password");

        Account updatedAccount = new Account();
        updatedAccount.setAccountName("changedName");
        updatedAccount.setAppUserProfileID(appUser);
        updatedAccount.setAccountEmail("changedEmail");
        updatedAccount.setAccountPassword("changedPassword");

        when(accountRepository.findByAccountID(anyInt()))
                .thenReturn(Optional.of(existingAccount));
        when(aesService.encryptPassword(anyString()))
                .thenReturn("encryptedChangedPassword");
        when(accountRepository.save(any(Account.class)))
                .thenReturn(updatedAccount);

        Account result = accountService.updateAccount(updatedAccount);

        assertEquals("changedName", result.getAccountName());
        assertEquals("changedEmail", result.getAccountEmail());
        assertEquals("encryptedChangedPassword", result.getAccountPassword());
        assertEquals(existingAccount.getAppUserProfileID(), result.getAppUserProfileID());
    }

    @Test
    public void testUpdateAccount_NoUserInDb_shouldThrowIllegalArgumentException() {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account existingAccount = new Account();
        existingAccount.setAccountName("accountName");
        existingAccount.setAppUserProfileID(appUser);
        existingAccount.setAccountEmail("accountEmail");
        existingAccount.setAccountPassword("password");

        Account updatedAccount = new Account();
        updatedAccount.setAccountName("changedName");
        updatedAccount.setAppUserProfileID(appUser);
        updatedAccount.setAccountEmail("changedEmail");
        updatedAccount.setAccountPassword("changedPassword");

        when(accountRepository.findByAccountID(anyInt()))
                .thenReturn(Optional.empty());


        assertThrows(IllegalArgumentException.class, () -> accountService.updateAccount(existingAccount));

    }

    @Test
    public void testUpdateAccount_catchBlockActivated_shouldThrowException() throws Exception {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account existingAccount = new Account();
        existingAccount.setAccountName("accountName");
        existingAccount.setAppUserProfileID(appUser);
        existingAccount.setAccountEmail("accountEmail");
        existingAccount.setAccountPassword("password");

        Account updatedAccount = new Account();
        updatedAccount.setAccountName("changedName");
        updatedAccount.setAppUserProfileID(appUser);
        updatedAccount.setAccountEmail("changedEmail");
        updatedAccount.setAccountPassword("changedPassword");

        when(accountRepository.findByAccountID(anyInt()))
                .thenReturn(Optional.of(existingAccount));
        when(aesService.encryptPassword(anyString()))
                .thenThrow(NoSuchAlgorithmException.class);

        assertThrows(Exception.class, () -> accountService.updateAccount(existingAccount));
    }
}