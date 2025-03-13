import { Injectable } from '@angular/core';
import {ApiBaseService} from './api-base.service';
import {Sensor} from '../model/sensor';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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
}
