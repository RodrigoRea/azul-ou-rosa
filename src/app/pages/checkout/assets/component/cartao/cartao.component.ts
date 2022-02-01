import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { NgZone } from '@angular/core';
import { Bin, Cartao, Dados, Metodos, PG } from '../../../checkout';
import { PagSeguroService } from 'src/app/_services/pagseguro.service';

declare var PagSeguroDirectPayment: any;

class Parcela{
  quantity: number;
  installmentAmount: number;
  totalAmount: number;
  interestFree: boolean;
}

class CartaoParcelas{
  parcela: Array<Parcela>;
  bandeira: string;
}

class ResponseParcelas{
  error: boolean;​
  installments: Array<any>;
}

declare var $:any;
@Component({
  selector: 'app-cartao',
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.css']
})
export class CartaoComponent implements OnInit, AfterViewChecked {

  loading: boolean = false;
  pgSeguroURL = 'https://stc.pagseguro.uol.com.br';
  senderHash: string = '';

  MaskValidade = [/[0-1]/, /[0-9]/, '/', /[2]/, /[0-0]/, /[1-9]/, /[0-9]/];
  MaskCartao = [/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,' ',/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,' ',/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,' ',/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,' ',/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/];
  MaskCVV = [/[0-9]/, /[0-9]/,/[0-9]/, /[0-9]/];

  MaskANO = [/[2]/, /[0]/,/[1-9]/, /[0-9]/];
  MaskMES = [/[0-3]/, /[0-9]/];

  formulario: FormGroup;
  valorparcelado: number;

  _valor: number;
  get valor(): number { return this._valor; }
  @Input() set valor(valor: number){
    this._valor = valor;
    this.getParcelamento(this._valor);
  }

  @Input() tipo: string;
  @Input() dados = new Dados();
  @Input() mDebito = new Array<Metodos>();
  @Input() quantidade: number = 1;
  @Output() evento = new EventEmitter<Dados>();

  cartaoParcelas = new Array<CartaoParcelas>();

  @Output() finalizar = new EventEmitter<PG>();

  bandeiras = new Array<string>();
  bandeira: string;

  parcelas = new ResponseParcelas();
  parcela = new Array<Parcela>();

  token: string;
  maxInstallmentNoInterest: number = 0;

  meses: string[] = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  anos: any = [];
  YYYY: number;

  constructor(
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private pagSeguroService: PagSeguroService
  ) {
    window['angularComponentRef'] = {
      zone: this.zone,
      componentFn: (fn: Function) => fn(),
      component: this
    };
  }

