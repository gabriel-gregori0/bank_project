package br.com.fiap.bank_project.service.serviceImpl;

import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.repository.CheckingAccountRepository;
import br.com.fiap.bank_project.repository.SavingsAccountRepository;
import br.com.fiap.bank_project.repository.UserRepository;
import br.com.fiap.bank_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.data.domain.ExampleMatcher.StringMatcher.CONTAINING;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CheckingAccountRepository checkingAccountRepository;
    private final SavingsAccountRepository savingsAccountRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, 
                          CheckingAccountRepository checkingAccountRepository,
                          SavingsAccountRepository savingsAccountRepository) {
        this.userRepository = userRepository;
        this.checkingAccountRepository = checkingAccountRepository;
        this.savingsAccountRepository = savingsAccountRepository;
    }

    @Override
    public User save(User user) {
        if(userRepository.existsByCpf(user.getCpf())) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Usuário já cadastrado!");
        } else {
            return userRepository.save(user);
        }
    }

    @Override
    public User update(User user, String cpf) {
        return userRepository.findByCpf(cpf)
                .map(found -> {
                    found.setName(user.getName());
                    found.setEmail(user.getEmail());
                    return userRepository.save(found);
                })
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND,
                                "Usuário não encontrado"));
    }

    @Override
    @Transactional
    public void delete(String cpf) {
        User user = userRepository.findByCpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Usuário não encontrado"));

        // Deleta conta poupança se existir
        savingsAccountRepository.findByUser_Cpf(cpf).ifPresent(savingsAccount -> {
            savingsAccountRepository.delete(savingsAccount);
        });

        // Deleta conta corrente se existir
        checkingAccountRepository.findByUser_Cpf(cpf).ifPresent(checkingAccount -> {
            checkingAccountRepository.delete(checkingAccount);
        });

        // Deleta o usuário
        userRepository.delete(user);

    }

    @Override
    public List<User> findAll(User user) {
        ExampleMatcher exampleMatcher = ExampleMatcher
                .matching()
                .withIgnoreCase()
                .withStringMatcher(CONTAINING);
        Example<User> example = Example.of(user, exampleMatcher);

        return userRepository.findAll(example);
    }

    @Override
    public User findByCpf(String cpf) {
        return userRepository.findByCpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Usuário não encontrado"));
    }

    @Override
    public User findByEmailAndPassword(String email, String password) {
        // Mock admin check first
        if (email.equals("adm@fiap.com.br") && password.equals("fiap2025")) {
            User adminUser = new User();
            adminUser.setName("Admin");
            adminUser.setEmail("adm@fiap.com.br");
            adminUser.setRole("ADMIN");
            return adminUser;
        }
        
        // Try to find user in database
        return userRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Usuário não encontrado ou senha inválida"));
    }
}
