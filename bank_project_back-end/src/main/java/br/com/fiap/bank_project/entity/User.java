package br.com.fiap.bank_project.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "tb_user")
public class User implements Serializable {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "SEQ_USERS"
    )
    @SequenceGenerator(
            name = "SEQ_USERS",
            sequenceName = "SEQ_USERS",
            allocationSize = 1
    )
    private Long id;

    @Column(length = 50, nullable = false)
    private String name;
    @Column(length = 15, nullable = false)
    private String cpf;
    @Column(length = 20, nullable = false)
    private String email;
    @Column(length = 20, nullable = false)
    private String password;
    
    @Column(length = 20)
    private String role;


    public User(){}

    public User(String name, String cpf, String email, String password, String role) {
        this.name = name;
        this.cpf = cpf;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object object) {
        if (object == null || getClass() != object.getClass()) return false;
        User user = (User) object;
        return Objects.equals(id, user.id) && Objects.equals(cpf, user.cpf) && Objects.equals(email, user.email) && Objects.equals(password, user.password) && Objects.equals(role, user.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, cpf, email, password, role);
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", cpf='" + cpf + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
