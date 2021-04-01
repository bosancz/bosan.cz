import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { ToastService } from 'app/services/toast.service';
import { Blog } from 'app/shared/schema/blog';
import { BlogsService } from '../../services/blogs.service';


@Component({
  selector: 'bo-blogs-edit',
  templateUrl: './blogs-edit.component.html',
  styleUrls: ['./blogs-edit.component.scss']
})
export class BlogsEditComponent implements OnInit {

  blog?: Blog;

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

    const data = form.value;

    await this.blogs.save(this.blog._id, data);
    await this.load(this.blog._id);
    this.toasts.toast("Uloženo.");
  }

  async delete() {
    await this.blogs.delete(this.blog._id);
    this.toasts.toast("Příspěvek smazán.");
    this.router.navigate(["../../"], { relativeTo: this.route });
  }

  async publish() {
    await this.blogs.publish(this.blog);
    await this.load(this.blog._id);
    this.toasts.toast("Publikováno");
  }

  async unpublish() {
    await this.blogs.unpublish(this.blog);
    await this.load(this.blog._id);
    this.toasts.toast("Skryto");
  }

}
