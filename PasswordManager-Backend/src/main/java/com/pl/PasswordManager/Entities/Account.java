package com.pl.PasswordManager.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int accountId;

    @JoinColumn(referencedColumnName = "customerID", nullable = false)
    private int accountUserID;

    private String accountName;
    private String accountEmail;
    private String accountPassword;


}
