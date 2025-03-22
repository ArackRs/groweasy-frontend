import {Component, Input} from '@angular/core';
import {Button} from "primeng/button";
import {Sensor} from '../../models/sensor';
import {ConfigureSensorComponent} from '../../components/configure-sensor/configure-sensor.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-sensor-card',
  imports: [
    Button,
    ConfigureSensorComponent,
    NgClass
  ],
  templateUrl: './sensor-card.component.html',
  styleUrl: './sensor-card.component.css'
})
export class SensorCardComponent {

  @Input() sensor!: Sensor;
  showModal: boolean = false;
  selectedSensor!: Sensor;

  toggleModal(sensor: Sensor){
    this.showModal = !this.showModal;
    this.selectedSensor = sensor;
  }
}