  ngOnInit() {
    this.token = '';
    this.bandeira = '';
    this.parcelas = new ResponseParcelas();
    this.maxInstallmentNoInterest = 0;

    this.YYYY = new Date().getFullYear();
    let j=0;
    for( let i = (this.YYYY); i<=(this.YYYY+15); i++ ){
      this.anos[j++] = i;
    }

    this.formulario = this.formBuilder.group({
      cardnumber: ['', [Validators.required, Validators.minLength(19)/*,CreditCardValidator.validateCCNumber*/]],
      name: ['', [Validators.required, Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4),Validators.pattern('^([0-9]*)$')]],
      mes: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(2)]],
      ano: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(4)]],
      installments: [1,[Validators.min(1), Validators.max(18)]],
      brand: ['', [Validators.required]],
      banco: [''],
      tipo: [''],
      valorparcelado: ['']
    });


    if( this.tipo === 'credito' ){
      this.getMaxInstallmentNoInterest();
    }
  }

  ngAfterViewChecked(){
    $(document).setMask();
  }

  getMaxInstallmentNoInterest(){
    this.pagSeguroService.mini().subscribe((res: any)=>{
        if(res && res.max_installment_no_interest){
          this.maxInstallmentNoInterest = +(res.max_installment_no_interest);
          this.getParcelamento(this._valor);
        }
      }
    );
  }


  getParcelamento(valor: number){
    let self = this;
    let MaxParcSemJuros: any = (this.maxInstallmentNoInterest === 0) ? undefined : this.maxInstallmentNoInterest;
    PagSeguroDirectPayment.getInstallments({
        amount: valor,
        maxInstallmentNoInterest: MaxParcSemJuros,
        //brand: 'visa',
        success: (response: ResponseParcelas)=>{
          // Retorna as opções de parcelamento disponíveis
          window['angularComponentRef'].zone.run(() => {
            window['angularComponentRef'].componentFn( ()=>{ self.setParcelas(response, self); } );
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
        complete: function(response){
            // Callback para todas chamadas.
        }
    });
  }

  setParcelas(parcelas:ResponseParcelas, self: any){
    self.bandeiras = new Array<string>();
    if( !parcelas.error ){
      for( const key in parcelas.installments ){
        (self.bandeiras).push(key);
      }
      self.parcelas = parcelas;
      console.log('bandeiras', self.bandeiras );
      console.log('parcelas', self.parcelas );
    }
  }

  validaCartao(cartao: string){
    // validar cartao e bandeira
    const c = (cartao).replace(/[^\d]+/g,'');
    if( (c).length < 2 ){
      this.bandeira = '';
    }
    if( (c).length > 5 ){
      this.getBandeira(c);
    }

    if( cartao && ((cartao).length > 15) ){
      let mask = '';
      let count = 0;
      for(let i = 0; i < (cartao).length; i++){
        count++;
        mask += cartao[i];
        if(count === 4 && i < (cartao).length){
          mask += ' ';
          count = 0;
        }
      }
      this.formulario.get('cardnumber').setValue((mask).trim());
    }

    if( this.tipo === 'credito' ){
      if( (c).length === 0 ){
        this.parcela = new Array<Parcela>();
      }
    }
  }

  getBandeira( card: string ){
    let self = this;
    const bin = card.substr(0,6);
    // console.log( bin );
    PagSeguroDirectPayment.getBrand({
      cardBin: bin,
      success: (response: Bin) => {
        window['angularComponentRef'].zone.run(() => {
          window['angularComponentRef'].componentFn( ()=> { self.setBandeira(response); });
        });
      },
      error: function(response) {
        window['angularComponentRef'].zone.run(() => {
          window['angularComponentRef'].componentFn( ()=>{ self.errorPagSeguroConn(self); });
        });
        //tratamento do erro
      },
      complete: function(response) {
        //tratamento comum para todas chamadas
      }
    });
  }

  setBandeira(response: Bin){
    this.bandeira = response.brand.name;
    this.formulario.get('brand').setValue(this.bandeira);
    if( this.tipo === 'credito' ){
      this.parcela = this.parcelas.installments[this.bandeira];
      this.setQtdParcela(1);
    }
  }

  getCardToken(){
    let self = this;
    this.loading = true;
    const cartao = (`${this.formulario.get('cardnumber').value}`).replace(/[^\d]+/g,'');
    const bandeira = (`${this.formulario.get('brand').value}`).replace(/[^\d]+/g,'');
    const cvv = (`${this.formulario.get('cvv').value}`).replace(/[^\d]+/g,'');
    const mes = (`${this.formulario.get('mes').value}`).replace(/[^\d]+/g,'');
    const ano = (`${this.formulario.get('ano').value}`).replace(/[^\d]+/g,'');

    PagSeguroDirectPayment.createCardToken({
      cardNumber: cartao, // Número do cartão de crédito
      brand: bandeira, // Bandeira do cartão
      cvv: cvv, // CVV do cartão
      expirationMonth: mes, // Mês da expiração do cartão
      expirationYear: ano, // Ano da expiração do cartão, é necessário os 4 dígitos.
      success: (response: any) => {
        window['angularComponentRef'].zone.run(() => {
          window['angularComponentRef'].componentFn( ()=> { self.setCardToken(response, self); });
        });
      },
      error: (response) => {
        window['angularComponentRef'].zone.run(() => {
          window['angularComponentRef'].componentFn( ()=>{ self.setNoToken(self); });
        });
      },
      complete: function(response) {
           // Callback para todas chamadas.
      }
   });
  }

  setNoToken(self){
    self.loadingOFF();
    self.token = '';
    self.formulario.get('token').setValue(self.token);
  }

  setCardToken(response: any, self: any){
    if( response['card'] !== undefined ){
      self.token = response['card']['token'];
      self.formulario.get('tipo').setValue(self.tipo);
      self.setHash();
    }
  }

  setHash(){
    let self = this;
    this.senderHash = '';
    PagSeguroDirectPayment.onSenderHashReady((response: any) => {
      if(response['status'] === 'error') {
        window['angularComponentRef'].zone.run(() => {
          window['angularComponentRef'].componentFn( ()=> { self.errorPagSeguroConn(self); });
        });
        return false;
      }
      self.senderHash = response['senderHash'];
      //response['senderHash']; //Hash estará disponível nesta variável.
      self.finalizacao(response['senderHash'], self);
    });
  }

  setQtdParcela(n: any){
    let qtdParcelas: number = 0;
    if( typeof n === 'string' ){
      qtdParcelas = parseInt(n);
    }else{
      qtdParcelas = n;
    }
    this.valorparcelado = 0;
    for( let key in this.parcela ){
      if( qtdParcelas === this.parcela[key].quantity ){
        this.valorparcelado = this.parcela[key].installmentAmount;
        return this.valorparcelado;
      }
    }
  }

  finalizacao(hash: string, self: any){
    self.loadingOFF();
    let pg = new PG();
    pg.dados     = self.dados;
    self.dados.quantidade = self.quantidade;
    pg.pagamento = self.formulario.value as Cartao;
    pg.hash = hash;
    pg.pagamento.tipo = self.tipo;
    pg.cardToken = self.token;
    pg.pagamento.valorparcelado = self.valorparcelado;
    self.finalizar.emit(pg);
  }

  back(){
    this.dados.voltar = true;
    this.evento.emit( this.dados );
  }

  submit(){
    if( this.formulario.valid ){
      this.getCardToken();
    }
  }

  loadingOFF(){
    this.loading = false; 
  }

  errorPagSeguroConn(self: any){
    self.loading = false; 
    alert('Falha na conexão com nossos serviços de pagamento! Por favor, tente novamente');
    self.router.navigate(['/convites']);
  }
}
