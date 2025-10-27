package br.com.fiap.bank_project.service.serviceImpl;

import br.com.fiap.bank_project.entity.CheckingAccount;
import br.com.fiap.bank_project.entity.SavingsAccount;
import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.repository.CheckingAccountRepository;
import br.com.fiap.bank_project.repository.UserRepository;
import br.com.fiap.bank_project.service.CheckingAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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
    public CheckingAccount save(String cpf) {
        CheckingAccount account = findAccountByCpf(cpf);
        return checkingAccountRepository.save(account);
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

    private CheckingAccount findAccountByCpf(String cpf) {
        User userFound = findByCpf(cpf);
        CheckingAccount account = new CheckingAccount();
        account.setUser(userFound);

        return checkingAccountRepository.findByCpf(account.getUser().getCpf())
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
