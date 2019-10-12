import { Injectable } from '@angular/core';
import { HttpService, APIResponse } from '../../providers/http.service';
import { User } from '../../models/auth/User';
import { API } from '../../../constants';
import { Observable } from 'rxjs';

interface RegisterForm {
    username: string;
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

@Injectable()
export class AuthService {

    private _user: User;
    private _token: string;

    constructor(private http: HttpService) { }

    public register(form: RegisterForm): Observable<APIResponse<AuthResponse>> {
        return this.http.post<AuthResponse>(API.format('auth/register'), form);
    }

    public set token(token: string) {
        localStorage.setItem('authToken', token);
        this._token = token;
    }

    public set user(user: User) {
        this._user = user;
    }

    public get token(): string {
        return this._token;
    }

    public get user(): User {
        return this._user;
    }
}
