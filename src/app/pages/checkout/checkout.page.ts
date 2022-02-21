import { Component, NgZone, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dados, Metodos, PG, RetornoPG } from './checkout';
import { PagSeguroService } from 'src/app/_services/pagseguro.service';
import { Router } from '@angular/router';

declare var $: any;
declare var PagSeguroDirectPayment: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  loading: boolean = false;
  passo: number = 1;

  mBoleto = new Metodos();
  mBalance = new Metodos();
  mCredito = Array<Metodos>();
  mDebito = Array<Metodos>();
  mDeposito = Array<Metodos>();
  showMetodos: boolean = false;

  valor_total: number = 0;

  session: string = '';
  cart: any | undefined;

  pgSeguroURL: string =  environment.pgSeguroURL;
  tipo: string = '';

  dados = new Dados();

  responseBoleto = new RetornoPG();
  responseCredito = new RetornoPG();
  responseDebito = new RetornoPG();
  retornoTransacao: any = '';

  url = environment.api;

  constructor(
    private router: Router,
    private zone: NgZone,
    private pagSeguroService: PagSeguroService
  ) { 
    window['angularComponentRef'] = {
      zone: this.zone,
      componentFn: (fn: Function) => fn(),
      component: this
    };
  }

  ionViewWillEnter(){
    console.log('enter page');
    this.init();
  }

  ionViewDidEnter(){
    console.log('exit page');
  }

  toPasso1(){
    this.passo = 1;
    this.getSession();
  }

  ngOnInit() {
  }

  init() {
    this.passo = 1;
    this.importScript().then(()=>{
      console.log('importScript pay ok');
      const cart = localStorage.getItem(environment.cartStorage);
      try {
        this.cart = ( cart ) ? JSON.parse(atob(cart)) : undefined;
      } catch (error) {
        console.log('No cart in storage', error);
        this.cart = undefined;
      }  
      if( this.cart ){  
        this.setTotal();
      }else{
        console.log('No cart in storage');
        this.router.navigate(['/convites']);
      } 

    }).catch(()=>{
      this.errorPagSeguroConn();
    })
       
  }

  setTotal(){
    let total = 0;
    if( this.cart && (this.cart).length > 0 ){
      for(let i = 0; i < (this.cart).length; i++ ){
        total += +(this.cart[i].produto.valor);
        if( this.cart[i].invite.valor_presenca && this.cart[i].invite.link_presenca === 'S' ){
          total += +(this.cart[i].invite.valor_presenca);
        }
      }
    }
    this.valor_total = total;
  }

  importScript():Promise<any>{
  return new Promise((resolve, reject) => {
      let script: HTMLScriptElement = document.createElement('script');
      script.addEventListener('load', r => { 
        setTimeout(() => {
          this.getSession();
          resolve(true);
        });        
      });
      script.src = (environment.pagseguro_use_sandbox) ? environment.jsSandbox : environment.jsProducao;
      script.id = 'pg-seguro-js';
      script.type = 'text/javascript';
      document.head.appendChild(script);
    });
  }

  errorPagSeguroConn(){
    this.loading = false; 
    alert('Falha na conexão com nossos serviços de pagamento! Por favor, tente novamente');
    //history.back();
    this.router.navigate(['/convites']);
  }

  getSession(){
    this.session = '';
    this.loading = true;
    // this.getSession();
    this.pagSeguroService.get().subscribe((res: any) => {
      console.log('pagSeguroService.get', res);
      if( res && res.session ){
        this.session = res.session;
        this.setSessionID(); 
        this.loading = false;         
      }else{
        this.session = '';
        this.errorPagSeguroConn();
      }
    }, error => {
      this.session = '';      
      this.errorPagSeguroConn();
    });
  }

  setSessionID(){
    console.log('session', this.session);
    setTimeout(() => {
      if( this.session !== '' ){
        PagSeguroDirectPayment.setSessionId(this.session);
        setTimeout(() => {
          window['angularComponentRef'].zone.run(() => {
            window['angularComponentRef'].componentFn( ()=>{ this.getMetodos(); } );
          });
        });        
      }else{
        // this.setSessionID();
      }
    });
  }

  formatRS(x: any) {
    let r = '0.00';
    let v = (x+'');
    let pm = (v).split(".");
    if( (pm).length === 2 ){
      console.log('pm',pm);
      r = pm[0]; // + (+pm[1] < 10) ? (pm[1] + '0') : pm[1];
      r += ".";
      r += (+pm[1] < 10) ? pm[1] + '0' : pm[1];
    }
    if( (pm).length === 1 ){
      r = pm[0] + '.00';
    }

    return r;
  }

  getMetodos(){
    const valor_total = this.formatRS(this.valor_total);
    console.log('getPaymentMethods - amount', valor_total);
    PagSeguroDirectPayment.getPaymentMethods({
      amount: valor_total,
      success: (response: any) => {
        window['angularComponentRef'].zone.run(() => {
          window['angularComponentRef'].componentFn( ()=>{ this.setMetodos(response); } );
        });                
      },
      error: (response) => {
        console.log('response', response);
        if(response){          
          window['angularComponentRef'].zone.run(() => {
            window['angularComponentRef'].componentFn( ()=>{ this.errorPagSeguroConn(); } );
          }); 
        }
      },
      complete: (response) => {
          // Callback para todas chamadas.
      }
    });
  }

  setMetodos(metodos: any){
    console.log('metodos');
    if( !metodos.error ){
      for( let key in metodos.paymentMethods ){
        if( key === 'BOLETO' ){
          this.mBoleto = metodos.paymentMethods[key]['options'][key];
        }
        if( key === 'BALANCE' ){
          this.mBalance = metodos.paymentMethods[key]['options'][key];
        }
        if( key === 'CREDIT_CARD' ){
          this.mCredito = [];
          const m = metodos.paymentMethods[key]['options'];
          for( const k in m ){
            (this.mCredito).push(m[k]);
          }
        }
        if( key === 'ONLINE_DEBIT' ){
          const m = metodos.paymentMethods[key]['options'];
          for( const k in m ){
            (this.mDebito).push(m[k]);
          }
        }
        if( key === 'DEPOSIT' ){
          const m = metodos.paymentMethods[key]['options'];
          for( const k in m ){
            (this.mDeposito).push(m[k]);
          }
        }
      }

      this.showMetodos = true;

      console.log(metodos);
      console.log('Boleto', this.mBoleto);
      console.log('Credito', this.mCredito);
      console.log('Debito', this.mDebito);
      this.loading = false; 
    }
  }

  loadingOFF(){
    this.loading = false; 
  }

  setDados(dados: Dados){
    this.dados = dados;
    this.passo = (dados.voltar) ? (this.passo - 1) : (this.passo + 1);
    // this.toTop();
  }


  enviarDadosDePagamento(pg: PG){
    if(pg && pg.pagamento && pg.pagamento.cardnumber && pg.pagamento.cvv){
      let cardnumber = pg.pagamento.cardnumber;
      pg.pagamento.cardnumber = btoa(btoa((cardnumber).replace(/ /g, ";")));

      let cvv = pg.pagamento.cvv;
      pg.pagamento.cvv = btoa(btoa((`${cvv}`).replace(/ /g, ";")));
    }

    console.log('Dados para pagamento', pg);
    // this.passo = 4;   

    if( pg.pagamento.tipo === 'boleto' ){
      this.startBoleto(pg);
    }

    /*if( pg.pagamento.tipo === 'debito' ){
      this.startDebito(pg);
    }*/

    if( pg.pagamento.tipo === 'credito' ){
      this.startCredito(pg);
    }
  }
  
  
  startBoleto(pg: PG){
    this.loading = true;
    this.passo = 4;
    const compra = {...pg, ...{cart: this.cart}, ...{session: this.session}};
    this.pagSeguroService.post(compra).subscribe((response: any) => {
      this.retornoTransacao = response;
      this.passo = 5;
      localStorage.removeItem(environment.cartStorage);
      localStorage.removeItem(environment.templateStorage);
      this.loading = false;
    }, error => { this.passo = 6; this.loadingOFF(); });
  }

  /*startDebito(pg: PG){
    this.loading = true;
    this.pagSeguroService.post(pg).subscribe(
      (response: any) => {
        console.log('pagamento debito', response );
        this.loadingOFF();
        this.retornoTransacao = this.tipo;
        this.responseDebito = (response.complemento != null)? response.complemento : new RetornoPG();
        this.responseDebito.mensagem = response.mensagem;
        this.responseDebito.status = response.status;
        if( this.responseDebito.link != '' ){
          window.location.href = this.responseDebito.link;
        }
      }
    )
  }*/

  startCredito(pg: PG) {
    this.loading = true;
    this.passo = 4;
    const compra = {...pg, ...{cart: this.cart}, ...{session: this.session}};    
    this.pagSeguroService.post(compra).subscribe((response: any) => {
      console.log('startCredito', response);      
      this.retornoTransacao = response;
      this.passo = 5;
      this.loading = false;
      localStorage.removeItem(environment.cartStorage);
      localStorage.removeItem(environment.templateStorage);
    }, error => { this.passo = 6; this.loadingOFF(); });
  }

  toPage(page) {
    this.router.navigate([`${page}`]);
  }

}
