import { Component, OnInit } from '@angular/core';
import { Auth } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Header } from '../header/header';

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, CommonModule, Header],
  templateUrl: './create-tasks.html',
  styleUrls: ['./create-tasks.scss'],
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];

  task = {
    title: '',
  };
  message = '';
  type: 'success' | 'error' | 'info' = 'info';
  toastVisible = false;

  constructor(private http: HttpClient, private authService: Auth) {}

  ngOnInit() {
    this.loadTasks();
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

  addTask() {
    const token = localStorage.getItem('token');

    // ✅ AÑADIR TOKEN EN EL HEADER
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    console.log(token);
    console.log(this.task);
    this.http
      .post(
        'https://loginpage-angular.onrender.com/api/auth/create-task',
        this.task,
        {
          headers,
        }
      )
      .subscribe({
        next: (res) => {
          //this.successMessage = '';
          console.log('task guardada');
          this.loadTasks();
          this.showToast('Meeting saved successfully', 'success');
          // setTimeout(() => {
          //   this.router.navigate(['/login']);
          // }, 4000);
        },
        error: (err) => {
          console.log(err);
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

  // toggleTask(task: any) {
  //   this.taskService.toggleTask(task._id).subscribe(() => this.loadTasks());
  // }

  // deleteTask(task: any) {
  //   this.taskService.deleteTask(task._id).subscribe(() => this.loadTasks());
  // }
}
