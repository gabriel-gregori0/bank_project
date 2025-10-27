package br.com.fiap.bank_project.service.serviceImpl;

import br.com.fiap.bank_project.entity.SavingsAccount;
import br.com.fiap.bank_project.entity.User;
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

import java.util.List;

import static org.springframework.data.domain.ExampleMatcher.StringMatcher.CONTAINING;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class SavingsAccountImpl implements SavingsAccountService {

    private final SavingsAccountRepository accountRepository;
    private final UserRepository userRepository;

    @Autowired
    public SavingsAccountImpl(
            SavingsAccountRepository accountRepository,
            UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Override
    public SavingsAccount save(String cpf) {
      SavingsAccount newAccount = findAccountByCpf(cpf);
      return accountRepository.save(newAccount);
    }

    @Override
    public SavingsAccount update(String cpf, SavingsAccount newAccount) {
        SavingsAccount account = findAccountByCpf(cpf);
        return accountRepository.findByUser_Cpf(account.getUser().getCpf())
                .map(found -> {
                    found.setInvestment(newAccount.getInvestment());
                    found.setTransference(newAccount.getTransference());
                    return accountRepository.save(found);
                }).orElseThrow(() ->
                new ResponseStatusException(NOT_FOUND,
                        "CPF não encontrado"));
    }

    @Override
    public void delete(String cpf) {
        SavingsAccount found = findAccountByCpf(cpf);
        accountRepository.delete(found);
    }

    @Override
    public List<SavingsAccount> findAll(SavingsAccount account) {
        ExampleMatcher exampleMatcher = ExampleMatcher
                .matching()
                .withIgnoreCase()
                .withStringMatcher(CONTAINING);
        Example<SavingsAccount> example = Example.of(account, exampleMatcher);

        return accountRepository.findAll(example);
    }

    private SavingsAccount findAccountByCpf(String cpf) {
        User userFound = findByCpf(cpf);
        SavingsAccount account = new SavingsAccount();
        account.setUser(userFound);

        return accountRepository.findByUser_Cpf(account.getUser().getCpf())
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
