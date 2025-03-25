import {Component, HostListener} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Button} from 'primeng/button';
import {NgClass, NgIf} from '@angular/common';
import {Image} from 'primeng/image';
import {AuthService} from '../../services/auth.service';
import {Card} from 'primeng/card';
import {Device} from '../../models/device';
import {DeviceService} from '../../services/device.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    Button,
    NgClass,
    Image,
    Card,
    NgIf,
    ConfirmPopupModule,
    Toast
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  reduce: boolean = false;
  connectedDevice: Device | undefined = localStorage.getItem('connectedDevice') ? JSON.parse(localStorage.getItem('connectedDevice') as string) : null;

  constructor(
    private readonly authService: AuthService,
    private readonly deviceService: DeviceService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.reduce = window.innerWidth <= 768;
  }

  logOut(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to sign out?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Exit',
        severity: 'danger'
      },
      accept: () => {
        this.authService.signOut().subscribe({
          next: () => {
            window.location.href = '/login';
          },
          error: (error) => {
            console.error('Error al cerrar sesión:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cerrar la sesión. Intente de nuevo más tarde.', life: 3000 });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'secondary', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }


  connectDevice(): void {
    this.deviceService.emitConnectDevice$(true);
  }
}
