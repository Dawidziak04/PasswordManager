package com.pl.PasswordManager.ControllersTests;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pl.PasswordManager.Auth.JwtFillter;
import com.pl.PasswordManager.Auth.JwtService;
import com.pl.PasswordManager.Configs.TestSecurityConfig;
import com.pl.PasswordManager.Controller.AccountController;
import com.pl.PasswordManager.Entities.Account;
import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Service.AccountService;
import com.pl.PasswordManager.Service.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import(TestSecurityConfig.class)
@WebMvcTest(AccountController.class)
public class AccountControllerTest {

    @MockitoBean
    private AccountService accountService;

    @MockitoBean
    CustomUserDetailsService customUserDetailsService;

    @InjectMocks
    private AccountController accountController;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtFillter jwtFillter;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;


    @Test
    public void testGetAccountsByAppUser_shouldReturnAccounts() throws Exception {
        AppUser appUser = new AppUser();
        appUser.setAppUserID(1);
        appUser.setUsername("username");
        appUser.setPassword("password");

        Account account1 = new Account();
        account1.setAccountName("accountName1");
        account1.setAppUserProfileID(appUser);
        account1.setAccountEmail("accountEmail1");
        account1.setAccountPassword("encryptedPassword1");

        Account account2 = new Account();
        account2.setAccountName("accountName2");
        account2.setAppUserProfileID(appUser);
        account2.setAccountEmail("accountEmail2");
        account2.setAccountPassword("encryptedPassword2");

        List<Account> accounts = List.of(account1, account2);

        when(accountService.getAccountsByAppUserID(anyInt()))
                .thenReturn(accounts);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/getAccountsByAppUserId/{appUserID}", appUser.getAppUserID()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        List<Account> resultList = objectMapper.readValue(json, new TypeReference<>(){});

        assertNotNull(resultList);
        assertEquals(2, resultList.size());

    }

}
