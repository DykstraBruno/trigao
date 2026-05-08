import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent {
  @Output() addToCart = new EventEmitter<void>();
  @Output() viewMenu = new EventEmitter<void>();
}
