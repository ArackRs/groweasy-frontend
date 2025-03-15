import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {SignIn} from '../../models/sign-in';
import {AuthService} from '../../services/auth.service';
import {FloatLabel} from 'primeng/floatlabel';
import {NgIf} from '@angular/common';
import {Password} from 'primeng/password';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {AuthFormComponent} from '../../layouts/auth-form/auth-form.component';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FloatLabel,
    FormsModule,
    NgIf,
    Password,
    InputText,
    Button,
    AuthFormComponent,
  ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    this.hidePasswordOverlay();
    this.isLoading = true;
    if (this.form.valid) {
      const credentials: SignIn = {
        username: this.form.value.username,
        password: this.form.value.password
      };

      this.authService.signIn(credentials).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']).then(r => console.log('Redirection a /home:', r));
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al iniciar sesión' });
        }
      });
    } else {
      console.error('Formulario no válido');
    }
  }

  hidePasswordOverlay() {
    const passwordOverlay = document.querySelector('.p-password-overlay') as HTMLElement;
    if (passwordOverlay) {
      passwordOverlay.style.display = 'none';
    }
  }
}

