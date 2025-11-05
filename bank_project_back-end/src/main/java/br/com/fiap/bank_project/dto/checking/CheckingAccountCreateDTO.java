package br.com.fiap.bank_project.dto.checking;

import jakarta.validation.constraints.NotBlank;

public class CheckingAccountCreateDTO {

    @NotBlank(message = "CPF do usuário é obrigatório")
    private String userCpf;

    // saldo inicial opcional; se nulo, será 0 no serviço
    private String initialBalance; // usar String para permitir vazio; converteremos para BigDecimal

    public String getUserCpf() { return userCpf; }
    public void setUserCpf(String userCpf) { this.userCpf = userCpf; }
    public String getInitialBalance() { return initialBalance; }
    public void setInitialBalance(String initialBalance) { this.initialBalance = initialBalance; }
}
