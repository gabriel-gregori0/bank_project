package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.entity.CheckingAccount;
import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.service.CheckingAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.*;

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

    @DeleteMapping("/{cpf}")
    @ResponseStatus(NO_CONTENT)
    public void delete(@PathVariable String cpf) {
        service.delete(cpf);
    }

    @GetMapping
    public List<CheckingAccount> findAll(CheckingAccount account) {
        return service.findAll(account);
    }

    @GetMapping("/{cpf}")
    @ResponseStatus(OK)
    public CheckingAccount findByCpf(@PathVariable String cpf) {
        return service.findAccountByCpf(cpf);
    }

    @PatchMapping("/{cpf}/withdraw")
    public ResponseEntity<String> withdraw(
            @PathVariable String cpf,
            @RequestBody Map<String, BigDecimal> requestBody) {

        BigDecimal value = requestBody.get("value");

        service.withdraw(cpf, value);

        return ResponseEntity.ok("Você retirou: " + value + "R$");
    }

    @PatchMapping("/{cpf}/deposit")
    public ResponseEntity<String> deposit(
            @PathVariable String cpf,
            @RequestBody Map<String, BigDecimal> requestBody) {

        BigDecimal value = requestBody.get("value");

        service.deposit(cpf, value);

        return ResponseEntity.ok("Você depositou: " + value + "R$");
    }
}
