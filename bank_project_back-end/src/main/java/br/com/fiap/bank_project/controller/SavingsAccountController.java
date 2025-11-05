package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.dto.common.AmountDTO;
import br.com.fiap.bank_project.dto.common.UserSummaryDTO;
import br.com.fiap.bank_project.dto.savings.SavingsAccountCreateDTO;
import br.com.fiap.bank_project.dto.savings.SavingsAccountResponseDTO;
import br.com.fiap.bank_project.dto.savings.SavingsAccountUpdateDTO;
import br.com.fiap.bank_project.entity.CheckingAccount;
import br.com.fiap.bank_project.entity.SavingsAccount;
import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.service.SavingsAccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

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
    public SavingsAccountResponseDTO create(@Valid @RequestBody SavingsAccountCreateDTO dto) {
        SavingsAccount account = new SavingsAccount();
        User user = new User();
        user.setCpf(dto.getUserCpf());
        account.setUser(user);
        if (dto.getCheckingCpf() != null && !dto.getCheckingCpf().isBlank()) {
            CheckingAccount checking = new CheckingAccount();
            User checkingUser = new User();
            checkingUser.setCpf(dto.getCheckingCpf());
            checking.setUser(checkingUser);
            account.setCheckingAccount(checking);
        }
        if (dto.getInitialBalance() != null && !dto.getInitialBalance().isBlank()) {
            try { account.setBalance(new BigDecimal(dto.getInitialBalance())); } catch (NumberFormatException ignored) {}
        }
        if (dto.getInitialInvestment() != null && !dto.getInitialInvestment().isBlank()) {
            try { account.setInvestment(new BigDecimal(dto.getInitialInvestment())); } catch (NumberFormatException ignored) {}
        }
        return toResponse(service.save(account));
    }

    @PutMapping("/{cpf}")
    @ResponseStatus(OK)
    public SavingsAccountResponseDTO update(@PathVariable String cpf,
                                 @Valid @RequestBody SavingsAccountUpdateDTO dto) {
        SavingsAccount toUpdate = new SavingsAccount();
        toUpdate.setInvestment(dto.getInvestment());
        toUpdate.setTransference(dto.getTransference());
        toUpdate.setBalance(dto.getBalance());
        return toResponse(service.update(cpf, toUpdate));
    }

    @DeleteMapping("/{cpf}")
    @ResponseStatus(NO_CONTENT)
    public void delete(@PathVariable String cpf) {
        service.delete(cpf);
    }

    @GetMapping
    public List<SavingsAccountResponseDTO> findAll() {
        return service.findAll(new SavingsAccount()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{cpf}")
    @ResponseStatus(OK)
    public SavingsAccountResponseDTO findByCpf(@PathVariable String cpf) {
        return toResponse(service.findSavingsByCpf(cpf));
    }

    @PostMapping("/{cpf}/transfer")
    @ResponseStatus(OK)
    public ResponseEntity<String> transfer(
            @PathVariable String cpf,
            @Valid @RequestBody AmountDTO body) {

        service.transfer(cpf, body.getValue());
        return ResponseEntity.ok("Transferência de: " + body.getValue() + "R$");
    }

    @PatchMapping("/{cpf}/deposit")
    public ResponseEntity<String> deposit(
            @PathVariable String cpf,
            @Valid @RequestBody AmountDTO body) {

        service.deposit(cpf, body.getValue());

        return ResponseEntity.ok("Você depositou: " + body.getValue() + "R$");
    }

    @PatchMapping("/{cpf}/withdraw")
    public ResponseEntity<String> withdraw(
            @PathVariable String cpf,
            @Valid @RequestBody AmountDTO body) {

        service.withdraw(cpf, body.getValue());

        return ResponseEntity.ok("Você retirou: " + body.getValue() + "R$");
    }

    private SavingsAccountResponseDTO toResponse(SavingsAccount a) {
        User u = a.getUser();
        UserSummaryDTO summary = u != null ? new UserSummaryDTO(u.getCpf(), u.getName(), u.getEmail()) : null;
        return new SavingsAccountResponseDTO(a.getId(), a.getBalance(), a.getTransference(), a.getInvestment(), summary);
    }
}
