import { Component, OnInit } from '@angular/core';
import { MenuService } from 'app/core/services/menu.service';
import { FooterService } from 'app/core/services/footer.service';

@Component({
  selector: 'frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.scss']
})
export class FrontendComponent implements OnInit {

  constructor(public menuService: MenuService, public footerService: FooterService) { }

  ngOnInit() {
  }

}
