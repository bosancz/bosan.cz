import { Component, AfterViewInit, OnDestroy, Input, ElementRef, HostListener, Directive, QueryList, ContentChildren } from '@angular/core';

interface DOMScrollEvent extends Event {
  target: HTMLElement;
}

@Component({
  selector: 'timeline-scroll-label',
  template: '',
  styles: [':host { display: block; height: 0; }']
})
export class TimelineScrollLabelComponent {

  @Input()
  for: TimelineScrollComponent

  @Input() label: string;
  @Input() align: "left" | "center" | "right";

  top: number;

  constructor(
    private el: ElementRef<HTMLElement>
  ) { }

  ngOnInit() {
    this.for.addLabel(this);
  }

  ngAfterViewInit() {
    this.updateTop(this.for.scrollElement);
  }

  updateTop(scrollElement: HTMLElement) {
    const scrollRect = scrollElement.getBoundingClientRect();
    const scrollOffset = scrollElement === document.documentElement ? 0 : scrollElement.scrollTop;
    this.top = this.el.nativeElement.getBoundingClientRect().top - scrollRect.top + scrollOffset;
  }

  ngOnDestroy() {
    this.for.removeLabel(this);
  }
}

@Component({
  selector: 'timeline-scroll',
  templateUrl: './timeline-scroll.component.html',
  styleUrls: ['./timeline-scroll.component.scss'],
  host: {
    "(mousedown)": "timelineMouseDown($event)",
    "(touchstart)": "timelineMouseDown($event)"
  },
  exportAs: "timelineScroll"
})
export class TimelineScrollComponent implements AfterViewInit, OnDestroy {

  timelineMargin = 10;

  @Input()
  scrollTarget: HTMLElement;

  @Input() showLabels: boolean = true;
  @Input() showPoints: boolean = true;

  labels: TimelineScrollLabelComponent[] = [];

  containerDim: { top: number, height: number, scrollHeight: number };
  containerWidth: number;
  timelineDim: { top: number, height: number };
  visibleDim = { from: 0, to: 0, mid: 0 };

  resizeCheckInterval: number;

  timelineMouseMoveHandler: (event: TouchEvent | MouseEvent) => void;


  constructor(
    private timeline: ElementRef
  ) {
    this.timelineMouseMoveHandler = function (event: TouchEvent | MouseEvent) {
      window.requestAnimationFrame(() => this.timelineMouseMove(event));
    }.bind(this);
  }

  ngAfterViewInit() {

    if (this.scrollTarget) this.scrollTarget.addEventListener("scroll", () => this.updateDimensions());
    else window.addEventListener("scroll", () => this.updateDimensions());

    this.resizeCheckInterval = window.setInterval(() => this.updateDimensions(), 500);

    this.updateDimensions();
  }

  ngOnDestroy() {
    window.clearInterval(this.resizeCheckInterval);
  }

  updateScroll(event: DOMScrollEvent): void {
    this.updateDimensions();
  }

  get scrollElement(): HTMLElement {
    return this.scrollTarget || document.documentElement;
  }

  updateDimensions() {

    const scrollElement = this.scrollElement;
    const rect = scrollElement.getBoundingClientRect();

    const layoutChanged = !this.containerDim
      || this.containerWidth !== rect.width
      || this.containerDim.scrollHeight !== scrollElement.scrollHeight;

    this.containerWidth = rect.width;

    this.containerDim = {
      height: rect.height,
      top: rect.top,
      scrollHeight: scrollElement.scrollHeight
    };

    if (layoutChanged) this.labels.forEach(label => label.updateTop(scrollElement));

    this.timelineDim = this.timeline.nativeElement.getBoundingClientRect();

    this.visibleDim = {
      from: (-1) * this.containerDim.top / this.containerDim.scrollHeight,
      to: ((-1) * this.containerDim.top + this.containerDim.height) / this.containerDim.scrollHeight,
      mid: ((-1) * this.containerDim.top + ((-1) * this.containerDim.top + this.containerDim.height)) / 2 / this.containerDim.scrollHeight
    }

  }

  timelineMouseDown(event: TouchEvent | MouseEvent) {
    this.updateDimensions();
    window.addEventListener("touchmove", this.timelineMouseMoveHandler, { passive: false });
    window.addEventListener("mousemove", this.timelineMouseMoveHandler);
    this.timelineMouseMove(event);
  }

  timelineMouseMove(event: MouseEvent | TouchEvent) {

    event.preventDefault();

    const pointerY = event instanceof MouseEvent ? event.clientY : event.touches[0]?.clientY;

    if (pointerY === undefined) return;

    const timelinePct = (pointerY - this.timelineDim.top) / (this.timelineDim.height);

    const containerTop = timelinePct * this.containerDim.scrollHeight - this.containerDim.height / 2;

    if (this.scrollTarget) this.scrollTarget.scrollTo(0, containerTop);
    else window.scrollTo(0, containerTop);
  }

  @HostListener('window:mouseup', [])
  @HostListener('window:touchend', [])
  @HostListener('window:touchcancel', [])
  timelineMouseUp() {
    window.removeEventListener("mousemove", this.timelineMouseMoveHandler);
    window.removeEventListener("touchmove", this.timelineMouseMoveHandler);
  }

  addLabel(label: TimelineScrollLabelComponent) {
    this.labels.push(label);
  }

  removeLabel(label: TimelineScrollLabelComponent) {
    this.labels.splice(this.labels.indexOf(label), 1);
  }

}
