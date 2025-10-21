import { Component } from '@angular/core';
import { Auth } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  email = '';
  name = '';
  lastName = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  message = '';
  type: 'success' | 'error' | 'info' = 'info';
  toastVisible = false;
  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    if (
      !this.email ||
      !this.name ||
      !this.lastName ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.showToast('⚠️ Todos los campos son obligatorios', 'error');
      console.log(this.confirmPassword);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showToast(
        '📧 Por favor ingresa un correo válido (ejemplo@dominio.com)',
        'error'
      );

      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.showToast(
        '🔒 La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
        'error'
      );
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.showToast('🔒 Password must match', 'error');
      return;
    }
    const user = {
      email: this.email,
      name: this.name,
      lastName: this.lastName,
      password: this.password,
    };

    this.authService.register(user).subscribe({
      next: (res) => {
        this.successMessage = '';
        this.showToast('Usuario registrado con éxito ✅', 'success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000);
      },
      error: (err) => {
        this.showToast(err.error.message, 'error');
      },
    });
  }
  showToast(msg: string, type: 'success' | 'error' | 'info') {
    this.message = msg;
    this.type = type;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 4000);
  }
}
