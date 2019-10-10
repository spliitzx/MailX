import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { routes } from '../../../app-routing.module';
import { MODULES, IMPORTS } from '../../../shared.module';
import { RegisterComponent } from './register.component';
import { By } from '@angular/platform-browser';
import { User } from '../../../models/auth/User';
import { AuthService } from '../auth.service';
import { Observable, of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let location: Location;
  let debug: DebugElement;
  let service: MockAuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ...MODULES ],
      imports: [ RouterTestingModule.withRoutes(routes), ...IMPORTS ],
      providers: [ {provide: AuthService, useClass: MockAuthService} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    service = TestBed.get(AuthService);
    location = TestBed.get(Location);
    debug = fixture.debugElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('authToken');
    service = null;
    component = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login button should to go auth/login', fakeAsync(() => {
    fixture.ngZone.run(() => {
      spyOn(component, 'login').and.callThrough();
      debug.query(By.css('#login-button')).nativeElement.click();
      expect(component.login).toHaveBeenCalled();
      tick();
      expect(location.path()).toBe('/auth/login');
    });
  }));

  it('should successfully register a new mock user on submit', (() => {
    spyOn(service, 'register').and.callThrough();
    spyOn(component, 'submit').and.callThrough();
    fakeFields();
    debug.query(By.css('#register-button')).nativeElement.click();
    expect(service.register).toHaveBeenCalled();
    expect(component.registerLoading).toBeFalsy();
  }));

  it('should produce errors when values are null', () => {
    component.submit();
    // https://github.com/adobe/brackets/pull/5492
    expect(component.errors.username).toBeTruthy();
    expect(component.errors.email).toBeTruthy();
    expect(component.errors.password).toBeTruthy();
    expect(component.registerLoading).toBeFalsy();
  });

  /**
   * Helpers
   */
  function fakeFields() {
    component.email = 'me@miitch.io';
    component.username = 'spliitzx';
    component.password = 'hunter2';
  }
});

class MockAuthService {

  public register(form: RegisterForm): Observable<AuthResponse> {
    let user = new User({});
    user.username = form.username;
    user.email = form.password;
    return of({
      token: '1',
      user: user
    });
  }

}

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}