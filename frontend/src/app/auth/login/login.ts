import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../auth.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

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

  constructor(private authService: Auth, private router: Router) {}
  // OnIniti() {
  //   this.showToast('ERROR');
  // }

  onLogin() {
    this.message = '';
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          // console.log('Login correct', res);
          // console.log('Token actual:', localStorage.getItem('token'));

          const userId = localStorage.getItem('_id');
          if (userId) {
            this.showToast('Login successfully', 'success');
            setTimeout(() => {
              this.router.navigate([`/dashboard/${userId}`]);
            }, 4000);
          } else {
            console.error('No se encontró el userId en localStorage');
          }
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
