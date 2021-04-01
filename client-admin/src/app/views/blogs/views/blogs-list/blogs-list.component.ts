import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { ApiService } from 'app/services/api.service';

import { Blog } from "app/shared/schema/blog";
import { BlogsFilter, BlogsService } from '../../services/blogs.service';

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

  showFilter = false;

  loading: boolean = false;

  @ViewChild('filterForm', { static: true }) filterForm: NgForm;

  search$ = new BehaviorSubject<string>("");

  constructor(
    private blogs: BlogsService
  ) {

    this.filteredBlogs$ = combineLatest([this.blogs$, this.search$.pipe(debounceTime(250))])
      .pipe(map(([events, search]) => this.filterBlogs(events, search)));

  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.filterForm.valueChanges
      .pipe(debounceTime(250))
      .subscribe(filter => {
        this.loadBlogs(filter);
      });
  }

  async loadBlogs(filter: BlogsFilter) {

    this.loading = true;

    const blogs: BlogWithSearchString[] = await this.blogs.list(filter);

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

}
