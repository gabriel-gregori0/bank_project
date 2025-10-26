package br.com.fiap.bank_project.service.serviceImpl;

import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.repository.UserRepository;
import br.com.fiap.bank_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.springframework.data.domain.ExampleMatcher.StringMatcher.CONTAINING;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User save(User user) {
        if(userRepository.existsByCpf(user.getCpf())) {
            throw new ResponseStatusException(BAD_REQUEST);
        } else {
            return userRepository.save(user);
        }
    }

    @Override
    public User update(User user, String cpf) {
        if(!userRepository.existsByCpf(cpf)) {
            throw new ResponseStatusException(BAD_REQUEST);
        }
        return userRepository.findByCpf(cpf)
                .map(found -> {
                    found.setCpf(user.getCpf());
                    return userRepository.save(user);
                }).orElseThrow(() -> new ResponseStatusException(BAD_REQUEST));

    }

    @Override
    public void delete(String cpf) {
        if (!userRepository.existsByCpf(cpf)) {
            throw new ResponseStatusException(NOT_FOUND);
        }
        userRepository.findByCpf(cpf)
                .map(user -> {
                    userRepository.delete(user);
                    return user;
                }).orElseThrow(() -> new ResponseStatusException(NOT_FOUND));
    }

    @Override
    public List<User> findAll(User user) {
        ExampleMatcher exampleMatcher = ExampleMatcher
                .matching()
                .withIgnoreCase()
                .withStringMatcher(CONTAINING);
        Example<User> example = Example.of(user, exampleMatcher);

        return userRepository.findAll(example);
    }

    @Override
    public User findByCpf(String cpf) {
        Optional<User> user = userRepository.findByCpf(cpf);
        if(!user.isPresent()) {
            throw new ResponseStatusException(BAD_REQUEST);
        }
        return userRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST));
    }
}
