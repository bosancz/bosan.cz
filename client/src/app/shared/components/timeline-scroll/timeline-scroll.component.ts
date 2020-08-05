import { Component, AfterViewInit, OnDestroy, Input, ElementRef, HostListener, Directive, QueryList, ContentChildren } from '@angular/core';

interface DOMScrollEvent extends Event {
  target: HTMLElement;
}

@Component({
  selector: 'timeline-scroll-label',
  template: ''
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
    this.top = this.el.nativeElement.offsetTop;
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
    "(mousedown)": "timelineMouseDown($event)"
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
  timelineDim: { top: number, height: number };
  visibleDim = { from: 0, to: 0, mid: 0 };

  resizeCheckInterval: number;

  timelineMouseMoveHandler: any;


  constructor(
    private timeline: ElementRef
  ) {
    this.timelineMouseMoveHandler = function (event) { this.timelineMouseMove(event); }.bind(this);
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

  updateDimensions() {

    const scrollElement = this.scrollTarget || document.documentElement;
    const rect = scrollElement.getBoundingClientRect();

    this.containerDim = {
      height: rect.height,
      top: rect.top,
      scrollHeight: scrollElement.scrollHeight
    };

    this.timelineDim = this.timeline.nativeElement.getBoundingClientRect();

    this.visibleDim = {
      from: (-1) * this.containerDim.top / this.containerDim.scrollHeight,
      to: ((-1) * this.containerDim.top + this.containerDim.height) / this.containerDim.scrollHeight,
      mid: ((-1) * this.containerDim.top + ((-1) * this.containerDim.top + this.containerDim.height)) / 2 / this.containerDim.scrollHeight
    }

  }

  timelineMouseDown(event) {
    window.addEventListener("mousemove", this.timelineMouseMoveHandler);
    this.timelineMouseMove(event);
  }

  timelineMouseMove(event: MouseEvent) {

    const timelinePct = (event.clientY - this.timelineDim.top) / (this.timelineDim.height);

    const containerTop = timelinePct * this.containerDim.scrollHeight - this.containerDim.height / 2;

    if (this.scrollTarget) this.scrollTarget.scrollTo(0, containerTop);
    else window.scrollTo(0, containerTop);
  }

  @HostListener('window:mouseup', [])
  timelineMouseUp() {
    window.removeEventListener("mousemove", this.timelineMouseMoveHandler);
  }

  addLabel(label: TimelineScrollLabelComponent) {
    this.labels.push(label);
  }

  removeLabel(label: TimelineScrollLabelComponent) {
    this.labels.splice(this.labels.indexOf(label), 1);
  }

}
