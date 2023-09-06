package es.uam.tfm.accounts.api;

import es.uam.tfm.accounts.api.dto.LoginRQ;
import es.uam.tfm.accounts.exception.InsertException;
import es.uam.tfm.accounts.exception.LoginException;
import es.uam.tfm.accounts.model.Account;
import es.uam.tfm.accounts.service.AccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/activitea/account")
@Slf4j
public class AccountController {

    private final AccountService service;


    public AccountController(AccountService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<Account> login(@RequestBody LoginRQ loginRQ) {
        try {
            return ResponseEntity.ok(this.service.login(loginRQ.getEmail(), loginRQ.getPwd()));
        } catch (LoginException ex) {
            log.error("Error: " + ex);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<String> createAccount(@RequestBody Account account) {
        try {
            this.service.createAccount(account);
            return ResponseEntity.ok().build();
        } catch (InsertException ex) {
            log.error("Error: " + ex);
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
