package br.com.fiap.bank_project.entity;

import java.io.Serializable;

public abstract class Bank implements Serializable {

    protected double balance;

    protected Bank() {}

    protected Bank(double balance) {
        this.balance = balance;
    }

    protected abstract void deposit(double value);
    protected abstract void withdraw(double value);


    protected double getBalance() {
        return balance;
    }

    protected void setBalance(double balance) {
        this.balance = balance;
    }

}
