package br.com.fiap.bank_project.service;

import br.com.fiap.bank_project.entity.SavingsAccount;

import java.math.BigDecimal;
import java.util.List;

public interface SavingsAccountService {

    public SavingsAccount save(SavingsAccount account);
    public SavingsAccount update(String cpf, SavingsAccount newAccount);
    public void delete(String cpf);
    public List<SavingsAccount> findAll(SavingsAccount account);
    public void transfer(String cpf, BigDecimal value);
    public void deposit(String cpf, BigDecimal value);
    public void withdraw(String cpf,BigDecimal value);
}
