package br.com.fiap.bank_project.entity;

import java.io.Serializable;
import java.math.BigDecimal;

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
