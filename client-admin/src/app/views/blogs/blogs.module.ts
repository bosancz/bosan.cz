import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogsListComponent } from './views/blogs-list/blogs-list.component';
import { BlogsCreateComponent } from './views/blogs-create/blogs-create.component';
import { BlogsEditComponent } from './views/blogs-edit/blogs-edit.component';
import { BlogsService } from './services/blogs.service';


@NgModule({
  declarations: [
    BlogsListComponent,
    BlogsCreateComponent,
    BlogsEditComponent,
  ],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    SharedModule
  ],
  providers: [
    BlogsService
  ]
})
export class BlogsModule { }
