package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

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

   

}
