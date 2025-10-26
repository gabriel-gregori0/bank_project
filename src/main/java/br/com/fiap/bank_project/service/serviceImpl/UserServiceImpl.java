package br.com.fiap.bank_project.service.serviceImpl;

import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.repository.UserRepository;
import br.com.fiap.bank_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User save(User user) {
        return null;
    }

    @Override
    public User update(User user, String cpf) {
        return null;
    }

    @Override
    public String delete(String cpf) {
        return "";
    }

    @Override
    public List<User> findAll() {
        return List.of();
    }
}
