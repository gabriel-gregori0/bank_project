package br.com.fiap.bank_project.repository;

import br.com.fiap.bank_project.entity.CheckingAccount;
import br.com.fiap.bank_project.entity.SavingsAccount;
import br.com.fiap.bank_project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Transactional(readOnly = true)
public interface SavingsAccountRepository extends JpaRepository<SavingsAccount,Long> {

    Optional<SavingsAccount> findByUser_Cpf(String cpf);
    Optional<SavingsAccount> findByUser(User userFound);
}
