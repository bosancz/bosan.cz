import { Component, OnInit } from '@angular/core';
import { Event } from 'app/shared/schema/event';
import { Member } from 'app/shared/schema/member';

interface NewsItem {
  type: "new-member" | "new-event",
  data: any;
}

@Component({
  selector: 'dashboard-news',
  templateUrl: './dashboard-news.component.html',
  styleUrls: ['./dashboard-news.component.scss']
})
export class DashboardNewsComponent implements OnInit {

  news: NewsItem[] = [
    {
      type: "new-event",
      data: {
        event: {
          _id: "aaa",
          name: "Neočekávaný dýchánek",
          status: "draft",
          description: "Sejdeme se u Bilba doma a budeme poslouchat metal a kouřit trávu. Gandalf nám možná ukáže trik se špičatým... puf! To jsem vám vůbec neměl říkat!",
          dateFrom: "2012-03-04",
          dateTill: "2012-03-08",
        }
      }
    },
    {
      type: "new-member",
      data: {

        member: {
          nickname: "Frodo",
          group: "22"
        }
      }
    },
    {
      type: "new-member",
      data: {
        member: {
          nickname: "Sam",
          group: "4"
        }
      }
    },
    {
      type: "new-event",
      data: {
        event: {
          _id: "aaa",
          name: "Neočekávaný dýchánek",
          status: "draft",
          description: "Sejdeme se u Bilba doma a budeme poslouchat metal a kouřit trávu. Gandalf nám možná ukáže trik se špičatým... puf! To jsem vám vůbec neměl říkat!",
          dateFrom: "2012-03-04",
          dateTill: "2012-03-08",
        }
      }
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
