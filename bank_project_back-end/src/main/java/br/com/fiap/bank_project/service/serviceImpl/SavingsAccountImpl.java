package br.com.fiap.bank_project.service.serviceImpl;

import br.com.fiap.bank_project.entity.CheckingAccount;
import br.com.fiap.bank_project.entity.SavingsAccount;
import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.repository.CheckingAccountRepository;
import br.com.fiap.bank_project.repository.SavingsAccountRepository;
import br.com.fiap.bank_project.repository.UserRepository;
import br.com.fiap.bank_project.service.SavingsAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Sort;
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
public class SavingsAccountImpl implements SavingsAccountService {

    private final SavingsAccountRepository savingsAccountRepository;
    private final UserRepository userRepository;
    private final CheckingAccountRepository checkingAccountRepository;

    @Autowired
    public SavingsAccountImpl(SavingsAccountRepository savingsAccountRepository, UserRepository userRepository, CheckingAccountRepository checkingAccountRepository) {
        this.savingsAccountRepository = savingsAccountRepository;
        this.userRepository = userRepository;
        this.checkingAccountRepository = checkingAccountRepository;
    }


    @Override
    public SavingsAccount save(SavingsAccount savingsAccount) {
        User userFound = findByCpf(savingsAccount.getUser().getCpf());

        Optional<SavingsAccount> existingAccount = savingsAccountRepository.findByUser(userFound);
        if (existingAccount.isPresent()) {
            throw new ResponseStatusException(BAD_REQUEST,"Usuário já possui uma conta poupança!");
        } else {
            savingsAccount.setUser(userFound);
            
            // CheckingAccount é opcional - só busca se foi fornecida
            if (savingsAccount.getCheckingAccount() != null && 
                savingsAccount.getCheckingAccount().getUser() != null) {
                try {
                    CheckingAccount accountFound = findByCheckingAccount(
                        savingsAccount.getCheckingAccount().getUser().getCpf()
                    );
                    savingsAccount.setCheckingAccount(accountFound);
                } catch (ResponseStatusException e) {
                    // CheckingAccount não encontrada, deixa como null
                    savingsAccount.setCheckingAccount(null);
                }
            } else {
                savingsAccount.setCheckingAccount(null);
            }

            if (savingsAccount.getInvestment() == null) savingsAccount.setInvestment(BigDecimal.ZERO);
            if (savingsAccount.getTransference() == null) savingsAccount.setTransference(BigDecimal.ZERO);
            if(savingsAccount.getBalance() == null) savingsAccount.setBalance(BigDecimal.ZERO);
            return savingsAccountRepository.save(savingsAccount);
        }

    }

    @Override
    public SavingsAccount update(String cpf, SavingsAccount newAccount) {
        return savingsAccountRepository.findByUser_Cpf(cpf)
                .map(found -> {
                    // Atualiza apenas campos informados para evitar NPE e manter valores atuais
                    if (newAccount.getInvestment() != null) {
                        found.setInvestment(newAccount.getInvestment());
                    }
                    if (newAccount.getTransference() != null) {
                        found.setTransference(newAccount.getTransference());
                    }
                    if (newAccount.getBalance() != null) {
                        found.setBalance(newAccount.getBalance());
                    }
                    return savingsAccountRepository.save(found);
                }).orElseThrow(() ->
                new ResponseStatusException(NOT_FOUND,
                        "CPF não encontrado"));
    }

    @Override
    public void delete(String cpf) {
        SavingsAccount found = savingsAccountRepository.findByUser_Cpf(cpf)
                        .orElseThrow(() ->
                                new ResponseStatusException(NOT_FOUND,"CPF não encontrado!"));
        savingsAccountRepository.delete(found);
    }

    @Override
    public List<SavingsAccount> findAll(SavingsAccount account) {
        ExampleMatcher exampleMatcher = ExampleMatcher
                .matching()
                .withIgnoreCase()
                .withStringMatcher(CONTAINING);
        Example<SavingsAccount> example = Example.of(account, exampleMatcher);

        return savingsAccountRepository.findAll(example);
    }

    @Override
    public void transfer(String cpf, BigDecimal value) {
        SavingsAccount userFound = savingsAccountRepository
                .findByUser_Cpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND,"CPF não encontrado"));
        
        CheckingAccount checkingAccount = checkingAccountRepository
                .findByUser_Cpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND,
                                "Conta corrente não encontrada. É necessário ter uma conta corrente para fazer transferências."));

        userFound.transfer(checkingAccount,value);
        savingsAccountRepository.save(userFound);
        checkingAccountRepository.save(checkingAccount);
    }

    @Override
    public void deposit(String cpf, BigDecimal value) {
        SavingsAccount userFound = savingsAccountRepository
                .findByUser_Cpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND,"CPF não encontrado"));
        userFound.deposit(value);
        savingsAccountRepository.save(userFound);
    }

    @Override
    public void withdraw(String cpf,BigDecimal value) {
        SavingsAccount userFound = savingsAccountRepository
                .findByUser_Cpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND,"CPF não encontrado"));

        userFound.withdraw(value);
        savingsAccountRepository.save(userFound);

    }

    @Override
    public SavingsAccount findSavingsByCpf(String cpf) {
        return savingsAccountRepository
                .findByUser_Cpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND,"CPF não encontrado"));
    }

    private CheckingAccount findByCheckingAccount(String cpf) {
        return checkingAccountRepository.findByUser_Cpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND,
                                "Usuário não encontrado"));
    }

    private User findByCpf(String cpf) {
        return userRepository.findByCpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND,
                                "Usuário não encontrado"));
    }


}
