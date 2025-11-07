import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../auth.service';
import { CommonModule } from '@angular/common';
import { WeatherComponent } from '../weather/weather';
import { Header } from '../header/header';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, WeatherComponent, Header, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  meetings: any[] = [];
  user: any;
  message: string = '';
  tasks: any[] = [];

  constructor(private http: HttpClient, private authService: Auth) {}
  // Inicio dashboard
  ngOnInit() {
    this.loadMeetings();
    this.loadTasks();
    const userId = localStorage.getItem('_id');
    if (userId) {
      this.authService.getUserDashboard(userId).subscribe({
        next: (res) => {
          console.log('✅ Respuesta del backend:', res);
          this.user = res.user;
          this.message = res.message;
        },
        error: (err) => {
          console.error('❌ Error:', err);
        },
      });
    } else {
      console.warn('⚠️ No se encontró el ID del usuario');
    }
  }

  loadMeetings() {
    this.authService.getMeetings().subscribe({
      next: (data) => {
        this.meetings = data;
        console.log('Reuniones:', data);
      },
      error: (err) => {
        console.error('Error al obtener reuniones:', err);
      },
    });
  }
  loadTasks() {
    this.authService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        console.log('Tasks:', data);
      },
      error: (err) => {
        console.error('Error al obtener reuniones:', err);
      },
    });
  }
  toggleTask(task: any) {
    this.authService.toggleTask(task._id).subscribe(() => this.loadTasks());
  }
  deleteTask(task: any) {
    this.authService.deleteTask(task._id).subscribe(() => this.loadTasks());
  }
}
