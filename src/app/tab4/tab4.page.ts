import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdMobGoogleService } from '../_services/admob-google.service';
import { IdiomaService } from '../_services/idioma.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit, OnDestroy{

  idades: number[] = [] as number[];
  forms: FormGroup;
  text: any = [];

  subscription: Subscription | undefined;

  constructor(
    public formBuilder: FormBuilder,
    private idioma: IdiomaService,
    private router: Router,
    private adMobGoogleService: AdMobGoogleService
  ) {}
  
  ionViewWillEnter(){ this.adMobGoogleService.bannerShow(); }
  ionViewWillLeave(){ this.adMobGoogleService.bannerHide(); }

  ngOnInit() {
    this.idades = [];
    for(let i = 10; i <= 90; i++){
      (this.idades).push(i);
    }

    this.text = this.idioma.getTexts();
    this.subscription = this.idioma.refreshLanguageState.subscribe(text=>{
      this.text = text; 
    });

    this.forms = this.formBuilder.group({
      idadeMae: ['',[Validators.required] ],
      idadePai: ['',[Validators.required] ]
    });
  }

  submit(){
    
    if( this.forms.valid ){
      this.adMobGoogleService.interstitialShowWithLoading();
      const somaIdade = parseInt(this.forms.get('idadeMae').value) + parseInt(this.forms.get('idadePai').value);
      const mod = somaIdade % 2;
      this.router.navigate(['resultado'],{ queryParams: { mod: `${mod}` } });
      this.forms.reset();
    }

    
  }

  ngOnDestroy(){
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }
}
