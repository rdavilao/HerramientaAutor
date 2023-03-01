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
  flagNotif: boolean; 
  typeNotif: string;
  msgNotif: string;
  iconNotif: string;
  formChecked: boolean;
  flagErrorNewUser: boolean;
  errorMsg: string;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userLogged = new User("","","");
    this.pwdConfirm = "";
    this.loginRQ = new LoginRQ("","");
    this.newUser = new User("","","");
    this.flagNotif = false;
    this.typeNotif = "";
    this.msgNotif = "";
    this.formChecked = false;
    this.flagErrorNewUser = false;
    this.errorMsg = "";
    this.iconNotif = "";
  }

  log(): void {
    this.userService.login(this.loginRQ).subscribe({
      next: (v) => {
        this.logIn(v);
      },
      error: (e) => {
        this.flagNotif = true;
        this.msgNotif = "Email o contraseña incorrectos !";
        this.typeNotif = "danger";
        this.iconNotif = "cancel";
      }
    });
  }

  changeForm(event: any): void{
  }

  logIn(data: any): void {
    sessionStorage.setItem('email', data.email);
    sessionStorage.setItem('pwd', data.password);
    sessionStorage.setItem('accountType', data.accountType);
    this.router.navigate(["/dashboard/PU"]);
  }

  signIn(): void {
    var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]/;
    if(this.newUser.email == "" || !this.newUser.email.match(validEmail)){
      this.flagErrorNewUser = true;
      this.errorMsg = "Email incorrecto !";
      return;
    }
    if(this.newUser.password.length < 8) {
      this.flagErrorNewUser = true;
      this.errorMsg = "Contraseñas debe tener al menos 8 caracteres !";
      return;
    }
    if(this.newUser.password != this.pwdConfirm) {
      this.flagErrorNewUser = true;
      this.errorMsg = "Contraseñas no coinciden!";
      return;
    }    
    this.newUser.accountType = "F";      
    this.userService.createUser(this.newUser).subscribe({
      next: (v) => {          
        this.flagErrorNewUser = false;
        this.formChecked = false;
        this.flagNotif = true;
        this.msgNotif = "Registro exitoso !";
        this.typeNotif = "info";
        this.iconNotif = "check_circle";        
        this.loginRQ.email = this.newUser.email;
        this.loginRQ.pwd = "";
        this.newUser = new User("","","");
        this.pwdConfirm = "";
      },
      error: (e) => {
        this.flagErrorNewUser = true;
        this.errorMsg = e.error;
      }
    });  
  }

}
