import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITemplate } from 'src/app/_interfaces';
import { PedidoService } from 'src/app/_services/pedido.service';

declare var $: any;
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

  openModal(){
    this.isOpenModal = true;
    $(`#${this.$ID}`).modal('show');
  }

  closeModal(){
    this.isOpenModal = false;
    this.currentText = '';
    this.currentInput = '';
    $(`#${this.$ID}`).modal('hide');
  }

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
            this.template = res.item;
          }
          this.loading = false
        }, error => this.loading = false);
      }
    });
  }

  toEdit(input: string){    
    this.currentInput = `${input}`
    this.currentText = this.template[`${input}`];
    this.openModal();
  }

  updateCurrentText(){
    // this.currentText = (this.currentText).replace(/\s/g,'\n');
    console.log('currentInput', this.currentText);
    this.template[`${this.currentInput}`] = this.currentText;
    this.closeModal();
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
