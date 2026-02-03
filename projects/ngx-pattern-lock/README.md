# ngx-pattern-lock 

A lightweight, fully responsive, and customizable Android-style pattern lock component for Angular. Built with SVG for crisp rendering on any device, with zero external dependencies.

### [Click here to try the Live Demo!](https://nicotole.github.io/ngx-pattern-lock/)
> *Note: It supports both mouse and touch interactions seamlessly.*

## Features 

*  **Lightweight:** Zero external dependencies.
*  **Mobile Ready:** Full touch support with no "ghost drag" effects.
*  **SVG Based:** Sharp rendering on retina/high-DPI screens.
*  **High Performance:** Smooth animations and interactions.
*  **Fully Customizable:** Easily change colors and sizes via CSS variables.
*  **Standalone Ready:** Compatible with modern Angular (17+) standalone components.

## Installation 

Run the following command in your project:

```bash
npm install ngx-pattern-lock
```
## Usage 

### 1. Import the Component
Import `NgxPatternLockComponent` in your standalone component (or Module).

```typescript
import { Component } from '@angular/core';
import { NgxPatternLockComponent } from 'ngx-pattern-lock'; // <--- Import the correct class name

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NgxPatternLockComponent ], // <--- Add to imports array
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // The library emits the pattern as an array of numbers (IDs 1-9)
  onPatternComplete(pattern: number[]) {
    console.log('Pattern captured:', pattern);
    // Example output: [1, 2, 5, 9]
    
    if (this.isPatternCorrect(pattern)) {
      console.log('Unlocked! 🎉');
    } else {
      console.log('Wrong pattern ❌');
    }
  }
  
  // Example validation logic
  isPatternCorrect(pattern: number[]): boolean {
    const correctPattern = [1, 2, 3, 6, 9]; // Your secret password
    return JSON.stringify(pattern) === JSON.stringify(correctPattern);
  }
}
```
### 2. Use in Template

```html
  <ngx-pattern-lock 
    label="Draw your pattern"
    refreshButtonLabel="Reset" 
    (patternChange)="onPatternComplete($event)">
  </ngx-pattern-lock>

```

## API 

| Name | Type | Description |
| :--- | :--- | :--- |
| **`@Input() label`** | `string` | Optional text displayed above the pattern grid (e.g., "Draw pattern"). |
| **`@Input() refreshButtonLabel`** | `string` | Text for the reset button. If provided, the button will appear below the grid. |
| **`@Output() patternChange`** | `EventEmitter<number[]>` | Emits an array of selected point IDs (e.g., `[1, 2]`) when the user completes a pattern. |
| **`@Output() patternCleared`** | `EventEmitter<void>` | Emits an event when the pattern is reset or the refresh button is clicked. |

### Methods
| Name | Description |
| :--- | :--- |
| **`clear()`** | Resets the pattern programmatically (e.g., after an invalid attempt). Access it via `@ViewChild`. |

## Styling & Customization 
The component is designed to be styled easily using CSS Variables. You can define these in your global styles (styles.scss) or within the parent component.

``` css 
/* Example Customization */
ngx-pattern-lock {
  /* --- MAIN COLORS --- */
  --pattern-color: #3b82f6;      /* Lines & Active dots (Default: Blue) */
  --pattern-bg: #ffffff;         /* Card background (Default: White) */
  --pattern-inactive: #cbd5e1;   /* Inactive dots (Default: Gray) */

  /* --- DIMENSIONS --- */
  --pattern-size: 300px;           /*  Max width. Set to 100% to let parent control size. */
  --pattern-border: 1px solid #e2e8f0;) */
  --pattern-border: 1px solid #e2e8f0;
  --pattern-radius: 16px;

  /* --- REFRESH BUTTON --- */
  --pattern-btn-color: #64748b;    /* Default text color (Default: Slate Gray) */
  --pattern-error: #ef4444;        /* Hover text color (Default: Red) */
  --pattern-error-bg: #fee2e2;     /* Hover background color (Default: Light Red) */
}
```

## Compatibility 
* **Angular:** v17+ (Ivy compatible / Standalone)
* **Browsers:** Chrome, Firefox, Safari, Edge, Mobile Browsers (iOS & Android).

---
### License 

MIT © Nicolas Toledo

Made with ❤️ 

 [![GitHub](https://img.shields.io/badge/GitHub-Nicolas%20Toledo-181717?style=for-the-badge&logo=github)](https://github.com/nicotole) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/nicolastoledodev)