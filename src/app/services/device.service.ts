import { Injectable } from '@angular/core';
import {Device} from '../models/device';
import {ApiBaseService} from './api-base.service';
import {HttpClient} from '@angular/common/http';
import {Observable, retry, Subject} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends ApiBaseService<Device> {

  //evento observable para abrir el modal de lista de dispositivos
  private readonly connectDeviceSource: Subject<boolean> = new Subject<boolean>();
  private readonly deviceSelectedSource: Subject<Device> = new Subject<Device>();
  connectDevice$ = this.connectDeviceSource.asObservable();
  deviceSelected$ = this.deviceSelectedSource.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/devices';
  }

  emitConnectDevice$(open: boolean): void {
    this.connectDeviceSource.next(open);
  }

  emitDeviceSelected$(device: Device): void {
    this.deviceSelectedSource.next(device);
  }

  public connect(id: number): Observable<void> {
    return this.http.post<void>(`${this.resourcePath()}/${id}`, null, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }


}
