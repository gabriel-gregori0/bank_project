package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.entity.CheckingAccount;
import br.com.fiap.bank_project.service.CheckingAccountService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/api/checking")
public class CheckingAccountController {

    private CheckingAccountService service;

    @PostMapping("/{cpf}")
    @ResponseStatus(CREATED)
    public CheckingAccount create(@PathVariable  String cpf) {
        return service.save(cpf);
    }
}
