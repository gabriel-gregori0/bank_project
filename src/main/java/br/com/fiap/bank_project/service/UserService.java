package br.com.fiap.bank_project.service;

import br.com.fiap.bank_project.entity.User;

import java.util.List;

public interface UserService {

    public User save(User user);
    public User update(User user, String cpf);
    public String delete(String cpf);
    public List<User> findAll();
}
