import { Component } from '@angular/core';
import { PatternInputComponent } from 'ngx-pattern-lock';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ PatternInputComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  code: number[] = [];

  onComplete(patron: number[]) {
    this.code = patron;
  }
}
