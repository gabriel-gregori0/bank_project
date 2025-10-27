package br.com.fiap.bank_project.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "tb_savings_account")
public class SavingsAccount extends Bank implements Serializable {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "SEQ_SAVINGS_ACCOUNT"
    )
    @SequenceGenerator(
            name = "SEQ_SAVINGS_ACCOUNT",
            sequenceName = "SEQ_SAVINGS_ACCOUNT",
            allocationSize = 1
    )
    private Long id;

    @Column(nullable = true, precision = 15, scale = 2)
    private BigDecimal transference;

    @Column(nullable = true, precision = 15, scale = 2)
    private BigDecimal investment;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "checking_account_id")
    private CheckingAccount checkingAccount;


    public SavingsAccount() {}

    public SavingsAccount(BigDecimal balance, BigDecimal transference,
                          BigDecimal investment, User user,
                          CheckingAccount checkingAccount) {
        super(balance);
        this.transference = transference;
        this.investment = investment;
        this.user = user;
        this.checkingAccount = checkingAccount;
    }

    @Override
    protected void deposit(BigDecimal value) {

    }

    @Override
    protected void withdraw(BigDecimal value) {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getTransference() {
        return transference;
    }

    public void setTransference(BigDecimal transference) {
        this.transference = transference;
    }

    public BigDecimal getInvestment() {
        return investment;
    }

    public void setInvestment(BigDecimal investment) {
        this.investment = investment;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public CheckingAccount getCheckingAccount() {
        return checkingAccount;
    }

    public void setCheckingAccount(CheckingAccount checkingAccount) {
        this.checkingAccount = checkingAccount;
    }

    @Override
    public boolean equals(Object object) {
        if (object == null || getClass() != object.getClass()) return false;
        SavingsAccount that = (SavingsAccount) object;
        return Objects.equals(id, that.id) && Objects.equals(user, that.user) && Objects.equals(checkingAccount, that.checkingAccount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user, checkingAccount);
    }

    @Override
    public String toString() {
        return "SavingsAccount{" +
                "transference=" + transference +
                ", investment=" + investment +
                ", user=" + user +
                ", checkingAccount=" + checkingAccount +
                ", balance=" + balance +
                '}';
    }
}
