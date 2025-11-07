import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../auth.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Header } from '../header/header';

@Component({
  selector: 'app-meeting',
  imports: [FormsModule, CommonModule, Header],
  templateUrl: './meeting.html',
  styleUrl: './meeting.scss',
})
export class Meeting {
  meetings: any[] = [];
  meeting = {
    description: '',
    platform: '',
    date: '',
    time: '',
  };
  message = '';
  type: 'success' | 'error' | 'info' = 'info';
  toastVisible = false;

  constructor(private http: HttpClient, private authService: Auth) {}

  ngOnInit() {
    this.loadMeetings();
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
  addMeeting() {
    const token = localStorage.getItem('token');

    // ✅ AÑADIR TOKEN EN EL HEADER
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    console.log(token);
    console.log(this.meeting);
    this.http
      .post('http://localhost:4000/api/auth/meeting', this.meeting, {
        headers,
      })
      .subscribe({
        next: (res) => {
          //this.successMessage = '';
          console.log('meeting guardada');
          this.loadMeetings();
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
}

// addMeeting() {
//   console.log(this.meeting);
//   this.http
//     .post(, this.meeting, {
//       withCredentials: true,
//     })
//     .subscribe(() => {
//       this.loadMeetings();
//       this.meeting = { description: '', platform: '', date: '', time: '' };
//     });
// }
