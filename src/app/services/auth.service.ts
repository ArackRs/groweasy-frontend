import { Injectable } from '@angular/core';
import { ApiBaseService } from "./api-base.service";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, retry } from "rxjs";
import {tap} from "rxjs/operators";
import {Auth} from "../models/auth";
import {SignIn} from "../models/sign-in";
import {SignUp} from "../models/sign-up";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiBaseService<Auth> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/auth';
  }

  public signUp(item: SignUp): Observable<Auth> {
    return this.http.post<Auth>(`${this.resourcePath()}/sign-up`, item, this.httpOptions)
      .pipe(
        tap(response => {
          this.saveCredentials(response.jwt, response.username);
        }),
        retry(2),
        catchError(this.handleError)
      );
  }
  public signIn(item: SignIn): Observable<Auth> {
    return this.http.post<Auth>(`${this.resourcePath()}/log-in`, item, this.httpOptions)
      .pipe(
        tap(response => {
          this.saveCredentials(response.jwt, response.username);
        }),
        retry(2),
        catchError(this.handleError)
      );
  }
  public guest(): Observable<Auth> {
    return this.http.post<Auth>(`${this.resourcePath()}/guest`, this.httpOptions)
      .pipe(
        tap(response => {
          this.saveCredentials(response.jwt, response.username);
        }),
        retry(2),
        catchError(this.handleError)
      );
  }
  public signOut(): Observable<void> {
    return this.http.post<void>(`${this.resourcePath()}/log-out`, this.httpOptions)
      .pipe(
        tap(() => {
          this.clearCredentials();
        }),
        retry(2),
        catchError(this.handleError)
      );
  }

  public handleSessionExpired(): void {
    this.clearCredentials();
    alert('Session has expired. You will be redirected to the login page.');
    window.location.href = '/';
  }
  public getToken(): string | null {
    return localStorage.getItem('token');
  }
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private saveCredentials(token: string, username: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  }
  private clearCredentials(): void {
    localStorage.clear();
  }
}
