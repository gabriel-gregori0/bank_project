package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.dto.user.UserCreateDTO;
import br.com.fiap.bank_project.dto.user.UserLoginDTO;
import br.com.fiap.bank_project.dto.user.UserResponseDTO;
import br.com.fiap.bank_project.dto.user.UserUpdateDTO;
import br.com.fiap.bank_project.entity.User;
import br.com.fiap.bank_project.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping
    @ResponseStatus(CREATED)
    public UserResponseDTO create(@Valid @RequestBody UserCreateDTO dto) {
        User user = new User(dto.getName(), dto.getCpf(), dto.getEmail(), dto.getPassword(),
                dto.getRole() != null ? dto.getRole() : "USER");
        User saved = service.save(user);
        return toUserResponse(saved);
    }

    @GetMapping("/{cpf}")
    @ResponseStatus(OK)
    public UserResponseDTO findByCpf(@PathVariable String cpf) {
        return toUserResponse(service.findByCpf(cpf));
    }

    @DeleteMapping("/{cpf}")
    @ResponseStatus(NO_CONTENT)
    public void delete(@PathVariable String cpf) {
        service.delete(cpf);
    }

    @PutMapping("/{cpf}")
    @ResponseStatus(OK)
    public UserResponseDTO update(@Valid @RequestBody UserUpdateDTO dto, @PathVariable String cpf) {
        User updated = service.update(new User(dto.getName(), null, dto.getEmail(), null, null), cpf);
        return toUserResponse(updated);
    }

    @GetMapping
    public List<UserResponseDTO> findAll() {
        return service.findAll(new User()).stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    @PostMapping("/login")
    @ResponseStatus(OK)
    public UserResponseDTO login(@Valid @RequestBody UserLoginDTO credentials) {
        User found = service.findByEmailAndPassword(credentials.getEmail(), credentials.getPassword());
        return toUserResponse(found);
    }

    private UserResponseDTO toUserResponse(User u) {
        return new UserResponseDTO(u.getId(), u.getName(), u.getCpf(), u.getEmail(), u.getRole());
    }
}
