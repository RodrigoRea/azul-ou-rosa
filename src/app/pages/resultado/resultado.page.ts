import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdiomaService } from 'src/app/_services/idioma.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.page.html',
  styleUrls: ['./resultado.page.scss'],
})
export class ResultadoPage implements OnInit, OnDestroy {

  subscription: Subscription | undefined;
  subscriptionI: Subscription | undefined;
  
  mod:    string = '';
  signo:  string = '';
  msg:    string = '';

  mensagem: string = '';
  text: any = [];
  imagem: string = '';
  descricao: string = '';
  cssclass: string = '';

  constructor(
    private idioma: IdiomaService, 
    private activatedRoute: ActivatedRoute
  ) {
    // this.mod = navParams.get('mod');
  }

  ngOnInit() {

    this.subscriptionI = this.activatedRoute.queryParams.subscribe(params => {
      this.mod    = (params['mod'])   ? params['mod']   : '';
      this.signo  = (params['signo']) ? params['signo'] : '';
      this.msg    = (params['msg'])   ? params['msg']   : '';

      this.init();
    });


  }

  init(){

    this.descricao = '';
    this.text = this.idioma.getTexts();
    this.subscription = this.idioma.refreshLanguageState.subscribe(text=>this.text = text);
   
    const nImg = Math.floor((Math.random()*6)+1);

    if( `${this.mod}` === '0' ){
      // sexo menino
      this.mensagem = this.text['resultado-txt-1'];
      this.imagem = 'bebes/menino/'+ nImg + '.jpg';
      this.descricao = this.text['menino'];
      this.cssclass = 'menino';
    }else if( `${this.mod}` === '1' ){
      // sexo menina
      this.mensagem = this.text['resultado-txt-2'];
      this.imagem = 'bebes/menina/'+ nImg + '.jpg';
      this.descricao = this.text['menina'];
      this.cssclass = 'menina';
    }else if( `${this.mod}` === '2' ){
      // calculadora gravidez
      const signos = this.idioma.getSignos();
      
      this.descricao = signos[this.signo];
      this.mensagem = this.text['provavelmente']+' '+this.msg;
      this.imagem = 'signos-zodiaco/'+ this.signo + '.jpg';
      
    }
  }

  openMetodo(){

    // this.adMob.interstitial();

    // this.navCtrl.setRoot(ListPage);
  }

  ngOnDestroy(){
    if( this.subscription ){ 
      this.subscription.unsubscribe(); 
      this.subscriptionI.unsubscribe(); 
    }
  }

}
