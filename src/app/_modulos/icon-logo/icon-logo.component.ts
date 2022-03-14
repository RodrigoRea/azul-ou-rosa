import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'icon-logo',
  templateUrl: './icon-logo.component.html',
  styleUrls: ['./icon-logo.component.scss'],
})
export class IconLogoComponent implements OnInit {

  isApp: boolean = false;

  constructor(
    private router: Router,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.isApp = environment.isApp;
  }

  toHome(){
    this.router.navigate(['home']);
    this.menu.close();
  }

}
