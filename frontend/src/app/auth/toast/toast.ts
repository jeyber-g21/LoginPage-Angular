import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() duration: number = 4000; // tiempo en ms
  @Input() toastVisible: boolean = false;

  ngOnInit() {
    this.show();
  }

  show() {
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, this.duration);
  }
}
