package br.com.fiap.bank_project.exception;

import java.io.Serializable;
import java.util.List;

public class ApiErrors implements Serializable {

    private final List<String> errors;

    public ApiErrors(List<String> errors) {
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
