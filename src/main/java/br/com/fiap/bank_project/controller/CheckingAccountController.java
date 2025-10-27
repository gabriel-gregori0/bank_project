package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.entity.CheckingAccount;
import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.service.CheckingAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/checking")
public class CheckingAccountController {

    @Autowired
    private CheckingAccountService service;

    @PostMapping()
    @ResponseStatus(CREATED)
    public CheckingAccount create(@RequestBody CheckingAccount account) {
        return service.save(account);
    }


    @PutMapping("/{cpf}")
    @ResponseStatus(OK)
    public CheckingAccount update(@RequestBody CheckingAccount account,
                                  @PathVariable String cpf) {
        return service.update(cpf,account);
    }
}
