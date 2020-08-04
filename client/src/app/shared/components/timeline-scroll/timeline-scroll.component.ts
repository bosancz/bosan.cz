import { Component, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef, HostListener, ViewChild, NgZone, Directive } from '@angular/core';
import { Subscription } from "rxjs";

export interface TimelinePoint {
  y: number;
  title: string;

  visible?: boolean;
}

export interface TimelineLabel {
  y: number;
  label: string;
}

interface DOMScrollEvent extends Event {
  target: HTMLElement;
}

@Directive({
  selector: 'timeline-scroll-label'
})
export class TimelineScrollLabelDirective {

}

@Component({
  selector: 'timeline-scroll',
  templateUrl: './timeline-scroll.component.html',
  styleUrls: ['./timeline-scroll.component.scss']
})
export class TimelineScrollComponent implements AfterViewInit, OnDestroy {

  timelineMargin = 10;

  @Input() points: TimelinePoint[] = [];
  @Input() labels: TimelineLabel[] = [];

  @Input() showPoints: boolean = true;
  @Input() showLabels: boolean = true;
  @Input() bsContainer: boolean = false;

  @Output() appeared: EventEmitter<TimelinePoint> = new EventEmitter<TimelinePoint>();
  @Output() appearedMany: EventEmitter<TimelinePoint[]> = new EventEmitter<TimelinePoint[]>();
  @Output() disappeared: EventEmitter<TimelinePoint> = new EventEmitter<TimelinePoint>();
  @Output() disappearedMany: EventEmitter<TimelinePoint[]> = new EventEmitter<TimelinePoint[]>();

  @Output() load: EventEmitter<TimelinePoint> = new EventEmitter<TimelinePoint>();

  @ViewChild('contents', { static: true }) container: ElementRef<HTMLElement>;
  @ViewChild('timeline', { static: true }) timeline: ElementRef<HTMLElement>;

  containerTop: number;
  containerLeft: number;
  containerHeight: number;
  containerWidth: number;

  containerDim: ClientRect & { scrollHeight: number };
  timelineDim = { top: 0, right: 0, bottom: 0, height: 0 };
  visibleDim = { from: 0, to: 0, mid: 0 };

  visiblePoints = [];

  resizeCheckInterval: number;

  timelineMouseMoveHandler: any;

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) {
    this.timelineMouseMoveHandler = function (event) { this.timelineMouseMove(event); }.bind(this);
  }

  ngAfterViewInit() {
    this.updateDimensions();
    this.updateVisible(0, this.containerDim.height, this.containerDim.scrollHeight);
  }

  ngOnDestroy() {
    window.clearInterval(this.resizeCheckInterval);
  }

  updateScroll(event: DOMScrollEvent): void {
    this.updateVisible(event.target.scrollTop, event.target.scrollTop + event.target.offsetHeight, event.target.scrollHeight);
  }

  updateDimensions() {

    this.containerDim = {
      ...this.container.nativeElement.getBoundingClientRect(),
      scrollHeight: this.container.nativeElement.scrollHeight
    };
    this.timelineDim = this.container.nativeElement.getBoundingClientRect();

  }

  updateVisible(from: number, to: number, total: number) {

    this.visibleDim.from = from / total;
    this.visibleDim.to = to / total;
    this.visibleDim.mid = (this.visibleDim.from + this.visibleDim.to) / 2;

    this.updateVisiblePoints();
  }

  updateVisiblePoints() {

    const count = this.points.length;

    // get the changes
    const visible = this.points.slice(Math.floor(this.visibleDim.from * count), Math.ceil(this.visibleDim.to * count));

    const disappeared = this.visiblePoints.filter(point => visible.indexOf(point) === -1);

    const appeared = visible.filter(point => !point.visible);

    // assign and call the events
    this.visiblePoints = visible;

    disappeared.forEach(point => {
      point.visible = false;
      this.disappeared.emit(point);
    });
    this.disappearedMany.emit(disappeared);

    appeared.forEach(point => {
      point.visible = true;
      this.appeared.emit(point);
      setTimeout(() => point.visible ? this.load.emit(point) : null, 500);
    });
    this.appearedMany.emit(appeared);

  }

  timelineMouseDown(event) {
    window.addEventListener("mousemove", this.timelineMouseMoveHandler);
    this.timelineMouseMove(event);
  }

  timelineMouseMove(event: MouseEvent) {

    const timelinePct = (event.clientY - this.timelineDim.top - this.timeline.nativeElement.offsetTop) / (this.timeline.nativeElement.offsetHeight)

    const containerTop = timelinePct * this.container.nativeElement.scrollHeight;

    this.container.nativeElement.scrollTo(0, containerTop);
  }

  @HostListener('window:mouseup', [])
  timelineMouseUp() {
    window.removeEventListener("mousemove", this.timelineMouseMoveHandler);
  }

}
