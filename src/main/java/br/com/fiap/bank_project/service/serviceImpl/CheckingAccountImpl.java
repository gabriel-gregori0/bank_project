package br.com.fiap.bank_project.service.serviceImpl;

import br.com.fiap.bank_project.entity.CheckingAccount;
import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.repository.CheckingAccountRepository;
import br.com.fiap.bank_project.repository.UserRepository;
import br.com.fiap.bank_project.service.CheckingAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.springframework.data.domain.ExampleMatcher.StringMatcher.CONTAINING;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class CheckingAccountImpl implements CheckingAccountService {


    private final CheckingAccountRepository checkingAccountRepository;
    private final UserRepository userRepository;

    @Autowired
    public CheckingAccountImpl(CheckingAccountRepository checkingAccountRepository, UserRepository userRepository) {
        this.checkingAccountRepository = checkingAccountRepository;
        this.userRepository = userRepository;
    }


    @Override
    public CheckingAccount save(CheckingAccount account) {
        User userFound = findByCpf(account.getUser().getCpf());

        Optional<CheckingAccount> existingAccount = checkingAccountRepository.findByUser(userFound);
        if (existingAccount.isPresent()) {
            throw new ResponseStatusException(BAD_REQUEST,"Usuário já possui uma conta corrente!");
        } else {
            account.setUser(userFound);

            if (account.getBalance() == null) account.setBalance(BigDecimal.ZERO);
            if (account.getExpense() == null) account.setExpense(BigDecimal.ZERO);
            return checkingAccountRepository.save(account);
        }
    }

    @Override
    public CheckingAccount update(String cpf, CheckingAccount newAccount) {
        return  checkingAccountRepository
                .findByUser_Cpf(cpf)
                .map(found -> {
                    found.setBalance(newAccount.getBalance());
                    found.setExpense(newAccount.getExpense());
                    return checkingAccountRepository.save(found);
                }).orElseThrow(()->
                        new ResponseStatusException(NOT_FOUND,"CPF não encontrado"));
    }

    @Override
    public void delete(String cpf) {
        CheckingAccount account = checkingAccountRepository
                .findByUser_Cpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND,"CPF não encontrado!"));

        checkingAccountRepository.delete(account);
    }

    @Override
    public List<CheckingAccount> findAll(CheckingAccount account) {
        ExampleMatcher exampleMatcher = ExampleMatcher
                .matching()
                .withIgnoreCase()
                .withStringMatcher(CONTAINING);
        Example<CheckingAccount> example = Example.of(account, exampleMatcher);

        return checkingAccountRepository.findAll(example);
    }

    @Override
    public void withdraw(String cpf,BigDecimal value) {
        CheckingAccount userFound = checkingAccountRepository
                .findByUser_Cpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND,"CPF não encontrado"));

        userFound.withdraw(value);
        checkingAccountRepository.save(userFound);

    }

    public void deposit(String cpf,BigDecimal value) {
        CheckingAccount userFound = checkingAccountRepository
                .findByUser_Cpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND,"CPF não encontrado"));

        userFound.deposit(value);
        checkingAccountRepository.save(userFound);
    }

    private CheckingAccount findAccountByCpf(String cpf) {
        User userFound = findByCpf(cpf);
        CheckingAccount account = new CheckingAccount();
        account.setUser(userFound);

        return checkingAccountRepository.findByUser_Cpf(account.getUser().getCpf())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Usuário não encontrado"));
    }

    private User findByCpf(String cpf) {
        return userRepository.findByCpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Usuário não encontrado"));
    }
}
