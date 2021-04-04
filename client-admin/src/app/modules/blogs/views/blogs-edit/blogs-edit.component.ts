import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastService } from 'app/core/services/toast.service';
import { Blog } from 'app/schema/blog';
import { TextEditorComponent } from '../../components/text-editor/text-editor.component';
import { BlogsService } from '../../services/blogs.service';


@Component({
  selector: 'bo-blogs-edit',
  templateUrl: './blogs-edit.component.html',
  styleUrls: ['./blogs-edit.component.scss']
})
export class BlogsEditComponent implements OnInit {

  blog?: Blog;

  @ViewChild("textEditor", { read: TextEditorComponent }) textEditor!: TextEditorComponent;

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
  }

  async save(form: NgForm) {

    if (!this.blog) return;

    // call save() on textEditor to sync current content
    await this.textEditor.save();

    const formData = form.value;

    await this.blogs.save(this.blog._id, formData);

    await this.load(this.blog._id);

    this.toasts.toast("Uloženo.");

  }

  async delete() {
    if (!this.blog) return;
    await this.blogs.delete(this.blog._id);
    this.toasts.toast("Příspěvek smazán.");
    this.router.navigate(["../../"], { relativeTo: this.route });
  }

  async publish() {
    if (!this.blog) return;
    await this.blogs.publish(this.blog);
    await this.load(this.blog._id);
    this.toasts.toast("Publikováno");
  }

  async unpublish() {
    if (!this.blog) return;
    await this.blogs.unpublish(this.blog);
    await this.load(this.blog._id);
    this.toasts.toast("Skryto");
  }

}
