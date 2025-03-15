import {Component, HostListener, ViewChild} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Button} from 'primeng/button';
import {NgClass} from '@angular/common';
import {Image} from 'primeng/image';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    Button,
    NgClass,
    Image
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  reduce: boolean = false;

  constructor(
    private readonly authService: AuthService
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
}
