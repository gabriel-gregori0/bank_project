package br.com.fiap.bank_project.service.serviceImpl;

import br.com.fiap.bank_project.entity.SavingsAccount;
import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.repository.SavingsAccountRepository;
import br.com.fiap.bank_project.repository.UserRepository;
import br.com.fiap.bank_project.service.SavingsAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class SavingsAccountImpl implements SavingsAccountService {

    private final SavingsAccountRepository accountRepository;

    @Autowired
    public SavingsAccountImpl(SavingsAccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }


    @Override
    public SavingsAccount save(SavingsAccount account) {
      SavingsAccount newAccount = findByCpf(account);
      return accountRepository.save(newAccount);
    }

    @Override
    public SavingsAccount update(SavingsAccount account, SavingsAccount newAccount) {
        return accountRepository.findByCpf(account.getUser().getCpf())
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

    }

    @Override
    public List<SavingsAccount> findAll(SavingsAccount user) {
        return List.of();
    }

    private SavingsAccount findByCpf(SavingsAccount account) {
        return accountRepository.findByCpf(account.getUser().getCpf())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Usuário não encontrado"));
    }
}
