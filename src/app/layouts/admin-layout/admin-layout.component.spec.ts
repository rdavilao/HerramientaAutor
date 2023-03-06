import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AdminLayoutComponent } from './admin-layout.component';

const RouterSpy = jasmine.createSpyObj(
  'Router',
  ['navigate']
);

const mockRoute = { 
  events: of({ test: 'test' }) 
};

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ AdminLayoutComponent ],
      providers : [
       { provide: Router, useValue: RouterSpy},
       { provide: Router, useValue: mockRoute}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
