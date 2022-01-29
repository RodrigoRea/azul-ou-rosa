import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/_services/pedido.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meus-pedidos',
  templateUrl: './meus-pedidos.page.html',
  styleUrls: ['./meus-pedidos.page.scss'],
})
export class MeusPedidosPage implements OnInit {

  loading: boolean = false;
  pedidos: any[] = [] as any[];

  constructor(
    private pedidoService: PedidoService,
    private router: Router
  ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.getPedidos();
  }

  getPedidos(){
    this.pedidos = [];
    this.loading = true;
    this.pedidoService.get().subscribe((res)=>{
      if(res && (res).length > 0){
        this.pedidos = res;
      }
      this.loading = false;
    }, error=>{ this.loading = false; });
  }

  editar(item){
    this.toPage(`/meus-pedidos/produto/${item.pedido_id}/${item.pedido_item_id}`);
  }

  toPage(page) {
    this.router.navigate([`${page}`]);
  }
}
