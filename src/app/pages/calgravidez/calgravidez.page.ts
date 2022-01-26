import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdiomaService } from 'src/app/_services/idioma.service';
import { SignosService } from 'src/app/_services/signos.service';

@Component({
  selector: 'app-calgravidez',
  templateUrl: './calgravidez.page.html',
  styleUrls: ['./calgravidez.page.scss'],
})
export class CalgravidezPage implements OnInit, OnDestroy {

  subscription: Subscription | undefined;
  
  forms: FormGroup;
  text: any = [];
  meses: any = [];
  mes: number;
  dias: any = [];
  anos: any = [];
  YYYY: number;

  constructor(
    private idioma: IdiomaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private signo: SignosService
  ) {
  }

  ngOnInit() {
    this.text = this.idioma.getTexts();
    this.meses = this.idioma.getMeses();
    this.subscription = this.idioma.refreshLanguageState.subscribe(text=>{
      this.text = text; 
      this.meses = this.idioma.getMeses();
    });

    console.log('ionViewDidLoad CalgravidezPage');
    this.optAnos();

    this.dias = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    

    this.forms = this.formBuilder.group({
      primeiroDia: ['',[Validators.required] ],
      mes: ['',[Validators.required] ],
      ano: ['',[Validators.required] ]
    });
  }


  setMes(mes){
    console.log(mes);
    this.mes = mes;
  }

  optAnos(){
    this.YYYY = new Date().getFullYear();
    let j=0;
    for( let i = (this.YYYY-1); i<=(this.YYYY+1); i++ ){
      this.anos[j++] = i;
    }
  }

  submit(){
    
    if( this.forms.valid ){

      const M1  = parseInt(this.forms.get('mes').value); 
      const dia = parseInt(this.forms.get('primeiroDia').value);
      const ano = parseInt(this.forms.get('ano').value);
      
      const data1 = new Date( ano,M1,dia );

      const data2 = new Date( data1.setDate( data1.getDate() + (280)  ) );

      const dd = data2.getDate();
      const mm = data2.getMonth();
      const yy = data2.getFullYear();
      let datatxt = this.text['data'];
      datatxt = datatxt.replace('{dd}',dd);
      datatxt = datatxt.replace('{mm}', this.meses[mm]);
      datatxt = datatxt.replace('{yy}',yy);

      const nSigno = this.signo.getSigno(dd,mm);

      this.router.navigate(['resultado'],{ queryParams: { mod: 2, msg: datatxt, signo: nSigno } });
      
    }

    
  }

  

  ngOnDestroy(){
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }
}
