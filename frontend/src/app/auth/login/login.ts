import { Component, OnInit } from '@angular/core';
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
  message = '';
  type: 'success' | 'error' | 'info' = 'info';
  toastVisible = false;

  constructor(private authService: Auth) {}
  // OnIniti() {
  //   this.showToast('ERROR');
  // }

  onLogin() {
    this.message = '';
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          console.log('Login correct', res);
          this.showToast('Login successfully', 'success');
        },
        error: (err) => {
          console.error('Error to login', err);
          //this.errorMessage = err.error?.message;
          this.showToast(err.status + ': ' + err.error.message, 'error');
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
