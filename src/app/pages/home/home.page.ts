import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdiomaService } from 'src/app/_services/idioma.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  subscription: Subscription | undefined;
  text: any = [];

  selectedItem: any;
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
        title: this.text['maia'],
        note: this.text['batimentos-txt'],
        icon: "heart",
        image:'tabela-maia.jpg',
        component: null,
        page: 'tab1'
      });

      this.items.push({
        title: this.text['chinesa'],
        note: this.text['couve-txt'],
        icon: "md-flower",
        image:'tabela-chinesa.jpg',
        component: null,
        page: 'tab2'
      });

      this.items.push({
        title: this.text['cigana'],
        note: this.text['laco-txt'],
        icon: "ios-bowtie",
        image:'cigana.jpg',
        component: null,
        page: 'tab3'
      }); 
      
      this.items.push({
        title: this.text['numerologia'],
        note: this.text['temperatura-txt'],
        icon: "md-snow",
        image:'numerologia.jpg',
        component: null,
        page: 'tab4'
      });
  }

  itemSelected(page){
    this.router.navigate([`${page}`]);
  }

  ngOnDestroy(){
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }


}
