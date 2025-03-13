import { Injectable } from '@angular/core';
import {Device} from '../model/device';
import {ApiBaseService} from './api-base.service';
import {HttpClient} from '@angular/common/http';
import {Observable, retry} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends ApiBaseService<Device> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/devices';
  }

  public connect(id: number): Observable<void> {
    return this.http.post<void>(`${this.resourcePath()}/${id}`, null, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }


}
