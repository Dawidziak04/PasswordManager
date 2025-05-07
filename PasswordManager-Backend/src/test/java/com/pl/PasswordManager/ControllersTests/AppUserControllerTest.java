package com.pl.PasswordManager.ControllersTests;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.pl.PasswordManager.Auth.JwtService;
import com.pl.PasswordManager.Configs.TestSecurityConfig;
import com.pl.PasswordManager.Controller.AppUserController;
import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Repository.AppUserRepository;
import com.pl.PasswordManager.Service.AppUserService;
import com.pl.PasswordManager.Service.CustomUserDetailsService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;


import javax.naming.AuthenticationException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(AppUserController.class)
@Import(TestSecurityConfig.class)
public class AppUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    private AppUserService appUserService;

    @MockitoBean
    private AppUserRepository appUserRepository;

    @Autowired
    private ObjectMapper objectMapper;


    @Test
    public void testCreateUser_shouldCreateUser() throws Exception {
        PasswordEncoder testEncoder = new BCryptPasswordEncoder();

        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        AppUser serviceAppUser = new AppUser();
        serviceAppUser.setUsername("username");
        serviceAppUser.setPassword(testEncoder.encode("password"));

        when(appUserService.register(any(AppUser.class))).thenReturn(serviceAppUser);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appUser))
        )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("username"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.password").value(Matchers.not("password")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.appUserID").exists());

    }

    @Test
    public void testCreateUser_noPassword_shouldThrowIllegalStateException() throws Exception {

        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appUser))
                )
                .andExpect(MockMvcResultMatchers.status().isConflict());
    }

    @Test
    public void testCreateUser_noUsername_shouldThrowIllegalStateException() throws Exception {

        AppUser appUser = new AppUser();
        appUser.setUsername("");
        appUser.setPassword("password");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appUser))
                )
                .andExpect(MockMvcResultMatchers.status().isConflict());
    }

    @Test
    public void testCreateUser_alreadyUsedUsername_shouldThrowIllegalStateException() throws Exception {

        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        AppUser appUser2 = new AppUser();
        appUser2.setUsername("username");

        when(appUserRepository.existsByUsername("username"))
                .thenReturn(false)
                .thenReturn(true);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appUser))
                )
                .andExpect(MockMvcResultMatchers.status().isOk());

        mockMvc.perform(MockMvcRequestBuilders.post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appUser2))
                )
                .andExpect(MockMvcResultMatchers.status().isConflict());

    }

    @Test
    public void testDeleteUser_shouldDeleteUser() throws Exception {
        AppUser appUser = new AppUser();
        appUser.setAppUserID(1);
        appUser.setUsername("username");
        appUser.setPassword("password");

        when(appUserService.deleteAppUser(any(AppUser.class))).thenReturn(true);


        mockMvc.perform(MockMvcRequestBuilders.delete("/api/deleteAppUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appUser))
                )
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testDeleteUser_idNotExistingInRepository_shouldThrowEror404() throws Exception {
        AppUser appUser = new AppUser();
        appUser.setAppUserID(1);
        appUser.setUsername("username");
        appUser.setPassword("password");

        when(appUserService.deleteAppUser(any(AppUser.class))).thenReturn(false);


        mockMvc.perform(MockMvcRequestBuilders.delete("/api/deleteAppUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appUser))
                )
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testLoginUser_shouldReturnToken() throws Exception {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");
        String expectedToken = "mocked-jwt-token";

        when(appUserService.verify(any(AppUser.class)))
                .thenReturn(expectedToken);

       mockMvc.perform(MockMvcRequestBuilders.post("/api/login")
               .contentType(MediaType.APPLICATION_JSON)
               .content(objectMapper.writeValueAsString(appUser)))
               .andExpect(MockMvcResultMatchers.status().isOk())
               .andExpect(MockMvcResultMatchers.jsonPath("$.token").value(expectedToken));

    }

    @Test
    public void testLoginUser_BadUsername_shouldThrowIllegalAccessException() throws Exception {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        when(appUserService.verify(any(AppUser.class)))
                .thenThrow(new IllegalAccessException("Bad Username"));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appUser)))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    public void testLoginUser_badPassword_shouldThrowIllegalAccessException() throws Exception {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        when(appUserService.verify(any(AppUser.class)))
                .thenThrow(new IllegalAccessException("Bad password"));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appUser)))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    public void testLoginUser_serviceNull_shouldThrowIllegalAccessException() throws Exception {
        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword("password");

        when(appUserService.verify(any(AppUser.class)))
                .thenReturn(null);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appUser)))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }


    }

