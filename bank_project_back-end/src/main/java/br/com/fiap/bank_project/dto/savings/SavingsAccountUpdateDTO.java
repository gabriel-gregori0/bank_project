package br.com.fiap.bank_project.dto.savings;

import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class SavingsAccountUpdateDTO {

    @PositiveOrZero(message = "Saldo deve ser zero ou positivo")
    private BigDecimal balance;

    @PositiveOrZero(message = "Transferências devem ser zero ou positivas")
    private BigDecimal transference;

    @PositiveOrZero(message = "Investimento deve ser zero ou positivo")
    private BigDecimal investment;

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public BigDecimal getTransference() { return transference; }
    public void setTransference(BigDecimal transference) { this.transference = transference; }
    public BigDecimal getInvestment() { return investment; }
    public void setInvestment(BigDecimal investment) { this.investment = investment; }
}
