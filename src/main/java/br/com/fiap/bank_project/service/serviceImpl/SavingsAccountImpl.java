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

@Service
public class SavingsAccountImpl implements SavingsAccountService {

    private final SavingsAccountRepository accountRepository;
    private final UserRepository userRepository;

    @Autowired
    public SavingsAccountImpl(
            SavingsAccountRepository accountRepository,
            UserRepository userRepository
    ) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }


    @Override
    public SavingsAccount save(SavingsAccount account,String cpf) {
      User user = findByCpf(cpf);
      account.setUser(user);

      return accountRepository.save(account);
    }

    @Override
    public SavingsAccount update(SavingsAccount account, String cpf) {
        return null;
    }

    @Override
    public void delete(String cpf) {

    }

    @Override
    public List<SavingsAccount> findAll(SavingsAccount user) {
        return List.of();
    }

    private User findByCpf(String cpf) {
        return userRepository.findByCpf(cpf)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Usuário não encontrado"));
    }
}
