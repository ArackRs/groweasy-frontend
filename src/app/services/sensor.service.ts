import { Injectable } from '@angular/core';
import {ApiBaseService} from './api-base.service';
import {Sensor} from '../models/sensor';
import {HttpClient} from '@angular/common/http';
import {Observable, retry} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SensorService extends ApiBaseService<Sensor>{

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/sensors';
  }

  public updateSensorConfig(id: number, dto: any): Observable<Sensor> {
    return this.http.put<Sensor>(`${this.resourcePath()}/${id}`, dto, this.httpOptions)
  }

  getSensorMetricsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.resourcePath()}/${id}/metrics`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
