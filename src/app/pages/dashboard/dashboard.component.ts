import {ChangeDetectorRef, Component, effect, inject, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser, NgFor, NgIf} from '@angular/common';
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
import {MeterGroup} from 'primeng/metergroup';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Slider} from 'primeng/slider';
import {SensorService} from '../../services/sensor.service';
import {MessageService} from 'primeng/api';
import {Config} from '../../models/config';
import {ChartData, ChartType} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {UIChart} from 'primeng/chart';
import {Message} from 'primeng/message';
import {SensorCardComponent} from '../../layouts/sensor-card/sensor-card.component';
import {MetricCardComponent} from '../../layouts/metric-card/metric-card.component';
import {AlertCardComponent} from '../../layouts/alert-card/alert-card.component';

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
    ProgressSpinner,
    MeterGroup,
    NgFor,
    CommonModule,
    ReactiveFormsModule,
    Slider,
    FormsModule,
    BaseChartDirective,
    UIChart,
    Message,
    SensorCardComponent,
    MetricCardComponent,
    AlertCardComponent
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

  public doughnutChartData: ChartData<'doughnut'> = {

    labels: [
      'Temperature', 'Humidity', 'Luminosity'
    ],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }
    ]
  };

  public doughnutChartType: ChartType = 'doughnut';

  // Configuración del gráfico
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  constructor(
    private readonly deviceService: DeviceService,
    private readonly sensorService: SensorService,
    private readonly messageService: MessageService,
    private readonly ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
        this.doughnutChartData.datasets[0].data[0] = parseFloat(lastTemperatureMetric);
        this.updateChart();
        this.alertThreshold();
      }
    });


    this.sensorService.getSensorMetricsById(2).subscribe(data => {
      if (data && data.length > 0) {
        const lastHumidityMetric = data[data.length - 1].metric.replace('%', '').trim();
        this.doughnutChartData.datasets[0].data[1] = parseFloat(lastHumidityMetric);
        this.updateChart();
        this.alertThreshold();
      }
    });

    this.sensorService.getSensorMetricsById(3).subscribe(data => {
      if (data && data.length > 0) {
        const lastLuminosityMetric = data[data.length - 1].metric.replace('lx', '').trim();
        this.doughnutChartData.datasets[0].data[2] = parseFloat(lastLuminosityMetric) / 100;
        this.updateChart();
        this.alertThreshold();
      }
    });
  }

  updateChart(): void {
    this.doughnutChartData = { ...this.doughnutChartData };
  }

  alertThreshold(): void {
    const tempThreshold: number = this.config.temperature.threshold;
    const humThreshold: number = this.config.humidity.threshold;
    const lumThreshold: number = this.config.luminosity.threshold;

    if (this.doughnutChartData.datasets[0].data[0] > tempThreshold) {
      this.alerts.push(`Temperatura supera el umbral ${tempThreshold}`);
    }
    if (this.doughnutChartData.datasets[0].data[1] > humThreshold) {
      this.alerts.push(`Humedad supera el umbral ${humThreshold}`);
    }
    if (this.doughnutChartData.datasets[0].data[2] * 100 > lumThreshold) {
      this.alerts.push(`Luminosidad supera el umbral ${lumThreshold}`);
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
