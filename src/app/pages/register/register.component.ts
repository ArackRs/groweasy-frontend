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
import {SignUp} from '../../models/sign-up';
import {FloatLabel} from 'primeng/floatlabel';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {AuthFormComponent} from '../../layouts/auth-form/auth-form.component';
import {DropdownModule} from 'primeng/dropdown';
import {Select} from 'primeng/select';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-register',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    NgIf,
    FloatLabel,
    Button,
    InputText,
    Password,
    AuthFormComponent,
    DropdownModule,
    Select,
  ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: FormGroup;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  roles = [
    { label: 'Agricultor Experimentado', value: 'EXPERT' },
    { label: 'Aficionado', value: 'AMATEUR' }
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly router: Router
  ) {
    this.form = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.isLoading = true;

    const register: SignUp = {
      firstName: this.form.value.firstname,
      lastName: this.form.value.lastname,
      username: this.form.value.username,
      role: this.form.value.role.value,
      password: this.form.value.password
    }

    console.log('Registrando:', register);

    this.authService.signUp(register).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']).then(() => console.log('Registro exitoso, redirigiendo...'));
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        this.isSubmitting = false;
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al iniciar sesión' });
      }
    });
  }
}
