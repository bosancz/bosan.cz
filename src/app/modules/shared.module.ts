import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
 
import { SafeurlPipe } from "../pipes/safeurl.pipe";
import { GroupColorPipe } from "../pipes/group-color.pipe";

import { BreadCrumbsComponent } from '../components/bread-crumbs/bread-crumbs.component';
import { PhotoGalleryComponent } from '../components/photo-gallery/photo-gallery.component';

import { ContenteditableDirective } from '../directives/contenteditable.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  declarations: [
    BreadCrumbsComponent,
    PhotoGalleryComponent,
    SafeurlPipe, GroupColorPipe,
    ContenteditableDirective
  ],
  exports: [
    /* MODULES */ CommonModule, FormsModule, HttpClientModule,
    
    /* COMPONENTS */ BreadCrumbsComponent, PhotoGalleryComponent,
    
    /* DIRECTIVES */ ContenteditableDirective,
    
    /* PIPES */ SafeurlPipe, GroupColorPipe
  ]
  
})
export class SharedModule { }
