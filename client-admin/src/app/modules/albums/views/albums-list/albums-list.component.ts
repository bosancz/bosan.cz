import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService } from 'app/core/services/api.service';
import { Album } from "app/schema/album";
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { transliterate } from 'inflected';
import { BehaviorSubject } from "rxjs";
import { debounceTime } from 'rxjs/operators';



@UntilDestroy()
@Component({
  selector: 'albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss']
})
export class AlbumsListComponent implements OnInit {

  albums: Album[] = [];
  filteredAlbums: Album[] = [];

  searchIndex: string[] = [];

  statuses = [
    { id: "public", name: "zveřejněná" },
    { id: "draft", name: "v přípravě" },
  ];

  statusesIndex = this.statuses.reduce((acc, cur) => (acc[cur.id] = cur.name, acc), {} as { [id: string]: string; });

  loadingArray = Array(5).fill(null);

  actions: Action[] = [
    {
      text: "Nové",
      handler: () => this.router.navigate(["vytvorit"], { relativeTo: this.route })
    }
  ];

  searchString = new BehaviorSubject<string>("");

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.loadAlbums();

    this.searchString
      .pipe(untilDestroyed(this))
      .pipe(debounceTime(250))
      .subscribe(searchString => {
        this.filteredAlbums = this.filterAlbums(this.albums, searchString);
      });
  }


  async loadAlbums() {

    this.albums = [];

    const albums = await this.api.get<Album[]>("albums");

    albums.sort((a, b) => {
      return a?.status.localeCompare(b.status)
        || b.dateFrom?.localeCompare(a.dateFrom)
        || 0;
    });

    this.searchIndex = albums.map(album => {
      return [
        transliterate(album.name)
      ].filter(item => !!item).join(" ");
    });

    this.albums = albums;
    this.filteredAlbums = this.filterAlbums(this.albums, this.searchString.value);
  }

  filterAlbums(albums: Album[], searchString: string) {

    if (!searchString) return albums;

    const search_re = new RegExp("(^| )" + transliterate(searchString).replace(/[^a-zA-Z0-9]/g, ""), "i");

    return albums.filter((event, i) => search_re.test(this.searchIndex[i]));
  }

}
