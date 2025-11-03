package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/{cpf}")
    @ResponseStatus(OK)
    public User findByCpf(@PathVariable String cpf) {
        return service.findByCpf(cpf);
    }

    @DeleteMapping("/{cpf}")
    @ResponseStatus(NO_CONTENT)
    public void delete(@PathVariable String cpf) {
        service.delete(cpf);
    }

    @PutMapping("/{cpf}")
    @ResponseStatus(OK)
    public User update(@RequestBody User user,@PathVariable String cpf) {
        return service.update(user,cpf);
    }

    @GetMapping
    public List<User> findAll(User user) {
        return service.findAll(user);
    }

    @PostMapping("/login")
    @ResponseStatus(OK)
    public User login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        if (email == null || password == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Email e senha são obrigatórios");
        }
        return service.findByEmailAndPassword(email, password);
    }
}
