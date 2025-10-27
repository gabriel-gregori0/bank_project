package br.com.fiap.bank_project.service;

import br.com.fiap.bank_project.entity.SavingsAccount;

import java.util.List;

public interface SavingsAccountService {

    public SavingsAccount save(String cpf);
    public SavingsAccount update(String cpf, SavingsAccount newAccount);
    public void delete(String cpf);
    public List<SavingsAccount> findAll(SavingsAccount account);
}
