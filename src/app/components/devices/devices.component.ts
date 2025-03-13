import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Device} from '../../model/device';
import {Sensor} from '../../model/sensor';
import {UserService} from '../../services/user.service';
import {DeviceService} from '../../services/device.service';

interface SelectableDevice extends Device {
  selected?: boolean;
}

@Component({
    selector: 'app-devices',
    imports: [
        FormsModule,
        NgIf,
        NgForOf
    ],
    templateUrl: './devices.component.html',
    styleUrl: './devices.component.css'
})
export class DevicesComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() deviceSelected = new EventEmitter<Device>();
  devices: SelectableDevice[] = [];

  constructor(
    private readonly deviceService: DeviceService,
  ) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(){
    this.deviceService.getAll().subscribe({
      next: (devices) => {
        console.log('Dispositivos:', devices);
        this.devices = devices.map(device => ({ ...device, selected: false }));
      },
      error: (error) => {
        console.error('Error al obtener los dispositivos:', error);
        alert('No se pudieron cargar los dispositivos. Intente de nuevo más tarde.');
      }
    });
  }

  closeModal(){
    this.close.emit();
  }

  acceptChanges(){
    // Filtramos los dispositivos que fueron seleccionados
    const selectedDevice = this.devices.find(device => device.selected);

    if (!selectedDevice) {
      alert('No se ha seleccionado ningún dispositivo.');
      return;
    }

    this.deviceService.connect(selectedDevice.id).subscribe({
      next: () => {
        console.log('Dispositivo creado');
      },
      error: (error) => {
        console.error('Error al crear el dispositivo:', error);
      }
    });

    if (selectedDevice) {
      // Emitimos el dispositivo seleccionado al componente padre
      this.deviceSelected.emit(selectedDevice);
      this.closeModal();
    } else {
      alert('Seleccione un dispositivo antes de conectar.');
    }
  }
}
