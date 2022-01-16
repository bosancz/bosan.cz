import { ApplicationRef, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { ToastService } from 'app/core/services/toast.service';
import { Blog } from "app/schema/blog";
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { DateTime } from 'luxon';
import { BehaviorSubject } from "rxjs";
import { debounceTime } from 'rxjs/operators';
import { BlogsFilter, BlogsService } from '../../services/blogs.service';



@Component({
  selector: 'blogs-list',
  templateUrl: './blogs-list.component.html',
  styleUrls: ['./blogs-list.component.scss']
})
export class BlogsListComponent implements OnInit, ViewWillEnter {

  years: number[] = [];
  currentYear?: number;

  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];

  showFilter = false;

  loading: boolean = false;

  searchString = new BehaviorSubject<string>("");

  searchIndex: string[] = [];

  actions: Action[] = [
    {
      icon: "search-outline",
      pinned: true,
      handler: () => this.showFilter = !this.showFilter
    },
    {
      icon: "add-outline",
      text: "Vytvořit",
      pinned: true,
      handler: () => this.create()
    },
  ];

  constructor(
    private blogsService: BlogsService,
    private router: Router,
    private route: ActivatedRoute,
    private toasts: ToastService
  ) {

    this.searchString
      .pipe(debounceTime(250))
      .subscribe(() => this.filter());

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.load();
  }

  async load() {

    this.loading = true;

    const blogs = await this.blogsService.list();

    // dates are ISO string, sorting as text    
    blogs.sort((a, b) => (a.datePublished || "").localeCompare(b.datePublished || ""));

    this.blogs = blogs;

    this.searchIndex = blogs.map(blog => this.getSearchString(blog));

    this.filter();

    this.loading = false;
  }

  filter() {

    if (!this.searchString.value) {
      this.filteredBlogs = this.blogs;
      return;
    }

    const search_re = new RegExp(this.searchString.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");

    this.filteredBlogs = this.blogs.filter((blog, i) => search_re.test(this.searchIndex[i]));
  }

  async create() {
    // get data from form
    const blogData = {
      "title": "Nový příspěvek"
    };
    // create the event and wait for confirmation
    const blog = await this.blogsService.create(blogData);
    // show the confrmation
    this.toasts.toast("Příspěvěk vytvořen a uložen.");
    // open the blog
    this.router.navigate(["/blog", blog._id, "upravit"], { relativeTo: this.route });
  }

  private getSearchString(blog: Blog) {
    return [
      blog.title,
      blog.datePublished ? DateTime.fromISO(blog.datePublished).toFormat("d. M. y") : undefined
    ].filter(item => !!item).join(" ");
  }

};
