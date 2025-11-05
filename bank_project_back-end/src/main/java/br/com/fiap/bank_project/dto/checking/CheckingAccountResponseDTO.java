package br.com.fiap.bank_project.dto.checking;

import br.com.fiap.bank_project.dto.common.UserSummaryDTO;

import java.math.BigDecimal;

public class CheckingAccountResponseDTO {
    private Long id;
    private BigDecimal balance;
    private BigDecimal expense;
    private UserSummaryDTO user;

    public CheckingAccountResponseDTO() {}

    public CheckingAccountResponseDTO(Long id, BigDecimal balance, BigDecimal expense, UserSummaryDTO user) {
        this.id = id;
        this.balance = balance;
        this.expense = expense;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public BigDecimal getExpense() { return expense; }
    public void setExpense(BigDecimal expense) { this.expense = expense; }
    public UserSummaryDTO getUser() { return user; }
    public void setUser(UserSummaryDTO user) { this.user = user; }
}
