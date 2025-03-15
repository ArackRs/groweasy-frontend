import { Injectable } from '@angular/core';
import {ApiBaseService} from "./api-base.service";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, retry} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiBaseService<User>{

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint='/users'
  }

  public loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.resourcePath()}/me`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError),
      );
  }

  public getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.resourcePath()}/${username}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public getUsername(): string {
    return localStorage.getItem('username') ?? 'username';
  }
}
