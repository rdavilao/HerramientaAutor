package es.uam.tfm.accounts.api.dto;

import lombok.Data;

@Data
public class LoginRQ {

    private String email;
    private String pwd;
}
