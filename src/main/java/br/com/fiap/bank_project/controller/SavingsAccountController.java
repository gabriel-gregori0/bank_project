package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.entity.SavingsAccount;
import br.com.fiap.bank_project.service.SavingsAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.*;

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

    @DeleteMapping("/{cpf}")
    @ResponseStatus(NO_CONTENT)
    public void delete(@PathVariable String cpf) {
        service.delete(cpf);
    }

    @GetMapping
    public List<SavingsAccount> findAll(SavingsAccount account) {
        return service.findAll(account);
    }

    @PostMapping("/{cpf}/transfer")
    @ResponseStatus(OK)
    public ResponseEntity<String> transfer(
            @PathVariable String cpf,
            @RequestBody Map<String, BigDecimal> body) {

        BigDecimal value = body.get("value");
        service.transfer(cpf, value);
        return ResponseEntity.ok("Transferência de: " + value + "R$");
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
