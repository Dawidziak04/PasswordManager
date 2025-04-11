package com.pl.PasswordManager.Controller;

import com.pl.PasswordManager.Entities.AppUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class AppUserController {

    @GetMapping("/test")
    public int test(){
        return 1;
    }

}
