import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdiomaService } from '../_services/idioma.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {

  idades: number[] = [] as number[];
  
  forms: FormGroup;
  tabela: any;
  meses: any;
  text: any = [];

  mesNascimentoBebe: number;
  subscription: Subscription | undefined;

  constructor(
    public formBuilder: FormBuilder,
    private idioma: IdiomaService,
    private router: Router
  ) {

    

  }

  ngOnInit() {

    this.idades = [];
    for(let i = 15; i <= 40; i++){
      (this.idades).push(i);
    }

    this.text = this.idioma.getTexts();
    this.meses = this.idioma.getMeses();
    this.subscription = this.idioma.refreshLanguageState.subscribe(text=>{
      this.text = text; 
      this.meses = this.idioma.getMeses();
    });

    this.forms = this.formBuilder.group({
      mesNascimentoBebe: ['',[Validators.required] ],
      idadeMae: ['',[Validators.required] ]
    });
    
    this.tabelaMaia();
  }


  tabelaMaia(){
    let id = 15;

    this.tabela = [];
    
    this.tabela[id++] = [0,1,0,1,0,1,0,1,0,0,1,0]; //15
    this.tabela[id++] = [0,0,1,0,1,0,1,0,1,0,0,1]; //16
    this.tabela[id++] = [1,0,0,1,0,1,0,1,0,1,0,0]; //17
    this.tabela[id++] = [0,1,0,0,1,0,1,0,1,0,1,0]; //18
    this.tabela[id++] = [1,0,1,0,0,1,0,1,0,1,0,1]; //19
    this.tabela[id++] = [0,1,0,1,0,0,1,0,1,0,1,0]; //20
    this.tabela[id++] = [1,0,1,0,1,0,0,1,0,1,0,1]; //21
    this.tabela[id++] = [0,1,0,1,0,1,0,0,1,0,1,0]; //22
    this.tabela[id++] = [1,0,1,0,1,0,1,0,0,1,0,1]; //23
    this.tabela[id++] = [1,0,1,0,1,0,1,0,1,1,0,1]; //24
    this.tabela[id++] = [1,0,1,0,1,0,1,0,1,0,0,1]; //25
    this.tabela[id++] = [0,1,0,1,0,1,0,1,0,1,0,0]; //26
    this.tabela[id++] = [1,0,1,0,1,0,1,0,1,0,1,0]; //27
    this.tabela[id++] = [0,1,0,1,0,1,0,1,0,1,0,1]; //28
    this.tabela[id++] = [0,0,1,0,1,0,1,0,1,0,1,0]; //29
    this.tabela[id++] = [1,0,0,1,0,1,0,1,0,1,0,1]; //30
    this.tabela[id++] = [0,1,0,0,1,0,1,0,1,0,1,0]; //31
    this.tabela[id++] = [1,0,1,0,0,1,0,1,0,1,0,1]; //32
    this.tabela[id++] = [0,1,0,1,0,0,1,0,1,0,1,0]; //33
    this.tabela[id++] = [1,0,1,0,1,0,0,1,0,1,0,1]; //34
    this.tabela[id++] = [0,1,0,1,0,1,0,0,1,0,1,0]; //35
    this.tabela[id++] = [1,0,1,0,1,0,1,0,0,1,0,1]; //36
    this.tabela[id++] = [0,1,0,1,0,1,0,1,0,0,1,0]; //37
    this.tabela[id++] = [1,0,1,0,1,0,1,0,1,0,0,1]; //38
    this.tabela[id++] = [0,1,0,1,0,1,0,1,0,1,0,0]; //39
    this.tabela[id++] = [1,0,1,0,1,0,1,0,1,0,1,0]; //40

    console.log(this.tabela);

  }

  setMesNascimentoBebe(mes){
    console.log(mes);
    this.mesNascimentoBebe = mes;
  }


  submit(){
    
    if( this.forms.valid ){
      const M1 = this.mesNascimentoBebe;
      const idade = parseInt(this.forms.get('idadeMae').value);

      if( idade >= 15 && idade <= 40){
        const mod = this.tabela[idade][M1];
        console.log('mod', mod);
        this.router.navigate(['resultado'],{ queryParams: { mod: `${mod}` } })
        // this.navCtrl.push(ResultadoPage, { mod: mod } );
        this.forms.reset();
      }else{
        alert( this.text['maia-txt-1'] );
      }
      
    }

    
  }

  ngOnDestroy(){
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }

}
