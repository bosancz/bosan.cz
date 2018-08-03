import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
 
import { SafeurlPipe } from "../pipes/safeurl.pipe";
import { GroupPipe } from "../pipes/group.pipe";

import { BreadCrumbsComponent } from '../components/bread-crumbs/bread-crumbs.component';
import { PhotoGalleryComponent } from '../components/photo-gallery/photo-gallery.component';

import { ContenteditableDirective } from '../directives/contenteditable.directive';


/* THIRD PARTY */
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot()
  ],
  declarations: [
    BreadCrumbsComponent,
    PhotoGalleryComponent,
    SafeurlPipe, GroupPipe,
    ContenteditableDirective
  ],
  exports: [
    /* MODULES */ CommonModule, FormsModule, HttpClientModule,
    CollapseModule, ModalModule, TypeaheadModule,
    
    /* COMPONENTS */ BreadCrumbsComponent, PhotoGalleryComponent,
    
    /* DIRECTIVES */ ContenteditableDirective,
    
    /* PIPES */ SafeurlPipe, GroupPipe
  ]
  
})
export class SharedModule { }
