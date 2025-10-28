import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  register(data: {
    email: string;
    name: string;
    lastName: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        console.log('Token recibido del backend:', res.token);
        localStorage.setItem('token', res.token);
        localStorage.setItem('_id', res._id);
      })
    );
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserDashboard(userId: string): Observable<any> {
    const token = localStorage.getItem('token');

    // 🔐 Verificamos que el token exista
    if (!token) {
      throw new Error('No se encontró el token en el localStorage');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    console.log('📤 Enviando petición con header:', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/dashboard/${userId}`, { headers });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      password,
    });
  }
  getMeetings(): Observable<any> {
    const token = localStorage.getItem('token'); // <-- Obtener el token del usuario

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // <-- Enviar token al backend
    });

    // Llamada protegida con token + credenciales
    return this.http.get(`${this.apiUrl}/meetings`, {
      headers,
      withCredentials: true,
    });
  }

  getTasks(): Observable<any> {
    const token = localStorage.getItem('token'); // <-- Obtener el token del usuario

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // <-- Enviar token al backend
    });

    // Llamada protegida con token + credenciales
    return this.http.get(`${this.apiUrl}/tasks`, {
      headers,
      withCredentials: true,
    });
  }

  toggleTask(id: string): Observable<any> {
    const token = localStorage.getItem('token'); // <-- Obtener el token del usuario

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // <-- Enviar token al backend
    });
    return this.http.put(
      `${this.apiUrl}/${id}`,
      {},
      {
        headers,
      }
    );
  }
  deleteTask(id: string): Observable<any> {
    const token = localStorage.getItem('token'); // <-- Obtener el token del usuario

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // <-- Enviar token al backend
    });
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers,
    });
  }

  // addTask(title: string): Observable<any> {
  //   const token = localStorage.getItem('token');

  //   // ✅ AÑADIR TOKEN EN EL HEADER
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.post(`${this.apiUrl}/create-task`, title, {
  //     headers,
  //     withCredentials: true,
  //   });
  // }
}
