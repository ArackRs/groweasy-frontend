import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SensorService} from '../../services/sensor.service';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {MessageService} from 'primeng/api';
import {Sensor} from '../../models/sensor';
import {Slider} from 'primeng/slider';

@Component({
    selector: 'app-configure-sensor',
  imports: [
    FormsModule,
    Button,
    Dialog,
    Slider,
    ReactiveFormsModule,
  ],
    templateUrl: './configure-sensor.component.html',
    styleUrl: './configure-sensor.component.css'
})
export class ConfigureSensorComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input() sensor: Sensor | null = null;

  alertThreshold: number = 8;
  isDisabled: boolean = true;
  range: { min: number, max: number } = { min: 0, max: 30 };
  formGroup!: FormGroup;

  constructor(
    private readonly sensorService: SensorService,
    private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      range: [[0, 30]],
      umbral: [15]
    })
  }

  ngOnInit(): void {
    this.updateConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      this.updateConfig();
    }
  }

  showDialog(){
    this.close.emit();

  }

  updateConfig(){
    if (this.sensor?.config) {
      this.formGroup.get('range')?.setValue([this.sensor.config.min, this.sensor.config.max]);
      this.formGroup.get('umbral')?.setValue(this.sensor.config.threshold);
    }
    console.log(this.formGroup.value);
  }

  acceptChanges(){
    this.range = this.formGroup.value.range;
    this.alertThreshold = this.formGroup.value.umbral;
    console.log(this.range, this.alertThreshold);

    this.updateSensorConfig();
    this.showDialog()
  }

  updateSensorConfig() {
    const config = {
      min: this.range.min,
      max: this.range.max,
      threshold: this.alertThreshold,
      type: this.sensor?.type
    }
    const index: number = this.sensor?.id ?? 0;
    this.sensorService.updateSensorConfig(index, config).subscribe({
      next: (sensor) => {
        this.showDialog();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Sensor actualizado correctamente' });
      },
      error: (error) => {
        console.error('Error al actualizar el sensor:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el sensor' });
      }
    });
  }

  enableButton() {
    this.isDisabled = false;
  }
}
