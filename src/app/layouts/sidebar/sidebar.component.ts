import {Component, HostListener} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Button} from 'primeng/button';
import {NgClass, NgIf} from '@angular/common';
import {Image} from 'primeng/image';
import {AuthService} from '../../services/auth.service';
import {Card} from 'primeng/card';
import {Device} from '../../models/device';
import {DeviceService} from '../../services/device.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    Button,
    NgClass,
    Image,
    Card,
    NgIf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  reduce: boolean = false;
  connectedDevice: Device | undefined = localStorage.getItem('connectedDevice') ? JSON.parse(localStorage.getItem('connectedDevice') as string) : null;

  constructor(
    private readonly authService: AuthService,
    private readonly deviceService: DeviceService
  ) {
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.reduce = window.innerWidth <= 768;
  }

  logOut() {
    this.authService.signOut().subscribe({
      next: () => {
        // Redirige al login
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        alert('No se pudo cerrar la sesión. Intente de nuevo más tarde.');
      }
    });
  }

  connectDevice(): void {
    this.deviceService.emitConnectDevice$(true);
  }
}
