package com.pl.PasswordManager.DTO;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class AccountDTO {

    private String accountName;
    private String accountEmail;
    private String accountPassword;

}
