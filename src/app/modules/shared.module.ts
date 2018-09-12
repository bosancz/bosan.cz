import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
 
import { SafeurlPipe } from "../pipes/safeurl.pipe";
import { GroupPipe } from "../pipes/group.pipe";
import { Nl2brPipe } from '../pipes/nl2br.pipe';
import { DateRangePipe } from '../pipes/date-range.pipe';

import { BreadCrumbsComponent } from '../components/bread-crumbs/bread-crumbs.component';
import { PhotoGalleryComponent } from '../components/photo-gallery/photo-gallery.component';

import { ContenteditableDirective } from '../directives/contenteditable.directive';

/* THIRD PARTY */
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    BreadCrumbsComponent,
    PhotoGalleryComponent,
    SafeurlPipe, GroupPipe, Nl2brPipe, DateRangePipe, 
    ContenteditableDirective
  ],
  exports: [
    /* MODULES */ CommonModule, FormsModule, HttpClientModule,
    CollapseModule, ModalModule, TypeaheadModule, TooltipModule,
    
    /* COMPONENTS */ BreadCrumbsComponent, PhotoGalleryComponent,
    
    /* DIRECTIVES */ ContenteditableDirective,
    
    /* PIPES */ SafeurlPipe, GroupPipe, Nl2brPipe, DateRangePipe
  ]
  
})
export class SharedModule { }
