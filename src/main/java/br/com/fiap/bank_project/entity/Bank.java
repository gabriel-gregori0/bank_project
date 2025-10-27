package br.com.fiap.bank_project.entity;

import jakarta.persistence.MappedSuperclass;

import java.io.Serializable;
import java.math.BigDecimal;

@MappedSuperclass
public abstract class Bank implements Serializable {

    protected BigDecimal balance;

    protected Bank() {}

    protected Bank(BigDecimal balance) {
        this.balance = balance;
    }

    public abstract void deposit(BigDecimal value);
    public abstract void withdraw(BigDecimal value);


    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
