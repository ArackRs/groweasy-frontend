import { Component } from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {ChartData, ChartType} from 'chart.js';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-view-analysis',
    imports: [
        BaseChartDirective
    ],
    templateUrl: './view-analysis.component.html',
    styleUrls: ['./view-analysis.component.css']
})
export class ViewAnalysisComponent {
  public doughnutChartLabels: string[] = ['Humedad', 'Temperatura', 'Luminosidad'];

  // Define ChartData para los gráficos
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [0, 0, 0], // Inicializa con valores vacíos
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'], // Colores para cada sección
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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Llama a la función para obtener los datos de cada sensor
    this.getSensorMetrics();
  }

  // Función para obtener y actualizar los datos de los sensores
  getSensorMetrics() {
    // Petición para sensorId: 1 (Temperatura)
    this.http.get<any[]>(`${environment.apiUrl}/sensors/1/metrics`).subscribe(data => {
      if (data && data.length > 0) {
        // Obtener el último dato del sensor de temperatura
        const lastTemperatureMetric = data[data.length - 1].metric.replace('°C', '').trim();
        this.doughnutChartData.datasets[0].data[1] = parseFloat(lastTemperatureMetric); // Actualiza la temperatura
        this.updateChart(); // Refresca el gráfico
      }
    });

    // Petición para sensorId: 2 (Humedad)
    this.http.get<any[]>(`${environment.apiUrl}/sensors/2/metrics`).subscribe(data => {
      if (data && data.length > 0) {
        // Obtener el último dato del sensor de humedad
        const lastHumidityMetric = data[data.length - 1].metric.replace('%', '').trim();
        this.doughnutChartData.datasets[0].data[0] = parseFloat(lastHumidityMetric); // Actualiza la humedad
        this.updateChart(); // Refresca el gráfico
      }
    });

    // Petición para sensorId: 3 (Luminosidad)
    this.http.get<any[]>(`${environment.apiUrl}/sensors/3/metrics`).subscribe(data => {
      if (data && data.length > 0) {
        // Obtener el último dato del sensor de luminosidad
        const lastLuminosityMetric = data[data.length - 1].metric.replace('lux', '').trim();
        this.doughnutChartData.datasets[0].data[2] = parseFloat(lastLuminosityMetric)/100; // Actualiza la luminosidad
        this.updateChart(); // Refresca el gráfico
      }
    });
  }

  // Función para forzar la actualización del gráfico
  updateChart() {
    // Esto es para asegurar que Angular detecte los cambios en los datos del gráfico
    this.doughnutChartData = { ...this.doughnutChartData };
  }
}
