package br.com.fiap.bank_project.repository;

import br.com.fiap.bank_project.entity.CheckingAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Transactional(readOnly = true)
public interface CheckingAccountRepository extends JpaRepository<CheckingAccount,Long> {
    Optional<CheckingAccount> findByCpf(String cpf);
}
