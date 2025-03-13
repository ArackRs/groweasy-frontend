import { Component } from '@angular/core';
import {MatCard, MatCardAvatar, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {RouterLink} from "@angular/router";
import {ViewAnalysisComponent} from '../view-analysis/view-analysis.component';
import {User} from '../../model/user';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    MatCard,
    MatCardAvatar,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    RouterLink,
    ViewAnalysisComponent
  ],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css'
})
export class AnalysisComponent {

  user: User | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    const username = this.userService.getUsername();
    this.userService.getUserByUsername(username).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
        alert('No se pudo cargar el perfil. Intente de nuevo más tarde.');
      }
    });
  }

  logout(): void {
    this.authService.signOut();
  }
}
