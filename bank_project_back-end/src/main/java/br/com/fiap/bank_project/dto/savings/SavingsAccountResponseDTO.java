package br.com.fiap.bank_project.dto.savings;

import br.com.fiap.bank_project.dto.common.UserSummaryDTO;

import java.math.BigDecimal;

public class SavingsAccountResponseDTO {
    private Long id;
    private BigDecimal balance;
    private BigDecimal transference;
    private BigDecimal investment;
    private UserSummaryDTO user;

    public SavingsAccountResponseDTO() {}

    public SavingsAccountResponseDTO(Long id, BigDecimal balance, BigDecimal transference, BigDecimal investment, UserSummaryDTO user) {
        this.id = id;
        this.balance = balance;
        this.transference = transference;
        this.investment = investment;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public BigDecimal getTransference() { return transference; }
    public void setTransference(BigDecimal transference) { this.transference = transference; }
    public BigDecimal getInvestment() { return investment; }
    public void setInvestment(BigDecimal investment) { this.investment = investment; }
    public UserSummaryDTO getUser() { return user; }
    public void setUser(UserSummaryDTO user) { this.user = user; }
}
