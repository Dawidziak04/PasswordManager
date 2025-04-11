package com.pl.PasswordManager.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "appUsers")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int appUserID;

    private String username;
    private String password;

}
