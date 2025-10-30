import { Component, OnInit } from '@angular/core';
import { Auth } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  imports: [FormsModule, TitleCasePipe, CommonModule],
  templateUrl: './weather.html',
  styleUrls: ['./weather.scss'],
})
export class WeatherComponent implements OnInit {
  weatherData: any;
  city: string = '';

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    // Intenta obtener la ubicación automáticamente
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Si el usuario no da permiso, carga por defecto Bogotá
          this.getWeatherByCity('Bogota');
        }
      );
    } else {
      this.getWeatherByCity('Bogota');
    }
  }

  getWeatherByCity(city: string): void {
    this.authService.getWeatherByCity(city).subscribe((data) => {
      this.weatherData = data;
    });
  }

  getWeatherByCoords(lat: number, lon: number): void {
    this.authService.getWeatherByCoords(lat, lon).subscribe((data) => {
      this.weatherData = data;
    });
  }
}
