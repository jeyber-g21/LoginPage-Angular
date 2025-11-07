import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  email = '';
  message = '';
  error = '';
  type: 'success' | 'error' | 'info' = 'info';
  toastVisible = false;
  constructor(private authService: Auth) {}
  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.message = res.message;
        this.showToast('Email sent successfully', 'success');
      },
      error: (err) => {
        this.error = err.error.message;
        this.showToast('Email is not registered', 'error');
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
