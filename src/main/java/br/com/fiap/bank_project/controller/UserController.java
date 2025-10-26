package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping
    @ResponseStatus(CREATED)
    public User create(@RequestBody User user) {
        return service.save(user);
    }

    @GetMapping("{cpf}")
    @ResponseStatus(OK)
    public User findByCpf(@PathVariable String cpf) {
        return service.findByCpf(cpf);
    }

    @DeleteMapping("{cpf}")
    @ResponseStatus(NO_CONTENT)
    public void delete(@PathVariable String cpf) {
        service.delete(cpf);
    }

    @GetMapping
    public List<User> findAll(User user) {
        return service.findAll(user);
    }

}
