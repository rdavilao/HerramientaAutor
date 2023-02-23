import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRQ } from 'app/model/loginRQ.model';
import { User } from 'app/model/user.model';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLogged: User;
  newUser: User;
  loginRQ: LoginRQ;
  pwdConfirm: string;  

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userLogged = new User("","","");
    this.pwdConfirm = "";
    this.loginRQ = new LoginRQ("","");
    this.newUser = new User("","","");
  }

  log(): void {
    this.userService.login(this.loginRQ).subscribe(
      res => {
        this.logIn(res);
      }
    );
  }

  logIn(data: any): void {
    sessionStorage.setItem('email', data.email);
    sessionStorage.setItem('pwd', data.password);
    sessionStorage.setItem('accountType', data.accountType);
    this.router.navigate(["/dashboard/PU"]);
  }

  signIn(): void {
    this.newUser.accountType = "F";
    this.userService.createUser(this.newUser).subscribe(
      res => {
        location.reload();
      }
    );
  }

}
