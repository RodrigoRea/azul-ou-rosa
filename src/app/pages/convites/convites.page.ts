import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdiomaService } from 'src/app/_services/idioma.service';
import { ModeloService } from 'src/app/_services/modelo.service';

@Component({
  selector: 'app-convites',
  templateUrl: './convites.page.html',
  styleUrls: ['./convites.page.scss'],
})
export class ConvitesPage implements OnInit, OnDestroy {

  loading: boolean = false;
  isModalOpen: boolean = false;

  subscription: Subscription | undefined;

  text: any = [];
  item: any | undefined;

  modelos: any[] = [] as any[];

  constructor(
    private idioma: IdiomaService,
    private router: Router,
    private modeloService: ModeloService
  ) { }

  ngOnInit() {

    this.isModalOpen = false;
    this.text = this.idioma.getTexts();
    this.subscription = this.idioma.refreshLanguageState.subscribe(text=>{
      this.text = text; 
    });

    this.getModelos();
  }

  getModelos(){
    this.loading = true;
    this.modeloService.get().subscribe((res: any)=>{
      if(res){
        this.modelos = res;
      }
      this.loading = false;
    }, error => this.loading = false);
  }

  toSelected(item: any){
    this.item = item;
    this.router.navigate([`convites/modelos/${this.item.modelo_id}`]);
  }

  ngOnDestroy(){
    this.isModalOpen = false;
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }

}
