package br.com.fiap.bank_project.repository;

import br.com.fiap.bank_project.entity.SavingsAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Transactional(readOnly = true)
public interface SavingsAccountRepository extends JpaRepository<SavingsAccount,Long> {

    Optional<SavingsAccount> findByCpf(String cpf);
}
