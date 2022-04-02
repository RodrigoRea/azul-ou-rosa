import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdMobGoogleService } from '../_services/admob-google.service';
import { IdiomaService } from '../_services/idioma.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {

  idades: number[] = [] as number[];
  
  forms: FormGroup;
  tabela: any;
  meses: any;
  text: any = [];
  mesAniversarioMae: number;
  mesGravidezMae: number;
  subscription: Subscription | undefined;

  constructor(
    public formBuilder: FormBuilder,
    private idioma: IdiomaService,
    private router: Router,
    private adMobGoogleService: AdMobGoogleService
  ) {
  }

  ionViewWillEnter(){ this.adMobGoogleService.bannerShow(); }
  ionViewWillLeave(){ this.adMobGoogleService.bannerHide(); }

  ngOnInit() {
    this.idades = [];
    for(let i = 18; i <= 45; i++){
      (this.idades).push(i);
    }

    this.text = this.idioma.getTexts();
    this.meses = this.idioma.getMeses();
    this.subscription = this.idioma.refreshLanguageState.subscribe(text=>{
      this.text = text; 
      this.meses = this.idioma.getMeses();
    });

    this.forms = this.formBuilder.group({
      mesAniverMae: ['',[Validators.required] ],
      mesGraviMae: ['',[Validators.required] ],
      idadeMae: ['',[Validators.required] ]
    });

    this.tabelaChinesa();
  }


  tabelaChinesa(){
    let id = 18;

    this.tabela = [];
    
    this.tabela[id++] = [1,0,1,0,0,0,0,0,0,0,0,0]; //18
    this.tabela[id++] = [0,1,0,1,1,0,0,0,0,0,1,1]; //19
    this.tabela[id++] = [1,0,1,0,0,0,0,0,0,1,0,0]; //20
    this.tabela[id++] = [0,1,1,1,1,1,1,1,1,1,1,1]; //21
    this.tabela[id++] = [1,0,0,1,0,1,1,0,1,1,1,1]; //22
    this.tabela[id++] = [0,0,1,0,0,1,0,1,0,0,0,1]; //23
    this.tabela[id++] = [0,1,0,0,1,0,0,1,1,1,1,1]; //24
    this.tabela[id++] = [1,0,0,1,1,0,1,0,0,0,0,0]; //25
    this.tabela[id++] = [0,1,0,1,1,0,1,0,1,1,1,1]; //26
    this.tabela[id++] = [1,0,1,0,1,1,0,0,0,0,1,0]; //27
    this.tabela[id++] = [0,1,0,1,1,1,0,0,0,0,1,1]; //28
    this.tabela[id++] = [1,0,1,1,0,0,0,0,0,1,1,1]; //29
    this.tabela[id++] = [0,1,1,1,1,1,1,1,1,1,0,0]; //30
    this.tabela[id++] = [0,1,0,1,1,1,1,1,1,1,1,0]; //31
    this.tabela[id++] = [0,1,0,1,1,1,1,1,1,1,1,0]; //32
    this.tabela[id++] = [1,0,0,0,1,1,1,0,1,1,1,0]; //33
    this.tabela[id++] = [0,1,0,1,1,0,1,1,1,1,0,0]; //34
    this.tabela[id++] = [0,0,1,0,1,1,1,0,1,1,0,0]; //35
    this.tabela[id++] = [1,0,0,1,0,1,1,1,0,0,0,0]; //36
    this.tabela[id++] = [0,1,0,0,1,0,1,0,1,0,1,0]; //37
    this.tabela[id++] = [1,0,1,0,0,1,0,1,0,1,0,1]; //38
    this.tabela[id++] = [0,1,0,0,0,1,1,0,1,0,1,1]; //39
    this.tabela[id++] = [1,0,1,0,1,0,0,1,0,1,0,1]; //40
    this.tabela[id++] = [0,1,0,1,0,1,0,0,1,0,1,0]; //41
    this.tabela[id++] = [1,0,1,0,1,0,1,0,0,1,0,1]; //42
    this.tabela[id++] = [0,1,0,1,0,1,0,1,0,0,0,0]; //43
    this.tabela[id++] = [0,0,1,0,0,0,1,0,1,0,1,1]; //44
    this.tabela[id++] = [1,0,0,1,1,1,0,1,0,1,0,0]; //45

    console.log(this.tabela);

  }

  setMesAniverMae(mes){
    console.log(mes);
    this.mesAniversarioMae = mes;
  }

  setMesGraviMae(mes){
    console.log(mes);
    this.mesGravidezMae = mes;
  }

  submit(){
    
    if( this.forms.valid ){
      
      const idade = parseInt(this.forms.get('idadeMae').value);

      if(idade >= 18 && idade <= 45){
        this.adMobGoogleService.interstitialShowWithLoading();
        const M1 = this.mesAniversarioMae;
        const M2 = this.mesGravidezMae;
        const idadeLunar = ( M1 <= 1 ) ? idade : idade + 1;

        const mod = this.tabela[idadeLunar][M2];

        this.router.navigate(['resultado'],{ queryParams: { mod: `${mod}` } });
        this.forms.reset();
      }else{
        alert('A idade deve ser entre 18 e 45 anos!');
      }
    }

  }

  ngOnDestroy(){
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }

}
