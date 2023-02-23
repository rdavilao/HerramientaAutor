export class User {
    email: string;
    password: string;
    accountType: string;

    constructor(
        email: string,
        password: string,
        accountType: string
    ) {
        this.email = email;
        this.password = password;
        this.accountType = accountType;
    }
}