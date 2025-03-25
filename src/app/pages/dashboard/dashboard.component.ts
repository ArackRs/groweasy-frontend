import {ChangeDetectorRef, Component, inject, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser, NgIf} from '@angular/common';
import {DeviceService} from '../../services/device.service';
import {Device} from '../../models/device';
import {ConnectDeviceComponent} from '../../components/connect-device/connect-device.component';
import {PageViewComponent} from '../../layouts/page-view/page-view.component';
import {Button} from 'primeng/button';
import {ProgressBar} from "primeng/progressbar";
import {ProgressSpinner} from 'primeng/progressspinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SensorService} from '../../services/sensor.service';
import {Config} from '../../models/config';
import {UIChart} from 'primeng/chart';
import {SensorCardComponent} from '../../layouts/sensor-card/sensor-card.component';
import {MetricCardComponent} from '../../layouts/metric-card/metric-card.component';
import {AlertCardComponent} from '../../layouts/alert-card/alert-card.component';

@Component({
    selector: 'app-home',
  imports: [
    ConnectDeviceComponent,
    PageViewComponent,
    Button,
    NgIf,
    ProgressBar,
    ProgressSpinner,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UIChart,
    SensorCardComponent,
    MetricCardComponent,
    AlertCardComponent,
  ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  connectedDevice: Device | undefined = localStorage.getItem('connectedDevice') ? JSON.parse(localStorage.getItem('connectedDevice') as string) : null;
  valueBar: number = localStorage.getItem('connectedDevice') ? 100 : 0;
  interval: any;
  isLoading: boolean = false;
  alerts: string[] = [];
  umbral: number = 15;
  range: number[] = [0, 30];

  config!: {
    temperature: Config;
    humidity: Config;
    luminosity: Config;
  }

  metrics: number[] = [0, 0, 0];
  chartData: any;
  chartOptions: any;
  platformId = inject(PLATFORM_ID);

  constructor(
    private readonly deviceService: DeviceService,
    private readonly sensorService: SensorService,
    private readonly ngZone: NgZone,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initChart();
    const connectedDevice: Device =  localStorage.getItem('connectedDevice') ? JSON.parse(localStorage.getItem('connectedDevice') as string) : null;
    if (connectedDevice) {
      this.config = {
        temperature: connectedDevice.sensors[0].config,
        humidity: connectedDevice.sensors[1].config,
        luminosity: connectedDevice.sensors[2].config
      }
      this.getSensorMetrics();
    }
    this.deviceService.deviceSelected$.subscribe((device: Device): void => {
      this.progressBar();
      this.connectedDevice = device;
    });
  }

  connectDevice(): void {
    this.deviceService.emitConnectDevice$(true);
  }

  progressBar(): void {
    this.isLoading = true;
    this.ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this.ngZone.run(() => {
          this.valueBar = this.valueBar + Math.floor(Math.random() * 10) + 1;
          if (this.valueBar >= 100) {
            setTimeout(() => {
              this.valueBar = 100;
              this.isLoading = false;
              clearInterval(this.interval);
            }, 3000);
          }
        });
      }, 100);
    });
  }

  getSensorMetrics(): void {

    this.sensorService.getSensorMetricsById(1).subscribe(data => {
      if (data && data.length > 0) {
        const lastTemperatureMetric = data[data.length - 1].metric.replace('°C', '').trim();
        this.metrics[0] = parseFloat(lastTemperatureMetric);
        this.updateChart();
        this.alertThreshold();
      }
    });

    this.sensorService.getSensorMetricsById(2).subscribe(data => {
      if (data && data.length > 0) {
        const lastHumidityMetric = data[data.length - 1].metric.replace('%', '').trim();
        this.metrics[1] = parseFloat(lastHumidityMetric);
        this.updateChart();
        this.alertThreshold();
      }
    });

    this.sensorService.getSensorMetricsById(3).subscribe(data => {
      if (data && data.length > 0) {
        const lastLuminosityMetric = data[data.length - 1].metric.replace('lx', '').trim();
        this.metrics[2] = parseFloat(lastLuminosityMetric) / 100;
        this.updateChart();
        this.alertThreshold();
      }
    });

  }

  alertThreshold(): void {
    const tempThreshold: number = this.config.temperature.threshold;
    const humThreshold: number = this.config.humidity.threshold;
    const lumThreshold: number = this.config.luminosity.threshold;

    if (this.metrics[0] > tempThreshold) {
      this.alerts.push(`Temperatura supera el umbral ${tempThreshold}`);
    }
    if (this.metrics[1] > humThreshold) {
      this.alerts.push(`Humedad supera el umbral ${humThreshold}`);
    }
    if (this.metrics[2] * 100 > lumThreshold) {
      this.alerts.push(`Luminosidad supera el umbral ${lumThreshold}`);
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  initChart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');

      this.chartData = {
        labels: ['Temperature', 'Humidity', 'Luminosity'],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }
        ]
      };

      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        }
      };
      this.cd.markForCheck();
    }
  }

  updateChart(): void {
    console.log('Datos actualizadosdd');
    this.chartData.datasets[0].data = this.metrics;
    this.chartData = { ...this.chartData };
  }

}
