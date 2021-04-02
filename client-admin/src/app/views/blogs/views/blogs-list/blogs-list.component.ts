import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from "app/shared/schema/blog";
import { DateTime } from 'luxon';
import { BehaviorSubject } from "rxjs";
import { debounceTime } from 'rxjs/operators';
import { BlogsFilter, BlogsService } from '../../services/blogs.service';



@Component({
  selector: 'blogs-list',
  templateUrl: './blogs-list.component.html',
  styleUrls: ['./blogs-list.component.scss']
})
export class BlogsListComponent implements OnInit {

  years: number[] = [];
  currentYear?: number;

  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];

  statuses = [
    { id: "public", name: "zveřejněné" },
    { id: "draft", name: "v přípravě" },
  ];

  statusesIndex = this.statuses.reduce((acc, cur) => (acc[cur.id] = cur.name, acc), {} as { [id: string]: string; });

  filter: BlogsFilter = {
    year: DateTime.local().year,
    status: undefined
  };

  showFilter = false;

  loading: boolean = false;

  searchString = new BehaviorSubject<string>("");

  constructor(
    private blogsService: BlogsService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.searchString
      .pipe(debounceTime(250))
      .subscribe(() => this.filterBlogs());

  }

  ngOnInit() {
    this.loadYears();

    this.route.queryParams.subscribe((params: { year?: string, status?: string; }) => {
      if (params.year && this.years.indexOf(Number(params.year))) {
        this.filter.year = Number(params.year);
      }
      if (params.status && this.statuses.some(item => item.id === params.status)) {
        this.filter.status = params.status;
      }

      this.loadBlogs();
    });
  }

  async loadYears() {
    const years: number[] = []; // TODO load years from API
    const currentYear = DateTime.local().year;

    if (years.indexOf(currentYear) === -1) {
      years.push(currentYear);
    }

    years.sort();

    this.years = years;
  }

  async loadBlogs() {

    this.loading = true;

    const blogs = await this.blogsService.list(this.filter);

    blogs.sort((a, b) => a.datePublished.localeCompare(b.datePublished)); // dates are ISO string, sorting as text    

    this.blogs = blogs;

    this.loading = false;
  }

  filterBlogs() {

    if (!this.searchString.value) {
      this.filteredBlogs = this.blogs;
      return;
    }

    const search_re = new RegExp("(^| )" + this.searchString.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");

    this.filteredBlogs = this.blogs.filter(blog => search_re.test(blog.title));
  }

  updateFilter(changes: Partial<BlogsFilter>) {
    const filter = Object.assign({}, this.filter, changes);
    this.router.navigate([], { queryParams: filter });
  }

};
