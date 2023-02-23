import { Injectable, NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';

@Injectable()
class AuthGuard implements CanActivate {

  constructor(private router: Router){
  }

  canActivate() {
    if(sessionStorage.getItem("email") != null){
      return true;
    }
    this.router.navigate(["/login"]);
    return false;
  }
}

const routes: Routes =[
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }, {
    path: 'login',
    component: LoginComponent
  },{
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [{
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
  providers:[
    AuthGuard
  ]
})

export class AppRoutingModule { }


