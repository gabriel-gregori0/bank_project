package br.com.fiap.bank_project.dto.common;

public class UserSummaryDTO {
    private String cpf;
    private String name;
    private String email;

    public UserSummaryDTO() {}

    public UserSummaryDTO(String cpf, String name, String email) {
        this.cpf = cpf;
        this.name = name;
        this.email = email;
    }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
