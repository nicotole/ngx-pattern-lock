import { Component, Input, Output, ViewChild, EventEmitter, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NgZone } from '@angular/core';

@Component({
  selector: 'ngx-pattern-lock',
  templateUrl: './NgxPatternLockComponent.html',
  styleUrls: ['./NgxPatternLockComponent.scss'],
  standalone: true,
  imports: []
})
export class NgxPatternLockComponent implements AfterViewInit, OnDestroy {
  @Input() label?: string = '';
  @Input() refreshButtonLabel?: string = ''
  @Output() patternChange = new EventEmitter<number[]>();
  @Output() patternCleared = new EventEmitter<void>();
  @ViewChild('svgElement') svgElement!: ElementRef<SVGElement>;
  

  points = [
    { id: 1, x: 20, y: 20 }, { id: 2, x: 50, y: 20 }, { id: 3, x: 80, y: 20 },
    { id: 4, x: 20, y: 50 }, { id: 5, x: 50, y: 50 }, { id: 6, x: 80, y: 50 },
    { id: 7, x: 20, y: 80 }, { id: 8, x: 50, y: 80 }, { id: 9, x: 80, y: 80 }
  ];

  selectedPoints: number[] = []; 
  currentLine: { x1: number, y1: number, x2: number, y2: number } | null = null;
  isDrawing = false;
  
  detectedRadio = 15; 
  initRadio = 20;

  private startHandler: any;
  private moveHandler: any;
  private endHandler: any;

  constructor(private ngZone: NgZone) {}
  
  ngAfterViewInit() {
    const el = this.svgElement.nativeElement;
    this.startHandler = (e: any) => this.onStart(e);
    this.moveHandler = (e: any) => this.onMove(e);
    this.endHandler = () => this.onEnd();

    el.addEventListener('touchstart', this.startHandler, { passive: true });
    el.addEventListener('mousedown', this.startHandler);
  }

  ngOnDestroy() {
    const el = this.svgElement.nativeElement;
    if (el) {
      el.removeEventListener('touchstart', this.startHandler);
      el.removeEventListener('mousedown', this.startHandler);
    }
    this.removeGlobalListeners();
  }

  // --- Unified Logic ---
 
  private onStart(event: TouchEvent | MouseEvent) {
    if (this.isDrawing) return;

    if (event.type !== 'touchstart' && event.cancelable) {
      event.preventDefault();
    }
    
    const { x, y } = this.getSvgCoordinates(event);
    const hitPoint = this.checkCollision(x, y);

    if (hitPoint) {
      this.isDrawing = true;
      this.addPoint(hitPoint.id);
      this.addGlobalListeners();
    }
  }

  private onMove(event: TouchEvent | MouseEvent) {
    if (!this.isDrawing) return;
    if (event.cancelable) event.preventDefault();

    const { x, y } = this.getSvgCoordinates(event);

    const lastPoint = this.points.find(p => p.id === this.selectedPoints[this.selectedPoints.length - 1]);
    if (lastPoint) {
      this.currentLine = { x1: lastPoint.x, y1: lastPoint.y, x2: x, y2: y };
    }

    const hitPoint = this.checkCollision(x, y);
    if (hitPoint) {
      this.addPoint(hitPoint.id);
    }
  }

  private onEnd() {
    if (!this.isDrawing) return;
    
    this.isDrawing = false;
    this.currentLine = null;
    this.emitPattern();
    
    this.removeGlobalListeners();
  }

  // --- HELPERS ---

  private addGlobalListeners() {
    window.addEventListener('touchmove', this.moveHandler, { passive: false });
    window.addEventListener('mousemove', this.moveHandler);
    window.addEventListener('touchend', this.endHandler);
    window.addEventListener('mouseup', this.endHandler);
  }

  private removeGlobalListeners() {
    window.removeEventListener('touchmove', this.moveHandler);
    window.removeEventListener('mousemove', this.moveHandler);
    window.removeEventListener('touchend', this.endHandler);
    window.removeEventListener('mouseup', this.endHandler);
  }

  private getSvgCoordinates(event: TouchEvent | MouseEvent) {
    const svgRect = this.svgElement.nativeElement.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in event && (event as TouchEvent).touches.length > 0) {
      clientX = (event as TouchEvent).touches[0].clientX;
      clientY = (event as TouchEvent).touches[0].clientY;
    } else {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
    }

    return {
      x: ((clientX - svgRect.left) / svgRect.width) * 100,
      y: ((clientY - svgRect.top) / svgRect.height) * 100
    };
  }

  private checkCollision(x: number, y: number) {
    return this.points.find(p => {
      const distance = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
      return distance < this.detectedRadio;
    });
  }

  private addPoint(id: number) {
    if (!this.selectedPoints.includes(id)) {
      this.selectedPoints.push(id);
    }
  }

  private emitPattern() {
    const patternToSend = [...this.selectedPoints];
    this.ngZone.run(() => {
      this.patternChange.emit(patternToSend);
    });
  }

  clear() {
    this.selectedPoints = [];
    this.currentLine = null;
    this.isDrawing = false;    
    this.patternChange.emit([]); 
    this.patternCleared.emit(); 
  }

  get connectedLines() {
    const lines: { x1: number, y1: number, x2: number, y2: number }[] = [];
    for (let i = 0; i < this.selectedPoints.length - 1; i++) {
      const p1 = this.points.find(p => p.id === this.selectedPoints[i]);
      const p2 = this.points.find(p => p.id === this.selectedPoints[i+1]);
      if (p1 && p2) lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    }
    return lines;
  }
}