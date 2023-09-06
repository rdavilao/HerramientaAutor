package es.uam.tfm.accounts.service;

import es.uam.tfm.accounts.exception.InsertException;
import es.uam.tfm.accounts.exception.LoginException;
import es.uam.tfm.accounts.model.Account;
import es.uam.tfm.accounts.repository.AccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.security.spec.KeySpec;

@Slf4j
@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private String errorMsg;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public void createAccount(Account account) throws InsertException {
        try {
            log.info("Creating account: " + account.getEmail());
            Account acc = this.accountRepository.findByEmail(account.getEmail());
            if (acc == null) {
                SecureRandom random = new SecureRandom();
                byte[] salt = new byte[16];
                random.nextBytes(salt);
                KeySpec spec = new PBEKeySpec(account.getPassword().toCharArray(), salt, 65536, 128);
                SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
                byte[] hash = factory.generateSecret(spec).getEncoded();
                account.setSalt(salt);
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hash.length; i++) {
                    sb.append(Integer.toString((hash[i] & 0xff) + 0x100, 16).substring(1));
                }
                account.setPassword(sb.toString());
                this.accountRepository.insert(account);
            } else {
                log.error("Already registered user");
                this.errorMsg = "Usuario ya registrado !";
                throw new InsertException(Account.class.getSimpleName(), this.errorMsg);
            }
        } catch (Exception e) {
            log.error("Error creating new account: " + e);
            if (this.errorMsg != null) {
                throw new InsertException(Account.class.getSimpleName(), this.errorMsg);
            } else {
                throw new InsertException(Account.class.getSimpleName(), "Error al crear cuenta");
            }
        }
    }

    public Account login(String email, String pwd) throws LoginException {
        try {
            log.info("Login, email: " + email);
            Account account = this.accountRepository.findByEmail(email);
            if (account != null) {
                KeySpec spec = new PBEKeySpec(pwd.toCharArray(), account.getSalt(), 65536, 128);
                SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
                byte[] hash = factory.generateSecret(spec).getEncoded();
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hash.length; i++) {
                    sb.append(Integer.toString((hash[i] & 0xff) + 0x100, 16).substring(1));
                }
                if (sb.toString().equals(account.getPassword())) {
                    log.info("Login successful");
                    return account;
                } else {
                    log.error("Wrong password");
                    this.errorMsg = "Usario o contraseña incorrectos !";
                    throw new LoginException(Account.class.getSimpleName(), this.errorMsg);
                }
            } else {
                log.error("Email doesn't exist");
                this.errorMsg = "Usuario no registrado !";
                throw new LoginException(Account.class.getSimpleName(), this.errorMsg);
            }
        } catch (Exception e) {
            log.error("Login failed: " + e);
            if (this.errorMsg != null) {
                throw new LoginException(Account.class.getSimpleName(), this.errorMsg);
            } else {
                throw new LoginException(Account.class.getSimpleName(), "Error al ingresar !");
            }
        }
    }
}
