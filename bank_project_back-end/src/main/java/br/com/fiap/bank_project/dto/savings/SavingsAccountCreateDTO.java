package br.com.fiap.bank_project.dto.savings;

import jakarta.validation.constraints.NotBlank;

public class SavingsAccountCreateDTO {

    @NotBlank(message = "CPF do usuário é obrigatório")
    private String userCpf;

    // opcional: CPF vinculado à conta corrente
    private String checkingCpf;

    // saldos/investimentos opcionais (default 0)
    private String initialBalance;
    private String initialInvestment;

    public String getUserCpf() { return userCpf; }
    public void setUserCpf(String userCpf) { this.userCpf = userCpf; }
    public String getCheckingCpf() { return checkingCpf; }
    public void setCheckingCpf(String checkingCpf) { this.checkingCpf = checkingCpf; }
    public String getInitialBalance() { return initialBalance; }
    public void setInitialBalance(String initialBalance) { this.initialBalance = initialBalance; }
    public String getInitialInvestment() { return initialInvestment; }
    public void setInitialInvestment(String initialInvestment) { this.initialInvestment = initialInvestment; }
}
