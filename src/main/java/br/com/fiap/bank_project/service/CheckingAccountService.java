package br.com.fiap.bank_project.service;

import br.com.fiap.bank_project.entity.CheckingAccount;
import br.com.fiap.bank_project.entity.SavingsAccount;

import java.math.BigDecimal;
import java.util.List;

public interface CheckingAccountService {

    public CheckingAccount save(CheckingAccount account);
    public CheckingAccount update(String cpf, CheckingAccount newAccount);
    public void delete(String cpf);
    public List<CheckingAccount> findAll(CheckingAccount account);
    public void withdraw(String cpf, BigDecimal value);
    public void deposit(String cpf,BigDecimal value);
    public CheckingAccount findAccountByCpf(String cpf);
}
