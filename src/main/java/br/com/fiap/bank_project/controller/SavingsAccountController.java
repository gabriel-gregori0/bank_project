package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.entity.SavingsAccount;
import br.com.fiap.bank_project.service.SavingsAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/savings")
public class SavingsAccountController {

    private final SavingsAccountService service;


    @Autowired
    public SavingsAccountController(SavingsAccountService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(CREATED)
    public SavingsAccount create(@RequestBody SavingsAccount account) {
        return service.save(account);
    }

    @PutMapping("/{cpf}")
    @ResponseStatus(OK)
    public SavingsAccount update(@PathVariable String cpf,
                                 @RequestBody SavingsAccount account) {
        return service.update(cpf,account);
    }
}
