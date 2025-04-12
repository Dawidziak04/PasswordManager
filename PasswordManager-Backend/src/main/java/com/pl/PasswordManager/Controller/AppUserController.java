package com.pl.PasswordManager.Controller;

import com.pl.PasswordManager.Entities.AppUser;
import com.pl.PasswordManager.Service.AppUserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/api")
public class AppUserController {

    private final AppUserService appUserService;
    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @PostMapping("/register")
    public AppUser register(@RequestBody AppUser appUser) {
        return appUserService.register(appUser);
    }

}
