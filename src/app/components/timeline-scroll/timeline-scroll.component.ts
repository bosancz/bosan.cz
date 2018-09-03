import { Component, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef, HostListener, ViewChild } from '@angular/core';

export interface TimelinePoint {
  y:number;
  title:string;

  visible?:boolean;
}

export interface TimelineLabel {
  y:number;
  label:string;
}

@Component({
  selector: 'timeline-scroll',
  templateUrl: './timeline-scroll.component.html',
  styleUrls: ['./timeline-scroll.component.scss']
})
export class TimelineScrollComponent implements AfterViewInit, OnDestroy {

  @Input() points:TimelinePoint[] = [];
  @Input() labels:TimelineLabel[] = [];
  
  @Input() showPoints:boolean = true;
  @Input() showLabels:boolean = true;

  @Output() appeared:EventEmitter<TimelinePoint> = new EventEmitter<TimelinePoint>();
  @Output() appearedMany:EventEmitter<TimelinePoint[]> = new EventEmitter<TimelinePoint[]>();
  @Output() disappeared:EventEmitter<TimelinePoint> = new EventEmitter<TimelinePoint>();
  @Output() disappearedMany:EventEmitter<TimelinePoint[]> = new EventEmitter<TimelinePoint[]>();

  @Output() load:EventEmitter<TimelinePoint> = new EventEmitter<TimelinePoint>();

  @ViewChild('container') container:ElementRef<HTMLElement>;

  containerTop:number;
  containerLeft:number;
  containerHeight:number;
  containerWidth:number;

  timelineTop:number;
  timelineHeight:number;
  timelineBottom:number;
  timelineLeft:number;

  visibleFrom:number;
  visibleTo:number;
  visibleTop:number;
  visiblePoints:TimelinePoint[] = [];

  resizeCheckInterval:number;

  timelineMouseMoveHandler:any;

  constructor(private changeDetectorRef:ChangeDetectorRef) {
    this.timelineMouseMoveHandler = function(event){this.timelineMouseMove(event)}.bind(this);
  }

  ngAfterViewInit(){
    // there is no event to check for div resize :(
    this.resizeCheckInterval = window.setInterval(() => this.updateDimensions(),500);
  }

  ngOnDestroy(){
    window.clearInterval(this.resizeCheckInterval);
  }

  @HostListener('window:scroll', [])
  updateScroll():void{
    this.updateTimeline();
    this.updateVisiblePoints();
    this.changeDetectorRef.detectChanges();
  }

  @HostListener('window:resize', [])
  updateDimensions():number{

    let el = this.container.nativeElement;

    if(el.offsetTop === this.containerTop && el.offsetLeft === this.containerLeft && el.offsetHeight === this.containerHeight && el.offsetWidth === this.containerWidth) return;

    this.containerTop = el.offsetTop;
    this.containerLeft = el.offsetLeft;
    this.containerHeight = el.offsetHeight;
    this.containerWidth = el.offsetWidth;
    
    this.updateScroll();
  }

  updateTimeline(){
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

    
    this.timelineTop = Math.max(10,this.containerTop - top);
    this.timelineBottom = Math.max(10,(top + window.innerHeight) - (this.containerTop + this.containerHeight));
    
    this.timelineHeight = window.innerHeight - this.timelineBottom - this.timelineTop;
    this.timelineLeft = this.containerLeft + this.containerWidth;

    this.visibleFrom = Math.min(1,Math.max(0,top - this.containerTop) / this.containerHeight);
    this.visibleTo = Math.min(1,Math.max(0,top - this.containerTop + window.innerHeight) / this.containerHeight);
    this.visibleTop = Math.round((this.visibleTo + this.visibleFrom) / 2 * this.timelineHeight);
  }

  updateVisiblePoints(){
    var count = this.points.length;

    // get the changes
    let visible = this.points.slice(Math.floor(this.visibleFrom * count),Math.ceil(this.visibleTo * count));

    let disappeared = this.visiblePoints.filter(point => visible.indexOf(point) === -1);

    let appeared = visible.filter(point => !point.visible);

    // assign and call the events
    this.visiblePoints = visible;

    disappeared.forEach(point => {
      point.visible = false;
      this.disappeared.emit(point);
    });
    this.disappearedMany.emit(disappeared);

    appeared.forEach(point => {
      point.visible = true
      this.appeared.emit(point);
      setTimeout(() => point.visible ? this.load.emit(point) : null,500);
    });
    this.appearedMany.emit(appeared);

  }

  timelineMouseDown(event){
    window.addEventListener("mousemove",this.timelineMouseMoveHandler);
    this.timelineMouseMove(event);
  }

  timelineMouseMove(event){    
    let top = event.clientY - this.timelineTop;
    let height = this.timelineHeight;
    let percentage = top/height;
    
    if(this.visibleFrom === 0 && percentage <= (this.visibleTo / 2)) return;
    if(this.visibleTo === 1 && percentage >= ((this.visibleFrom + 1) / 2)) return;
    
    let scroll = this.containerTop + this.containerHeight * percentage - window.innerHeight / 2;
    
    window.scrollTo({left: 0, top: scroll});
  }

  @HostListener('window:mouseup', [])
  timelineMouseUp(){
    window.removeEventListener("mousemove",this.timelineMouseMoveHandler);
  }

}
