import { Component } from '@angular/core';
import { NgxPatternLockComponent } from 'ngx-pattern-lock';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NgxPatternLockComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  code: number[] = [];

  onComplete(pattern: number[]) {
    this.code = pattern;
  }
}
