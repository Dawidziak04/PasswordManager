package com.pl.PasswordManager.Repository;

import com.pl.PasswordManager.Entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Integer> {

    AppUser findByUsername(String username);

    boolean existsByUsername(String username);
}
