package com.pl.PasswordManager.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GeneratedPassword {

    private boolean lower;
    private boolean upper;
    private boolean digit;
    private boolean symbols;
    private int length;

}
