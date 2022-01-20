import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IdiomaService } from './_services/idioma.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  subscription: Subscription | undefined;

  text: any = [];
  
  constructor(
    private idioma: IdiomaService,
    private router: Router,
    private menu: MenuController
  ) {
    this.idioma.initLanguage();    
  }
  
  ngOnInit(){
    this.text = this.idioma.getTexts();
    this.subscription = this.idioma.refreshLanguageState.subscribe(text=>this.text = text);
  }

  toPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.router.navigate([`${page}`]);
    this.menu.close();
  }

  ngOnDestroy(){
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }
  
}
