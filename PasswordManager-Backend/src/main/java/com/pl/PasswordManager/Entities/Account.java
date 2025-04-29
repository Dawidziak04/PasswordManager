package com.pl.PasswordManager.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int accountID;

    @ManyToOne
    @JoinColumn(name = "app_user_id", referencedColumnName = "appUserID", nullable = false)
    private AppUser appUserProfileID;

    @Column(nullable = false)
    private String accountName;
    private String accountEmail;
    private String accountPassword;


}
