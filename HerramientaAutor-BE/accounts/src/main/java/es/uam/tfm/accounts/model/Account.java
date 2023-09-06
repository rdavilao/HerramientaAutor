package es.uam.tfm.accounts.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "account")
public class Account {

    @Id
    private String _id;

    @Indexed(name ="idx_email", unique = true)
    private String email;

    private String password;

    private byte[] salt;

    private String accountType;

}
