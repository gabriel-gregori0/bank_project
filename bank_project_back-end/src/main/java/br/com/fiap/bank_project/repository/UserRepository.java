package br.com.fiap.bank_project.repository;

import br.com.fiap.bank_project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Transactional(readOnly = true)
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByCpf(String cpf);
    Optional<User> findByCpf(String cpf);
    Optional<User> findByEmailAndPassword(String email, String password);
}
