package es.uam.tfm.accounts.repository;

import es.uam.tfm.accounts.model.Account;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AccountRepository extends MongoRepository<Account, String> {

    Account findByEmail(String email);
}
