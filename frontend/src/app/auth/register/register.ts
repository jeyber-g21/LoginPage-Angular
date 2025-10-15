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
  errorMessage = '';
  successMessage = '';
  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.email || !this.name || !this.lastName || !this.password) {
      this.errorMessage = '⚠️ Todos los campos son obligatorios';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage =
        '📧 Por favor ingresa un correo válido (ejemplo@dominio.com)';
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.errorMessage =
        '🔒 La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
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
        this.successMessage = 'Usuario registrado con éxito ✅';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar usuario ❌');
      },
    });
  }
}
