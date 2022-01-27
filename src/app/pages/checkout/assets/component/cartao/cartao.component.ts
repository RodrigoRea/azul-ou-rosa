import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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


@Component({
  selector: 'app-cartao',
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.css']
})
export class CartaoComponent implements OnInit {

  pgSeguroURL = 'https://stc.pagseguro.uol.com.br';


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
    let MaxParcSemJuros: any = (this.maxInstallmentNoInterest === 0) ? undefined : this.maxInstallmentNoInterest;
    PagSeguroDirectPayment['getInstallments']({
        amount: valor,
        maxInstallmentNoInterest: MaxParcSemJuros,
        //brand: 'visa',
        success: (response: ResponseParcelas)=>{
            // Retorna as opções de parcelamento disponíveis
            window['angularComponentRef'].zone.run(() => {
              window['angularComponentRef'].componentFn( ()=>this.setParcelas(response));
            });
        },
        error: function(response) {
          console.log('erro na busca das parcelas');
            // callback para chamadas que falharam.
        },
        complete: function(response){
            // Callback para todas chamadas.
        }
    });
  }

  setParcelas(parcelas:ResponseParcelas){
    this.bandeiras = new Array<string>();
    if( !parcelas.error ){
      for( const key in parcelas.installments ){
        (this.bandeiras).push(key);
      }
      this.parcelas = parcelas;
      console.log( this.bandeiras );
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
      console.log( c );
    }

    if( this.tipo === 'credito' ){
      if( (c).length === 0 ){
        this.parcela = new Array<Parcela>();
      }
    }
  }

  getBandeira( card: string ){
    const bin = card.substr(0,6);
    console.log( bin );
    PagSeguroDirectPayment['getBrand']({
      cardBin: bin,
      success: (response: Bin) => {
        window['angularComponentRef'].zone.run(() => {
          window['angularComponentRef'].componentFn( ()=>this.setBandeira(response));
        });
      },
      error: function(response) {
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

    const cartao = (`${this.formulario.get('cardnumber').value}`).replace(/[^\d]+/g,'');
    const bandeira = (`${this.formulario.get('brand').value}`).replace(/[^\d]+/g,'');
    const cvv = (`${this.formulario.get('cvv').value}`).replace(/[^\d]+/g,'');
    const mes = (`${this.formulario.get('mes').value}`).replace(/[^\d]+/g,'');
    const ano = (`${this.formulario.get('ano').value}`).replace(/[^\d]+/g,'');

    PagSeguroDirectPayment['createCardToken']({
      cardNumber: cartao, // Número do cartão de crédito
      brand: bandeira, // Bandeira do cartão
      cvv: cvv, // CVV do cartão
      expirationMonth: mes, // Mês da expiração do cartão
      expirationYear: ano, // Ano da expiração do cartão, é necessário os 4 dígitos.
      success: (response: any) => {
        window['angularComponentRef'].zone.run(() => {
          window['angularComponentRef'].componentFn( ()=>this.setCardToken(response));
        });
      },
      error: (response) => {
        window['angularComponentRef'].zone.run(() => {
          window['angularComponentRef'].componentFn( ()=>this.setNoToken(response));
        });
      },
      complete: function(response) {
           // Callback para todas chamadas.
      }
   });
  }

  setNoToken(response){
    this.token = '';
    this.formulario.get('token').setValue(this.token);
    alert('Dados do cartão incorreto');
  }

  setCardToken(response: any){
    if( response['card'] !== undefined ){
      this.token = response['card']['token'];
      this.formulario.get('tipo').setValue(this.tipo);
      this.setHash();
    }
  }

  setHash(){
    PagSeguroDirectPayment['onSenderHashReady']((response: any) => {
      if(response['status'] === 'error') {
          alert(response['message']);
          return false;
      }
      //response['senderHash']; //Hash estará disponível nesta variável.
      this.finalizacao(response['senderHash']);
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

  finalizacao(hash: string){
    let pg = new PG();
    pg.dados     = this.dados;
    this.dados.quantidade = this.quantidade;
    pg.pagamento = this.formulario.value as Cartao;
    pg.hash = hash;
    pg.pagamento.tipo = this.tipo;
    pg.cardToken = this.token;
    pg.pagamento.valorparcelado = this.valorparcelado;
    this.finalizar.emit(pg);
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

}
