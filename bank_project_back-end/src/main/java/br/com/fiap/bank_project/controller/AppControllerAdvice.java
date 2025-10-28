package br.com.fiap.bank_project.controller;

import br.com.fiap.bank_project.exception.ApiErrors;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

public class AppControllerAdvice {

    @ExceptionHandler(ResponseStatusException.class)
    @ResponseStatus
    public ApiErrors handleNotFoundException(ResponseStatusException ex) {
        String message = ex.getMessage();
        return new ApiErrors(message);
    }
}
