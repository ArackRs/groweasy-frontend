import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatOption, MatSelect} from '@angular/material/select';
import {AuthService} from '../../services/auth.service';
import {SignUp} from '../../model/sign-up';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    NgIf,
    MatSnackBarModule,
    MatSelect,
    MatOption,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  hide = true;
  form: FormGroup;
  register: SignUp | null = null;
  isEmailValid = true;

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {

    this.form = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      // Crear el objeto register con los valores del formulario
      this.register = {
        firstName: this.form.get('firstname')?.value,
        lastName: this.form.get('lastname')?.value,
        username: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
        role: this.form.get('role')?.value
      };

      console.log('Registro:', this.register);
      this.authService.signUp(this.register).subscribe({
        next: () => {
          this.router.navigate(['/home'])
            .then(r => console.log('Redirection a /home:', r));
        },
        error: (error) => {
          console.error('Error en el registro:', error);
          alert('Error en el registro. Por favor, intente de nuevo.');
        }
      });
    } else {
      console.error('Formulario no válido');
    }
  }

  public checkEmailValidity(): void {
    const emailControl = this.form.get('username');
    this.isEmailValid = emailControl ? emailControl.valid : false;
  }
}
