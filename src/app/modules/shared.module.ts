import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
 
import { BreadCrumbsComponent } from '../components/bread-crumbs/bread-crumbs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  declarations: [
    BreadCrumbsComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    BreadCrumbsComponent
  ]
  
})
export class SharedModule { }
