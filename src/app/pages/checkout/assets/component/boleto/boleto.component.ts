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
    PagSeguroDirectPayment['onSenderHashReady']((response: any) => {
      if(response['status'] == 'error') {
          console.log(response['message']);
          this.loading = false;
          return false;
      }
      //response['senderHash']; //Hash estará disponível nesta variável.
      window['angularComponentRef'].zone.run(() => {
        window['angularComponentRef'].componentFn( ()=>this.finalizacao(response['senderHash']) );
      });
    });
  }

  finalizacao(hash: string){
    let pg = new PG();
    this.dados.quantidade = this.quantidade;
    pg.dados = this.dados;
    pg.hash = hash;

    pg.pagamento = new Cartao();
    pg.pagamento.tipo = 'boleto';
    this.loading = false;
    setTimeout(() => {
      this.finalizar.emit(pg);
    });
    
  }

}
