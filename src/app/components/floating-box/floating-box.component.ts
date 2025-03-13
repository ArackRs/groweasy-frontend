import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DeviceService} from '../../services/device.service';
import {Sensor} from '../../model/sensor';
import {Config} from '../../model/config';
import {SensorService} from '../../services/sensor.service';

@Component({
  selector: 'app-floating-box',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './floating-box.component.html',
  styleUrl: './floating-box.component.css'
})
export class FloatingBoxComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Input() sensor!: Sensor;

  // config: Config = {} as Config;
  range = {min: 5, max: 10};
  alertThreshold: number = 8;

  constructor(
    private readonly sensorService: SensorService
  ) {}

  ngOnInit() {
    this.range = {
      min: this.sensor.config.min,
      max: this.sensor.config.max
    };
    this.alertThreshold = this.sensor.config.threshold;
    // this.loadSensorConfig();
  }

  closeModal(){
    this.close.emit();
  }

  acceptChanges(){
    if(this.alertThreshold < this.range.min || this.alertThreshold > this.range.max){
      alert("El umbral de alerta debe estar dentro del rango de temperatura")
    } else {
      this.closeModal()
    }
    this.updateSensorConfig();
    this.closeModal()
  }

  updateSensorConfig() {
    const config = {
      min: this.range.min,
      max: this.range.max,
      threshold: this.alertThreshold,
      type: this.sensor.type
    }
    this.sensorService.updateSensorConfig(1, config).subscribe({
      next: (sensor) => {
        console.log('Sensor actualizado:', sensor);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar el sensor:', error);
        alert('No se pudo actualizar el sensor. Intente de nuevo más tarde.');
      }
    });
  }
}
