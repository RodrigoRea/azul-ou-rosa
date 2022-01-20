import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'icon-logo',
  templateUrl: './icon-logo.component.html',
  styleUrls: ['./icon-logo.component.scss'],
})
export class IconLogoComponent implements OnInit {

  constructor(
    private router: Router,
    private menu: MenuController
  ) { }

  ngOnInit() {}

  toHome(){
    this.router.navigate(['home']);
    this.menu.close();
  }

}
