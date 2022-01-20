import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdiomaService } from '../_services/idioma.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy{

  idades: number[] = [] as number[];

  subscription: Subscription | undefined;
  
  forms: FormGroup;
  tabela: any;
  meses: any;
  text: any = [];

  mesGravidezMae: number;

  constructor(
    public formBuilder: FormBuilder,
    private idioma: IdiomaService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.idades = [];
    for(let i = 10; i <= 90; i++){
      (this.idades).push(i);
    }

    this.text = this.idioma.getTexts();
    this.meses = this.idioma.getMeses();
    this.subscription = this.idioma.refreshLanguageState.subscribe(text=>{
      this.text = text; 
      this.meses = this.idioma.getMeses();
    });

    this.forms = this.formBuilder.group({
      mesGravidezMae: ['',[Validators.required] ],
      idadeMae: ['',[Validators.required] ]
    });
  }



  setMesGravidezMae(mes){
    console.log(mes);
    this.mesGravidezMae = mes;
  }


  submit(){
    
    if( this.forms.valid ){
      const M1 = this.mesGravidezMae;
      const idade = parseInt(this.forms.get('idadeMae').value);

      const idadeMes = idade + M1 + 1;
      const mod = idadeMes % 2;

      this.router.navigate(['resultado'],{ queryParams: { mod: `${mod}` } });
      this.forms.reset();
      
    }

    
  }

  ngOnDestroy(){
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }

}
