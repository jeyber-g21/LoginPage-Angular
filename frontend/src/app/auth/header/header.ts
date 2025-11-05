import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  menuOpen = false;
  isScrolled = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  goToDashboard() {
    const userId = localStorage.getItem('_id');
    console.log(userId);
    if (userId) {
      this.router.navigate(['/dashboard', userId]);
    } else {
      alert('No se encontró el usuario, por favor inicia sesión.');
    }
  }
  logout() {
    // Elimina datos del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    localStorage.removeItem('user');

    // También puedes limpiar todo si prefieres
    // localStorage.clear();

    // Redirige al login
    this.router.navigate(['/home']);
  }

  @HostListener('window:scroll')
  onScroll() {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 10) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }
}
