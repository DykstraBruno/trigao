import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <i
      [class]="getIconClass()"
      [style.fontSize.px]="size"
      [style.color]="color">
    </i>
  `,
  styles: [`
    i {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      vertical-align: middle;
    }
  `]
})
export class IconComponent {
  @Input() name: string = 'question';
  @Input() weight: 'regular' | 'bold' | 'light' | 'fill' = 'regular';
  @Input() size: number = 24;
  @Input() color?: string;

  getIconClass(): string {
    const prefix = this.weight === 'regular' ? 'ph' : `ph-${this.weight}`;
    return `${prefix} ph-${this.name}`;
  }
}