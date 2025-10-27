package br.com.fiap.bank_project.service.serviceImpl;

import br.com.fiap.bank_project.entity.CheckingAccount;
import br.com.fiap.bank_project.repository.CheckingAccountRepository;
import br.com.fiap.bank_project.service.CheckingAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckingAccountImpl implements CheckingAccountService {


    private final CheckingAccountRepository checkingAccountRepository;

    @Autowired
    public CheckingAccountImpl(CheckingAccountRepository checkingAccountRepository) {
        this.checkingAccountRepository = checkingAccountRepository;
    }


    @Override
    public CheckingAccount save(String cpf) {
        return null;
    }

    @Override
    public CheckingAccount update(String cpf, CheckingAccount newAccount) {
        return null;
    }

    @Override
    public void delete(String cpf) {

    }

    @Override
    public List<CheckingAccount> findAll(CheckingAccount account) {
        return List.of();
    }
}
