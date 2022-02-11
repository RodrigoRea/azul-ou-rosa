import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/_services/pedido.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meus-pedidos',
  templateUrl: './meus-pedidos.page.html',
  styleUrls: ['./meus-pedidos.page.scss'],
})
export class MeusPedidosPage implements OnInit {

  show: boolean = false;
  loading: boolean = true;
  pedidos: any[] = [] as any[];

  constructor(
    private pedidoService: PedidoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.show = false;
  }

  ionViewWillEnter(){
    this.show = false;
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
      this.show = true;
    }, error=>{ this.loading = false; this.show = true; });
  }

  editar(item){
    this.toPage(`/meus-pedidos/produto/${item.pedido_id}/${item.pedido_item_id}`);
  }

  toPage(page) {
    this.router.navigate([`${page}`]);
  }

  pedido_id: any = '';
  getTransaction(item){
    this.pedido_id = item.pedido_id;
    this.loading = true;
    this.pedidoService.getTransaction(`${item.pedido_id}`).subscribe((res:any)=>{
      console.log('transacao', res);
      if( res && res.status ){
        if(item.status === res.status){
          // alert('Esta transação ainda não foi processada! Por favor, aguarde ou tente mais tarde.');
        }
        item.status = res.status;
      }
      this.loading = false;
    }, error=> this.loading = false);
  }

  timeout: any | undefined;
  show_copy: boolean = false;
  cod_site: string = '';
  copylink(item){
    if( this.timeout ){ clearTimeout(this.timeout); }
    this.cod_site = item.cod_site;
    this.show_copy = true;
    const link = `https://convite.mybabeis.com.br/invite/${item.cod_site}`;
    this.copiarTexto(link);
    this.timeout = setTimeout(() => {
      this.show_copy = false;
    },3000);
  }

  copiarTexto(text) {
    let sampleTextarea: any = document.createElement("textarea");
    document.body.appendChild(sampleTextarea);
    sampleTextarea.value = text; //save main text in it
    sampleTextarea.select(); //select textarea contenrs
    document.execCommand("copy");
    document.body.removeChild(sampleTextarea);
  }

  loading_active: boolean = false;
  toActive(active: boolean, item: any){
    this.loading_active = true;
    this.pedidoService.setActive(item.pedido_id, item.pedido_item_id, active).subscribe((res:any) => {
      if( res ){
        if(active){
          item.ativo = 'S';
        }else{
          item.ativo = 'N';
        }
      }
      this.loading_active = false;
    }, error => { this.loading_active = false; });

    
  }
}
