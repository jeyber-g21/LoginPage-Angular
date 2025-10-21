import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../auth.service';
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  userData: any;

  constructor(private http: HttpClient, private authService: Auth) {}

  ngOnInit() {
    const userId = localStorage.getItem('_id');
    if (userId) {
      this.authService.getUserDashboard(userId).subscribe({
        next: (res) => {
          console.log('✅ Respuesta del backend:', res);
          this.userData = res;
        },
        error: (err) => {
          console.error('❌ Error:', err);
        },
      });
    } else {
      console.warn('⚠️ No se encontró el ID del usuario');
    }
  }
}
