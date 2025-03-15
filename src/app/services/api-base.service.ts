import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, retry, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseService<T> {

  basePath: string = `${environment.apiUrl}/api/v1`;
  resourceEndpoint: string = '/resources';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  constructor(protected http: HttpClient) { }

  protected resourcePath(): string {
    return `${this.basePath}${this.resourceEndpoint}`;
  }

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error de red o del lado del cliente.
      console.error(`An error occurred: ${error.error.message}`);
      // Aquí podrías llamar a un servicio de notificaciones para mostrar el mensaje.
      // this.notificationService.showError('Network error occurred. Please check your connection.');
    } else {
      // Error del backend.
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error("Something happened with the request, please try again later."));
  }

  public create(item: any): Observable<T> {
    return this.http.post<T>(this.resourcePath(), JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public delete(): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public update(item: any): Observable<T> {
    return this.http.put<T>(`${this.resourcePath()}`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.resourcePath()}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  healthCheck(): Observable<string> {
    return this.http.get(`${this.basePath}/health-check`, { responseType: 'text' })
      .pipe(retry(2), catchError(this.handleError));
  }
}
