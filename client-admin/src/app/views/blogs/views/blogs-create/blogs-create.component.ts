import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ApiService } from 'app/services/api.service';
import { ToastService } from 'app/services/toast.service';

import { Blog } from 'app/shared/schema/blog';
import { BlogsService } from '../../services/blogs.service';

@Component({
  selector: 'blogs-create',
  templateUrl: './blogs-create.component.html',
  styleUrls: ['./blogs-create.component.scss']
})
export class BlogsCreateComponent implements OnInit {

  currentYear = (new Date()).getFullYear();

  constructor(
    private blogs: BlogsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  async createBlog(form: NgForm) {
    // get data from form
    const blogData = form.value;
    // create the event and wait for confirmation
    const blog = await this.blogs.create(blogData);
    // show the confrmation
    this.toastService.toast("Příspěvěk vytvořen a uložen.");
    // open the blog
    this.router.navigate(["/blog", blog._id, "upravit"], { relativeTo: this.route });
  }

}
