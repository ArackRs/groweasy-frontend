import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Device} from '../../models/device';
import {DeviceService} from '../../services/device.service';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {Checkbox} from 'primeng/checkbox';
import {ProgressSpinner} from 'primeng/progressspinner';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-connect-device',
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    Button,
    Dialog,
    Checkbox,
    ProgressSpinner,
    Toast
  ],
  templateUrl: './connect-device.component.html',
  styleUrl: './connect-device.component.css'
})
export class ConnectDeviceComponent implements OnInit {
  visible: boolean = false;
  devices: Device[] = [];
  isDisabled: boolean = true;
  isLoading: boolean = false;

  constructor(
    private readonly deviceService: DeviceService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    // const storedDevice = localStorage.getItem('connectedDevice');
    // const connectedDevice: Device | null = storedDevice ? JSON.parse(storedDevice) : null;

    // if (!connectedDevice) {
    //   this.deviceService.emitDeviceSelected$(connectedDevice)
    //   console.log('Device connected:', connectedDevice);
    // }

    this.deviceService.connectDevice$.subscribe((open) => {
      this.visible = open;
    });
  }

  loadDevices(): void {
    console.log('Cargando dispositivos...');
    this.isLoading = true;
    this.deviceService.getAll().subscribe({
      next: (devices: Device[]): void => {
        this.devices = devices.map(device => ({ ...device, selected: false }));
        this.isLoading = false;
        if (this.devices.length === 0) {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No se encontraron dispositivos' });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Dispositivos cargados correctamente: ${this.devices.length}` });
        }
      },
      error: (error) => {
        console.error('Error al obtener los dispositivos:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los dispositivos' });
      }
    });
  }

  connectDevice(): void{
    const selectedDevice: Device | undefined = this.devices.find(
      (device: Device): boolean => device.selected === true
    );

    if (selectedDevice) {
      this.deviceService.connect(selectedDevice.id).subscribe({
        next: () => {
          const deviceModel: Device = {
            id: selectedDevice.id,
            macAddress: selectedDevice.macAddress,
            status: selectedDevice.status,
            location: selectedDevice.location,
            sensors: selectedDevice.sensors
          }
          this.deviceService.emitDeviceSelected$(deviceModel);
          localStorage.setItem('connectedDevice', JSON.stringify(deviceModel));
          this.visible = false;
        },
        error: (error) => {
          console.error('Error al conectar el dispositivo:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo conectar el dispositivo' });
        }
      });
    }
  }

  updateDisabledState(): void {
    this.isDisabled = !this.devices.some((device: Device): boolean => device.selected === true);
  }
}
