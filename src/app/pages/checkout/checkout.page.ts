import { Component, NgZone, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dados, Metodos, PayG, PG, RetornoPG } from './checkout';
import { PagSeguroService } from 'src/app/_services/pagseguro.service';
import { Router } from '@angular/router';

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

  pgSeguroURL = PayG.pgSeguroURL;
  tipo: string = '';

  dados = new Dados();

  responseBoleto = new RetornoPG();
  responseCredito = new RetornoPG();
  responseDebito = new RetornoPG();
  retornoTransacao: any = '';

  constructor(
    private zone: NgZone,
    private router: Router,
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
    this.importScript();
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
  }

  setTotal(){
    let total = 0;
    if( this.cart && (this.cart).length > 0 ){
      for(let i = 0; i < (this.cart).length; i++ ){
        total += +(this.cart[i].produto.valor);
      }
    }
    this.valor_total = total;
  }

  importScript(){
    new Promise((resolve) => {
      let script: HTMLScriptElement = document.createElement('script');
      script.addEventListener('load', r => { this.getSession() });
      script.src = (environment.production) ? PayG.jsProducao : PayG.jsSandbox;
      script.id = 'pg-seguro-js';
      script.type = 'text/javascript';
      document.head.appendChild(script);
    });
  }

  getSession(){
    this.loading = true;
    // this.getSession();
    this.pagSeguroService.get().subscribe((res: any) => {
      if( res && res.session ){
        this.session = res.session;
        this.setSessionID();          
      }
      this.loading = false;
    }, error => this.loading = true );
  }

  setSessionID(){
    console.log('session', this.session);
    setTimeout(() => {
      if( this.session !== "" ){
        PagSeguroDirectPayment['setSessionId'](this.session);
        setTimeout(() => { this.getMetodos(); }, 300);
      }else{
        this.setSessionID();
      }
    }, 100);
  }

  getMetodos(){
    const self = this;
    console.log('getPaymentMethods');
    PagSeguroDirectPayment['getPaymentMethods']({
      amount: this.valor_total,
      success: (response: any) => self.setMetodos(response),
      error: function(response) {
          // Callback para chamadas que falharam.
      },
      complete: function(response) {
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

      window['angularComponentRef'].zone.run(() => {
        window['angularComponentRef'].componentFn( ()=>{this.showMetodos = true} );
      });

      console.log(metodos);
      console.log('Boleto', this.mBoleto);
      console.log('Credito', this.mCredito);
      console.log('Debito', this.mDebito);

    }
  }


  setDados(dados: Dados){
    this.dados = dados;
    this.passo = (dados.voltar) ? (this.passo - 1) : (this.passo + 1);
  }


  enviarDadosDePagamento(pg: PG){
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
    const compra = {...pg, ...{cart: this.cart}};
    this.pagSeguroService.post(compra).subscribe((response: any) => {
      this.loading = false;
      this.retornoTransacao = response;
      this.passo = 5;
      localStorage.removeItem(environment.cartStorage);
    }, error => { this.loading = false; this.passo = 6; });
  }

  /*startDebito(pg: PG){
    this.loading = true;
    this.pagSeguroService.post(pg).subscribe(
      (response: any) => {
        console.log('pagamento debito', response );
        this.loading = false;
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
    const compra = {...pg, ...{cart: this.cart}};    
    this.pagSeguroService.post(compra).subscribe((response: any) => {
      this.loading = false;
      this.retornoTransacao = response;
      this.passo = 5;
      localStorage.removeItem(environment.cartStorage);
    }, error => { this.loading = false; this.passo = 6; });
  }

  toPage(page) {
    this.router.navigate([`${page}`]);
  }

}
