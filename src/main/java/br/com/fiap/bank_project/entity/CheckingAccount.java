package br.com.fiap.bank_project.entity;

import jakarta.persistence.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Entity
@Table(name = "tb_checking_account")
public class CheckingAccount extends Bank implements Serializable {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "SEQ_CHECKING_ACCOUNT"
    )
    @SequenceGenerator(
            name = "SEQ_CHECKING_ACCOUNT",
            sequenceName = "SEQ_CHECKING_ACCOUNT",
            allocationSize = 1
    )
    private Long id;

    @Column(nullable = true, precision = 15, scale = 2)
    private BigDecimal expense;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public CheckingAccount() {}


    public CheckingAccount(BigDecimal balance, BigDecimal expense, User user) {
        super(balance);
        this.expense = expense;
        this.user = user;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
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
