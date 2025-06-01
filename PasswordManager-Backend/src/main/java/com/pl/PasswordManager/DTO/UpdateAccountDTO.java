package com.pl.PasswordManager.DTO;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UpdateAccountDTO {

    private int accountID;
    private String accountName;
    private String accountEmail;
    private String accountPassword;


}
