package br.com.fiap.bank_project.service;

import br.com.fiap.bank_project.entity.SavingsAccount;

import java.util.List;

public interface SavingsAccountService {

    public SavingsAccount save(SavingsAccount account);
    public SavingsAccount update(SavingsAccount account, SavingsAccount newAccount);
    public void delete(SavingsAccount account);
    public List<SavingsAccount> findAll(SavingsAccount user);
}
