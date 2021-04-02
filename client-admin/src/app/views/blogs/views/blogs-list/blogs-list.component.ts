import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { ApiService } from 'app/services/api.service';

import { Blog } from "app/shared/schema/blog";
import { BlogsFilter, BlogsService } from '../../services/blogs.service';
import { DateTime } from 'luxon';
import { ActivatedRoute, Params, Router } from '@angular/router';

type BlogWithSearchString = Blog & { searchString?: string; };

@Component({
  selector: 'blogs-list',
  templateUrl: './blogs-list.component.html',
  styleUrls: ['./blogs-list.component.scss']
})
export class BlogsListComponent implements OnInit {

  years: number[] = [];
  currentYear: number;

  blogs$ = new Subject<BlogWithSearchString[]>();
  filteredBlogs$: Observable<Blog[]>;

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

  search$ = new BehaviorSubject<string>("");

  constructor(
    private blogs: BlogsService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.filteredBlogs$ = combineLatest([this.blogs$, this.search$.pipe(debounceTime(250))])
      .pipe(map(([events, search]) => this.filterBlogs(events, search)));

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
    const years = []; // TODO load years from API
    const currentYear = DateTime.local().year;

    if (years.indexOf(currentYear) === -1) {
      years.push(currentYear);
    }

    years.sort();

    this.years = years;
  }

  async loadBlogs() {

    this.loading = true;

    const blogs: BlogWithSearchString[] = await this.blogs.list(this.filter);

    blogs.forEach(blog => {
      blog.searchString = [
        blog.title
      ].filter(item => !!item).join(" ");
    });

    this.blogs$.next(blogs);

    this.loading = false;
  }

  filterBlogs(events: BlogWithSearchString[], search: string) {

    if (!search) return events;

    const search_re = new RegExp("(^| )" + search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");

    return events.filter(event => search_re.test(event.searchString));
  }

  updateFilter(changes: Partial<BlogsFilter>) {
    const filter = Object.assign({}, this.filter, changes);
    this.router.navigate([], { queryParams: filter });
  }

};
