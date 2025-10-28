package br.com.fiap.bank_project.entity;

import jakarta.persistence.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

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
    public void deposit(BigDecimal value) {
        if (value == null || value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(BAD_REQUEST,"Valor Incorreto!");
        } else {
            this.balance = this.balance.add(value);
        }
    }

    @Override
    public void withdraw(BigDecimal value) {
        if (value == null || value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(BAD_REQUEST,"Valor Incorreto!");
        } else if (this.balance.compareTo(value) < 0) {
            throw new ResponseStatusException(BAD_REQUEST,"Saldo Insuficiente!");
        } else {
            this.balance = this.balance.subtract(value);
        }
    }

    public void transfer(CheckingAccount checking, BigDecimal value) {
        if (value == null || value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(BAD_REQUEST,"Valor Incorreto!");
        } else {
            checking.deposit(value);
            this.transference = this.transference.add(value);
            this.balance = this.balance.subtract(value);
        }
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
        if (this.investment == null) {
            this.investment = investment;
        } else {
            this.investment = this.investment.add(investment);
        }
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
