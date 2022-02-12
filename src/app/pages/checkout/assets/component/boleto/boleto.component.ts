import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { Input } from '@angular/core';
import { Cartao, Dados, PG } from '../../../checkout';
import { Router } from '@angular/router';

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
    private router: Router
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
    PagSeguroDirectPayment.onSenderHashReady((response: any) => {
      
      //response['senderHash']; //Hash estará disponível nesta variável.
      window['angularComponentRef'].zone.run(() => {
        window['angularComponentRef'].componentFn( ()=> {
          setTimeout(() => {
            if( response && response.senderHash ){
              this.finalizacao(response.senderHash); 
            }
            if( response && response.status === 'error' || response === undefined ){
              this.errorPagSeguroConn();
            }
          });  
        });
      });
    });
  }

  finalizacao(hash: string ){
    let pg = new PG();
    this.dados.quantidade = this.quantidade;
    pg.dados = this.dados;
    pg.hash = hash;

    pg.pagamento = new Cartao();
    pg.pagamento.tipo = 'boleto';
    this.loading = false;
    setTimeout(() => { this.finalizar.emit(pg); });
    
  }

  errorPagSeguroConn(){
    this.loading = false; 
    alert('Falha na conexão com nossos serviços de pagamento! Por favor, tente novamente');
    this.router.navigate(['/convites']);
  }
}
