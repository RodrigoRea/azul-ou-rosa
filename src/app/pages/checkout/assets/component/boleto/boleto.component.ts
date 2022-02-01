import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { Input } from '@angular/core';
import { Cartao, Dados, PG } from '../../../checkout';

declare var PagSeguroDirectPayment: any;

@Component({
  selector: 'app-boleto',
  templateUrl: './boleto.component.html',
  styleUrls: ['./boleto.component.css']
})
export class BoletoComponent implements OnInit {

  loading: boolean = false;
  @Input() dados = new Dados();
  @Input() quantidade: number;

  @Output() finalizar = new EventEmitter<PG>();

  _valor: number; 
  get valor(): number { return this._valor; }     
  @Input() set valor(valor: number){ 
    this._valor = valor;
  }

  constructor(
    private zone: NgZone,
  ) { 
    window['angularComponentRef'] = {
      zone: this.zone, 
      componentFn: (fn: Function) => fn(), 
      component: this
    };
  }

  ngOnInit() {
    this.loading = true;
    this.setHash();
  }

  setHash(){
    let self = this;
    PagSeguroDirectPayment.onSenderHashReady((response: any) => {
      
      //response['senderHash']; //Hash estará disponível nesta variável.
      window['angularComponentRef'].zone.run(() => {
        window['angularComponentRef'].componentFn( ()=> {
          setTimeout(() => {
            if( response && response.senderHash ){
              self.finalizacao(response.senderHash, self); 
            }
            if( response && response.status === 'error' || response === undefined ){
              self.errorPagSeguroConn(self);
            }
          });  
        });
      });
    });
  }

  finalizacao(hash: string, self: any){
    let pg = new PG();
    self.dados.quantidade = self.quantidade;
    pg.dados = self.dados;
    pg.hash = hash;

    pg.pagamento = new Cartao();
    pg.pagamento.tipo = 'boleto';
    self.loading = false;
    setTimeout(() => { self.finalizar.emit(pg); });
    
  }

  errorPagSeguroConn(self: any){
    self.loading = false; 
    alert('Falha na conexão com nossos serviços de pagamento! Por favor, tente novamente');
    self.router.navigate(['/convites']);
  }
}
