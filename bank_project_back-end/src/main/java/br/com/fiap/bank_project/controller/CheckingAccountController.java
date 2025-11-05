package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.dto.checking.CheckingAccountCreateDTO;
import br.com.fiap.bank_project.dto.checking.CheckingAccountResponseDTO;
import br.com.fiap.bank_project.dto.checking.CheckingAccountUpdateDTO;
import br.com.fiap.bank_project.dto.common.AmountDTO;
import br.com.fiap.bank_project.dto.common.UserSummaryDTO;
import br.com.fiap.bank_project.entity.CheckingAccount;
import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.service.CheckingAccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/checking")
public class CheckingAccountController {

    @Autowired
    private CheckingAccountService service;

    @PostMapping()
    @ResponseStatus(CREATED)
    public CheckingAccountResponseDTO create(@Valid @RequestBody CheckingAccountCreateDTO dto) {
        CheckingAccount account = new CheckingAccount();
        User user = new User();
        user.setCpf(dto.getUserCpf());
        account.setUser(user);
        // saldo inicial opcional
        if (dto.getInitialBalance() != null && !dto.getInitialBalance().isBlank()) {
            try {
                account.setBalance(new BigDecimal(dto.getInitialBalance()));
            } catch (NumberFormatException ignored) {}
        }
        CheckingAccount saved = service.save(account);
        return toResponse(saved);
    }

    @PutMapping("/{cpf}")
    @ResponseStatus(OK)
    public CheckingAccountResponseDTO update(@Valid @RequestBody CheckingAccountUpdateDTO dto,
                                  @PathVariable String cpf) {
        CheckingAccount toUpdate = new CheckingAccount();
        toUpdate.setBalance(dto.getBalance());
        toUpdate.setExpense(dto.getExpense());
        return toResponse(service.update(cpf, toUpdate));
    }

    @DeleteMapping("/{cpf}")
    @ResponseStatus(NO_CONTENT)
    public void delete(@PathVariable String cpf) {
        service.delete(cpf);
    }

    @GetMapping
    public List<CheckingAccountResponseDTO> findAll() {
        return service.findAll(new CheckingAccount()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{cpf}")
    @ResponseStatus(OK)
    public CheckingAccountResponseDTO findByCpf(@PathVariable String cpf) {
        return toResponse(service.findAccountByCpf(cpf));
    }

    @PatchMapping("/{cpf}/withdraw")
    public ResponseEntity<String> withdraw(
            @PathVariable String cpf,
            @Valid @RequestBody AmountDTO body) {

        service.withdraw(cpf, body.getValue());

        return ResponseEntity.ok("Você retirou: " + body.getValue() + "R$");
    }

    @PatchMapping("/{cpf}/deposit")
    public ResponseEntity<String> deposit(
            @PathVariable String cpf,
            @Valid @RequestBody AmountDTO body) {

        service.deposit(cpf, body.getValue());

        return ResponseEntity.ok("Você depositou: " + body.getValue() + "R$");
    }

    private CheckingAccountResponseDTO toResponse(CheckingAccount a) {
        User u = a.getUser();
        UserSummaryDTO summary = u != null ? new UserSummaryDTO(u.getCpf(), u.getName(), u.getEmail()) : null;
        return new CheckingAccountResponseDTO(a.getId(), a.getBalance(), a.getExpense(), summary);
    }
}
