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

    protected abstract void deposit(BigDecimal value);
    protected abstract void withdraw(BigDecimal value);


    protected BigDecimal getBalance() {
        return balance;
    }

    protected void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

}
