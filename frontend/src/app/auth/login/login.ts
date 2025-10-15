import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: Auth) {}

  onLogin() {
    this.errorMessage = '';
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => console.log('Login correct', res),
        error: (err) => {
          console.error('Error to login', err);
          this.errorMessage = err.error?.message;
        },
      });
  }
}
