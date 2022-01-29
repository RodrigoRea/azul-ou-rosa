import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  private _loading: boolean = false;
  @Input() set loading(loading: boolean){
    this._loading = loading;
  }
  get loading():boolean{
    return this._loading;
  }

  constructor() { }

  ngOnInit() {}

}
