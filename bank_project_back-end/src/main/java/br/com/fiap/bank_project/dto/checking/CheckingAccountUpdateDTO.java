package br.com.fiap.bank_project.dto.checking;

import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class CheckingAccountUpdateDTO {

    @PositiveOrZero(message = "Saldo deve ser zero ou positivo")
    private BigDecimal balance;

    @PositiveOrZero(message = "Despesa deve ser zero ou positiva")
    private BigDecimal expense;

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public BigDecimal getExpense() { return expense; }
    public void setExpense(BigDecimal expense) { this.expense = expense; }
}
