import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'app/shared/shared.module';
import { BlogsRoutingModule } from './blogs-routing.module';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { BlogsService } from './services/blogs.service';
import { BlogsEditComponent } from './views/blogs-edit/blogs-edit.component';
import { BlogsListComponent } from './views/blogs-list/blogs-list.component';
import { BlogsViewComponent } from './views/blogs-view/blogs-view.component';
import { TextViewComponent } from './components/text-view/text-view.component';


@NgModule({
  declarations: [
    BlogsListComponent,
    BlogsEditComponent,
    TextEditorComponent,
    BlogsViewComponent,
    TextViewComponent,
  ],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    SharedModule,
  ],
  providers: [
    BlogsService
  ]
})
export class BlogsModule { }
