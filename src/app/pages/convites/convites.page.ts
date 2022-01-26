import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdiomaService } from 'src/app/_services/idioma.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-convites',
  templateUrl: './convites.page.html',
  styleUrls: ['./convites.page.scss'],
})
export class ConvitesPage implements OnInit, OnDestroy {

  isModalOpen: boolean = false;

  subscription: Subscription | undefined;

  text: any = [];
  items: Array<{title: string, note: string, icon: string, image: string, component: any, page: string, modelo:number}>;
  item: any | undefined;

  constructor(
    private idioma: IdiomaService,
    private router: Router
  ) { }

  ngOnInit() {

    this.isModalOpen = false;
    this.text = this.idioma.getTexts();
    this.subscription = this.idioma.refreshLanguageState.subscribe(text=>{
      this.text = text; 
    });

    this.items = [];
    this.items.push({
      title: this.text['cha-revelacao'],
      note: this.text['cha-revelacao-txt'],
      icon: "heart",
      image:'cha-revelacao.jpeg',
      component: null,
      page: 'tab1',
      modelo: 1
    });
    this.items.push({
      title: this.text['cha-fraldas'],
      note: this.text['cha-fraldas-txt'],
      icon: "heart",
      image:'cha-de-fraldas.jpeg',
      component: null,
      page: 'tab1',
      modelo: 2
    });
    
  }

  toSelected(item: any){
    this.item = item;
    this.router.navigate([`convites/modelos/${this.item.modelo}`]);
  }

  ngOnDestroy(){
    this.isModalOpen = false;
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }

}
