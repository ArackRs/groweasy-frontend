import {Component, OnInit} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {PageViewComponent} from "../../layouts/page-view/page-view.component";
import {ChartData, ChartType} from 'chart.js';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MessageService} from 'primeng/api';
import {Config} from '../../models/config';
import {Device} from '../../models/device';
import {Toast} from 'primeng/toast';
import {SensorService} from '../../services/sensor.service';

@Component({
    selector: 'app-performance',
  imports: [
    BaseChartDirective,
    PageViewComponent,
    Toast
  ],
    templateUrl: './performance.component.html',
    styleUrl: './performance.component.css'
})
export class PerformanceComponent implements OnInit {

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
    private readonly http: HttpClient,
    private readonly sensorService: SensorService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Llama a la función para obtener los datos de cada sensor
    const connectedDevice: Device =  localStorage.getItem('connectedDevice') ? JSON.parse(localStorage.getItem('connectedDevice') as string) : null;
    if (connectedDevice) {
      this.config = {
        temperature: connectedDevice.sensors[0].config,
        humidity: connectedDevice.sensors[1].config,
        luminosity: connectedDevice.sensors[2].config
      }
      this.getSensorMetrics();
    }
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
      this.messageService.add({severity: 'error', summary: 'Alerta', detail: `Temperatura supera el umbral ${tempThreshold}`, sticky: true });
    }
    if (this.doughnutChartData.datasets[0].data[1] > humThreshold) {
      this.messageService.add({ severity: 'error', summary: 'Alerta', detail: `Humedad supera el umbral ${humThreshold}`, sticky: true });
    }
    if (this.doughnutChartData.datasets[0].data[2] * 100 > lumThreshold) {
      this.messageService.add({ severity: 'error', summary: 'Alerta', detail: `Luminosidad supera el umbral ${lumThreshold}`, sticky: true });
    }
  }

}
