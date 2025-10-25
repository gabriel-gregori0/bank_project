package br.com.fiap.bank_project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "tb_checking_account")
public class CheckingAccount extends Bank implements Serializable {

    private Long id;
    private double expense;
    private User user;

    public CheckingAccount() {}


    public CheckingAccount(double balance, double expense, User user) {
        super(balance);
        this.expense = expense;
        this.user = user;
    }

    @Override
    protected void deposit(double value) {

    }

    @Override
    protected void withdraw(double value) {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getExpense() {
        return expense;
    }

    public void setExpense(double expense) {
        this.expense = expense;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object object) {
        if (object == null || getClass() != object.getClass()) return false;
        CheckingAccount that = (CheckingAccount) object;
        return Objects.equals(id, that.id) && Objects.equals(user, that.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user);
    }

    @Override
    public String toString() {
        return "CheckingAccount{" +
                "expense=" + expense +
                ", user=" + user +
                ", balance=" + balance +
                '}';
    }
}
