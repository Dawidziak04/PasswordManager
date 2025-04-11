package com.pl.PasswordManager.Repository;

import com.pl.PasswordManager.Entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    List<Account> findByAppUserID(int appUserID);

}
