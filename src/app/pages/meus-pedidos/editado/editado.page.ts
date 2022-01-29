import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editado',
  templateUrl: './editado.page.html',
  styleUrls: ['./editado.page.scss'],
})
export class EditadoPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  toPage(page) {
    this.router.navigate([`${page}`]);
  }

}
