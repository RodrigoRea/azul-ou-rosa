import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdiomaService } from 'src/app/_services/idioma.service';

@Component({
  selector: 'app-dicas',
  templateUrl: './dicas.page.html',
  styleUrls: ['./dicas.page.scss'],
})
export class DicasPage implements OnInit, OnDestroy {

  subscription: Subscription | undefined;
  text: any = [];

  selectedItem: any | undefined = undefined;
  items: Array<{title: string, note: string, icon: string, image: string, component: any, page: string}>;

  constructor(
    private idioma: IdiomaService,
    private router: Router
  ) { }

  ngOnInit() {

    this.text = this.idioma.getTexts();
    this.subscription = this.idioma.refreshLanguageState.subscribe(text=>{
      this.text = text; 
    });


    this.items = [];
      this.items.push({
        title: this.text['batimentos'],
        note: this.text['batimentos-txt'],
        icon: "heart",
        image:'o-bater-do-coracao.jpg',
        component: null,
        page: ''
      });

      this.items.push({
        title: this.text['couve'],
        note: this.text['couve-txt'],
        icon: "md-flower",
        image:'o-teste-da-couve-roxa.jpg',
        component: null,
        page: ''
      });

      this.items.push({
        title: this.text['laco'],
        note: this.text['laco-txt'],
        icon: "ios-bowtie",
        image:'laco.jpg',
        component: null,
        page: ''
      }); 
      
      this.items.push({
        title: this.text['temperatura'],
        note: this.text['temperatura-txt'],
        icon: "md-snow",
        image:'a-temperatura-dos-pes.jpg',
        component: null,
        page: ''
      });
  }

  itemSelected(item){
    this.selectedItem = item;
    // this.router.navigate(['resultado'],{ queryParams: item });
  }

  toBack(){
    this.selectedItem = undefined
  }

  ngOnDestroy(){
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }

}
