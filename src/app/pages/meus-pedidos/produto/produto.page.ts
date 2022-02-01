import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITemplate } from 'src/app/_interfaces';
import { PedidoService } from 'src/app/_services/pedido.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.page.html',
  styleUrls: ['./produto.page.scss'],
})
export class ProdutoPage implements OnInit {

  $ID: string = 'edit-invite-text';

  pedido_id: string = '';
  item_id: string = '';
  loading: boolean = false;
  pedido: any | undefined;
  template: ITemplate | undefined;
  produto: any = undefined as any;

  modeEdit: boolean = false;
  isOpenModal: boolean = false;

  currentText: string = '';
  currentInput: string = '';

  constructor(
    private router: Router,
    private pedidoService: PedidoService,
    private activatedRoute: ActivatedRoute
  ) { }

  
  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.pedido_id = this.activatedRoute.snapshot.paramMap.get('pedido_id');
    this.item_id = this.activatedRoute.snapshot.paramMap.get('item_id');
    this.getInvite();
  }


  getInvite(){
    setTimeout(() => {
      this.template = undefined;
      if( this.pedido_id && this.item_id ){
        this.loading = true;
        this.pedidoService.getItem(this.pedido_id, this.item_id).subscribe((res:any)=>{
          if(res && res.item){
            this.pedido = res;
            this.template = this.pedido.item;
          }
          this.loading = false
        }, error => this.loading = false);
      }
    });
  }


  gravar(){
    this.loading = true;
    console.log('this.template', this.template);
    this.pedidoService.post(this.pedido_id,this.item_id, this.template).subscribe((res: any)=>{
      if(res && res.status === 201){
        this.toPage('/meus-pedidos/editado');
      }
      this.loading = false;
    }, error=>{ this.loading = false; });
  } 

  toPage(page) {
    this.router.navigate([`${page}`]);
  }
}
