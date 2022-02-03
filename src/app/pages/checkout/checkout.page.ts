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
    let self = this;
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
      this.errorPagSeguroConn(self);
    })
       
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

  importScript():Promise<any>{
  return new Promise((resolve, reject) => {
      let script: HTMLScriptElement = document.createElement('script');
      script.addEventListener('load', r => { 
        this.getSession();
        resolve(true);
      });
      script.src = (environment.production) ? PayG.jsProducao : PayG.jsSandbox;
      script.id = 'pg-seguro-js';
      script.type = 'text/javascript';
      document.head.appendChild(script);
    });
  }

  errorPagSeguroConn(self: any){
    self.loading = false; 
    alert('Falha na conexão com nossos serviços de pagamento! Por favor, tente novamente');
    self.router.navigate(['/convites']);
  }

  getSession(){
    let self = this;
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
        this.errorPagSeguroConn(self);
      }
    }, error => {
      this.session = '';      
      this.errorPagSeguroConn(self);
    });
  }

  setSessionID(){
    let self = this;
    console.log('session', this.session);
    setTimeout(() => {
      if( this.session !== '' ){
        PagSeguroDirectPayment.setSessionId(this.session);
        setTimeout(() => {
          window['angularComponentRef'].zone.run(() => {
            window['angularComponentRef'].componentFn( ()=>{ self.getMetodos(self); } );
          });
        });        
      }else{
        // this.setSessionID();
      }
    });
  }

  getMetodos(self){
    console.log('getPaymentMethods');
    PagSeguroDirectPayment.getPaymentMethods({
      amount: self.valor_total,
      success: (response: any) => {
        window['angularComponentRef'].zone.run(() => {
          window['angularComponentRef'].componentFn( ()=>{ self.setMetodos(response, self); } );
        });                
      },
      error: (response) => {
        console.log('response', response);
        if(response){          
          window['angularComponentRef'].zone.run(() => {
            window['angularComponentRef'].componentFn( ()=>{ self.errorPagSeguroConn(self); } );
          }); 
        }
      },
      complete: (response) => {
          // Callback para todas chamadas.
      }
    });
  }

  setMetodos(metodos: any, self: any){
    console.log('metodos');
    if( !metodos.error ){
      for( let key in metodos.paymentMethods ){
        if( key === 'BOLETO' ){
          self.mBoleto = metodos.paymentMethods[key]['options'][key];
        }
        if( key === 'BALANCE' ){
          self.mBalance = metodos.paymentMethods[key]['options'][key];
        }
        if( key === 'CREDIT_CARD' ){
          self.mCredito = [];
          const m = metodos.paymentMethods[key]['options'];
          for( const k in m ){
            (self.mCredito).push(m[k]);
          }
        }
        if( key === 'ONLINE_DEBIT' ){
          const m = metodos.paymentMethods[key]['options'];
          for( const k in m ){
            (self.mDebito).push(m[k]);
          }
        }
        if( key === 'DEPOSIT' ){
          const m = metodos.paymentMethods[key]['options'];
          for( const k in m ){
            (self.mDeposito).push(m[k]);
          }
        }
      }

      self.showMetodos = true;

      console.log(metodos);
      console.log('Boleto', self.mBoleto);
      console.log('Credito', self.mCredito);
      console.log('Debito', self.mDebito);
      self.loading = false; 
    }
  }

  loadingOFF(){
    this.loading = false; 
  }

  setDados(dados: Dados){
    this.dados = dados;
    this.passo = (dados.voltar) ? (this.passo - 1) : (this.passo + 1);
  }


  enviarDadosDePagamento(pg: PG){
    let self = this;
    if(pg && pg.pagamento && pg.pagamento.cardnumber && pg.pagamento.cvv){
      let cardnumber = pg.pagamento.cardnumber;
      pg.pagamento.cardnumber = btoa(btoa((cardnumber).replace(/ /g, ";")));

      let cvv = pg.pagamento.cvv;
      pg.pagamento.cvv = btoa(btoa((`${cvv}`).replace(/ /g, ";")));
    }

    console.log('Dados para pagamento', pg);
    // this.passo = 4;   

    if( pg.pagamento.tipo === 'boleto' ){
      self.startBoleto(pg, self);
    }

    /*if( pg.pagamento.tipo === 'debito' ){
      this.startDebito(pg);
    }*/

    if( pg.pagamento.tipo === 'credito' ){
      self.startCredito(pg, self);
    }
  }


  
  startBoleto(pg: PG, self: any){
    self.loading = true;
    self.passo = 4;
    const compra = {...pg, ...{cart: self.cart}};
    self.pagSeguroService.post(compra).subscribe((response: any) => {
      self.retornoTransacao = response;
      self.passo = 5;
      localStorage.removeItem(environment.cartStorage);
      self.loading = false;
    }, error => { self.passo = 6; self.loadingOFF(); });
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

  startCredito(pg: PG, self: any) {
    self.loading = true;
    self.passo = 4;
    const compra = {...pg, ...{cart: self.cart}};    
    self.pagSeguroService.post(compra).subscribe((response: any) => {
      console.log('startCredito', response);      
      self.retornoTransacao = response;
      self.passo = 5;
      self.loading = false;
      localStorage.removeItem(environment.cartStorage);
    }, error => { self.passo = 6; self.loadingOFF(); });
  }

  toPage(page) {
    this.router.navigate([`${page}`]);
  }

}
