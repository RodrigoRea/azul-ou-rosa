import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmacaoService } from 'src/app/_services/confirmacao.service';

@Component({
  selector: 'app-confirmacao',
  templateUrl: './confirmacao.page.html',
  styleUrls: ['./confirmacao.page.scss'],
})
export class ConfirmacaoPage implements OnInit {

  total_resposta: number = 0;
  total_adultos: number = 0;
  total_criancas: number = 0;
  total_pessoas: number = 0;

  loading: boolean = false;
  pedido_item_id: any | undefined;
  list: any[] = [] as any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private confirmacaoService: ConfirmacaoService
  ) { }

  ngOnInit() {
    this.pedido_item_id = this.activatedRoute.snapshot.paramMap.get('pedido_item_id');
    
    if( this.pedido_item_id ){
      this.getConfirmacao();
    }
  }

  getConfirmacao(){
    this.list = [];
    this.loading = true;
    this.confirmacaoService.get(this.pedido_item_id).subscribe((res:any) => {
      if( res ){
        this.list = res;
        this.countPeople();
      }
      this.loading = false;
    }, error => { this.loading = false; })
  }

  countPeople(){
    this.total_resposta   = 0;
    this.total_adultos    = 0;
    this.total_criancas   = 0;
    this.total_pessoas    = 0;
    if(this.list && (this.list).length > 0 ){
      for(let i = 0; i < (this.list).length; i++){
        const row = this.list[i];
        if( row.presenca === 'S' ){
          this.total_adultos  += (row.adulto)   ? +row.adulto:  0;
          this.total_criancas += (row.crianca)  ? +row.crianca: 0;
        }
      }
      this.total_resposta = (this.list).length;
      this.total_pessoas    = this.total_adultos + this.total_criancas;
    }
  }
}
