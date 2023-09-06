import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [    
    { path: '/resources/PU', title: 'Recursos Públicos', icon: 'public', class: ''},
    { path: '/resources/PR', title: 'Recursos Privados', icon: 'lock', class: ''}
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
  logOut(): void {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('pwd');
    sessionStorage.removeItem('accountType');
    location.reload();
}
}
