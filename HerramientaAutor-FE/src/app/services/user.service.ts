import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginRQ } from "app/model/loginRQ.model";
import { User } from "app/model/user.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
  
    private url = 'http://localhost:8080/api/activitea/account';
  
    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
    constructor(
      private http: HttpClient
    ) { }
  
    createUser(user: User): Observable<void> {
      return this.http.post<void>(`${this.url}/create`, user, this.httpOptions);
    } 
  
    login(login: LoginRQ): Observable<User> {
      return this.http.post<User>(`${this.url}/login`, login, this.httpOptions);
    }
  }