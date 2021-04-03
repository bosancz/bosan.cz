import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'app/shared/shared.module';
import { BlogsRoutingModule } from './blogs-routing.module';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { BlogsService } from './services/blogs.service';
import { BlogsCreateComponent } from './views/blogs-create/blogs-create.component';
import { BlogsEditComponent } from './views/blogs-edit/blogs-edit.component';
import { BlogsListComponent } from './views/blogs-list/blogs-list.component';


@NgModule({
  declarations: [
    BlogsListComponent,
    BlogsCreateComponent,
    BlogsEditComponent,
    TextEditorComponent,
  ],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    SharedModule,
    IonicModule
  ],
  providers: [
    BlogsService
  ]
})
export class BlogsModule { }
