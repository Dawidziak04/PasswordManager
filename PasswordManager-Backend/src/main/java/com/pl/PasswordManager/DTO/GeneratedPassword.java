package com.pl.PasswordManager.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GeneratedPassword {

    private boolean lower;
    private boolean upper;
    private boolean digit;
    private boolean symbols;
    private int length;

}
