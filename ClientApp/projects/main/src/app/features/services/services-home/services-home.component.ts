import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services-home.component.html'
})
export class ServicesHomeComponent {}
