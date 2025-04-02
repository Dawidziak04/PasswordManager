package com.pl.PasswordManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class PasswordControler {

    @Autowired
    PasswordService passwordService;

}
