import { Component, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef, HostListener, ViewChild, NgZone } from '@angular/core';
import { Subscription } from "rxjs";

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

  timelineMargin = 10;

  @Input() points:TimelinePoint[] = [];
  @Input() labels:TimelineLabel[] = [];

  @Input() showPoints:boolean = true;
  @Input() showLabels:boolean = true;
  @Input() bsContainer:boolean = false;

  @Output() appeared:EventEmitter<TimelinePoint> = new EventEmitter<TimelinePoint>();
  @Output() appearedMany:EventEmitter<TimelinePoint[]> = new EventEmitter<TimelinePoint[]>();
  @Output() disappeared:EventEmitter<TimelinePoint> = new EventEmitter<TimelinePoint>();
  @Output() disappearedMany:EventEmitter<TimelinePoint[]> = new EventEmitter<TimelinePoint[]>();

  @Output() load:EventEmitter<TimelinePoint> = new EventEmitter<TimelinePoint>();

  @ViewChild('contents', { static: true }) container:ElementRef<HTMLElement>;

  containerTop:number;
  containerLeft:number;
  containerHeight:number;
  containerWidth:number;

  containerDim:ClientRect;
  timelineDim = {top:0,right:0,bottom:0,height:0, visible: {top:0,bottom:0,mid:0} };
  visibleDim = {from:0,to:0};

  visiblePoints = [];

  resizeCheckInterval:number;

  timelineMouseMoveHandler:any;

  constructor(private cdRef:ChangeDetectorRef,private ngZone:NgZone) {
    this.timelineMouseMoveHandler = function(event){this.timelineMouseMove(event);}.bind(this);
  }

  ngAfterViewInit(){

    this.ngZone.runOutsideAngular(() => { // setInterval in NgZone blocks loading of Service Worker
      
      // update dimensions right after init, needs to trigger manual changeDetection round
      this.updateDimensions();
      this.cdRef.detectChanges();
      
      // there is no event to check for div resize, we have to poll :(
      this.resizeCheckInterval = window.setInterval(() => {
        this.ngZone.run(() => this.updateDimensions());
      },500);
    });
    
  }

  ngOnDestroy(){
    window.clearInterval(this.resizeCheckInterval);
  }

  @HostListener('window:scroll', [])
  updateScroll():void{
    this.updateVisible();
    this.cdRef.detectChanges();
  }

  @HostListener('window:resize', [])
  updateDimensions(){

    const doc = document.documentElement;
    const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

    this.containerDim = this.container.nativeElement.getBoundingClientRect();

    this.timelineDim.top = this.containerDim.top + top + this.timelineMargin;
    this.timelineDim.right = this.containerDim.right - this.containerDim.width;
    this.timelineDim.bottom = this.timelineMargin;
    this.timelineDim.height = window.innerHeight - this.timelineDim.top - this.timelineDim.bottom;

    this.updateScroll();
  }

  updateVisible(){

    const doc = document.documentElement;
    const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

    this.visibleDim.from = top / doc.offsetHeight;
    this.visibleDim.to = (top + window.innerHeight) / doc.offsetHeight;

    this.timelineDim.visible.top = this.timelineDim.height * this.visibleDim.from;
    this.timelineDim.visible.bottom = this.timelineDim.height * (1 - this.visibleDim.to);
    this.timelineDim.visible.mid = this.timelineDim.height * (this.visibleDim.from + this.visibleDim.to) / 2;

    this.updateVisiblePoints();
  }

  updateVisiblePoints(){

    const count = this.points.length;

    // get the changes
    const visible = this.points.slice(Math.floor(this.visibleDim.from * count),Math.ceil(this.visibleDim.to * count));    
    
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
      setTimeout(() => point.visible ? this.load.emit(point) : null,500);
    });
    this.appearedMany.emit(appeared);

  }

  timelineMouseDown(event){
    window.addEventListener("mousemove",this.timelineMouseMoveHandler);
    this.timelineMouseMove(event);
  }

  timelineMouseMove(event){  
    
    let top = event.clientY - this.timelineDim.top;
    let height = this.timelineDim.height;
    let percentage = Math.min(1,top/height);

    window.scrollTo(0,document.documentElement.offsetHeight * percentage - window.innerHeight / 2);
  }

  @HostListener('window:mouseup', [])
  timelineMouseUp(){
    window.removeEventListener("mousemove",this.timelineMouseMoveHandler);
  }

}
