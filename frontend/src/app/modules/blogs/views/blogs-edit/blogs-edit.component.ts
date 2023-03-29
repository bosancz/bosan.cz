import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastService } from 'app/core/services/toast.service';
import { Blog } from 'app/schema/blog';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { TextEditorComponent } from '../../components/text-editor/text-editor.component';
import { BlogsService } from '../../services/blogs.service';


@Component({
  selector: 'bo-blogs-edit',
  templateUrl: './blogs-edit.component.html',
  styleUrls: ['./blogs-edit.component.scss']
})
export class BlogsEditComponent implements OnInit {

  blog?: Blog;

  actions: Action[] = [];

  @ViewChild("textEditor", { read: TextEditorComponent }) textEditor!: TextEditorComponent;

  @ViewChild("createBlogForm") form!: NgForm;

  constructor(
    private blogs: BlogsService,
    private route: ActivatedRoute,
    private toasts: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params["id"]) this.load(params["id"]);
    });
  };

  async load(id: string) {
    this.blog = await this.blogs.load(id);
    this.actions = [{
      text: "Uložit",
      handler: () => this.save()
    }];
  }

  async save() {

    if (!this.blog) return;

    // call save() on textEditor to sync current content
    await this.textEditor.save();

    const formData = this.form.value;

    await this.blogs.save(this.blog._id, formData);

    await this.load(this.blog._id);

    this.toasts.toast("Uloženo.");

    this.router.navigate(["../"], { relativeTo: this.route, replaceUrl: true });

  }

}
