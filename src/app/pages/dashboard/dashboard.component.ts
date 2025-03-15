import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {ConfigureSensorComponent} from '../../components/configure-sensor/configure-sensor.component';
import {DeviceService} from '../../services/device.service';
import {Device} from '../../models/device';
import {Sensor} from '../../models/sensor';
import {ConnectDeviceComponent} from '../../components/connect-device/connect-device.component';
import {PageViewComponent} from '../../layouts/page-view/page-view.component';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {ProgressBar} from "primeng/progressbar";
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
    selector: 'app-home',
  imports: [
    ConfigureSensorComponent,
    ConnectDeviceComponent,
    PageViewComponent,
    Button,
    NgIf,
    Card,
    ProgressBar,
    ProgressSpinner
  ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  showModal: boolean = false;
  connectedDevice: Device | undefined = localStorage.getItem('connectedDevice') ? JSON.parse(localStorage.getItem('connectedDevice') as string) : null;
  selectedSensor!: Sensor;
  value: number = localStorage.getItem('connectedDevice') ? 100 : 0;
  interval: any;
  isLoading: boolean = false;

  constructor(
    private readonly deviceService: DeviceService,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit(): void {

    this.deviceService.deviceSelected$.subscribe((device: Device): void => {
      this.progressBar();
      this.connectedDevice = device;
    });
  }

  toggleModal(sensor: Sensor){
    this.showModal = !this.showModal;
    this.selectedSensor = sensor;
  }

  connectDevice(): void {
    this.deviceService.emitConnectDevice$(true);
  }

  progressBar(): void {
    this.isLoading = true;
    this.ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this.ngZone.run(() => {
          this.value = this.value + Math.floor(Math.random() * 10) + 1;
          if (this.value >= 100) {
            setTimeout(() => {
              this.value = 100;
              this.isLoading = false;
              clearInterval(this.interval);
            }, 3000);
          }
        });
      }, 100);
    });
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
