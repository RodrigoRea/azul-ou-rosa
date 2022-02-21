import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ITemplate } from 'src/app/_interfaces';
import { environment } from 'src/environments/environment';
import { TemplateService } from './../../../_services/template.service';

declare var $: any;
@Component({
  selector: 'app-produto',
  templateUrl: './produto.page.html',
  styleUrls: ['./produto.page.scss'],
})
export class ProdutoPage implements OnInit {

  phtml: string = '';

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
    private templateService: TemplateService
  ) { }

  ionViewWillEnter(){
    this.produto = this.getInviteSelected();
    this.getInviteTemplate();    
  }

  ngOnInit() {    
  }

  getInviteSelected(){
    let produto: any = localStorage.getItem(environment.cartStorage);
    try {
      produto = ( produto ) ? JSON.parse(atob(produto)) : undefined;
    } catch (error) {
      this.router.navigate(['convites']);
      produto = {};
    }
    return produto;
  }

  getInviteTemplateStorage(template_id: any): any{
    let templates: any = localStorage.getItem(environment.templateStorage);
    try {
      templates = ( templates ) ? JSON.parse(atob(templates)) : undefined;
    } catch (error) {
      templates = undefined;
    }
    if( templates && (templates).length > 0 ){
      for(let i = 0; i < (templates).length; i++){
        const template = templates[i];
        if( template && template.invite && template.invite.template_id ){
          if( `${template.invite.template_id}` === `${template_id}` ){
            return template.invite;
          }
        }
      }
    }
    return undefined;
    
  }

  getInviteTemplate(){
    this.template = undefined;
    if( this.produto.template_id ){
      this.loading = true;

      const template = this.getInviteTemplateStorage(this.produto.template_id);
      if( template && template.template_id ){
        this.template = template;
        this.template['in_cart'] = true;
        setTimeout(() => { this.loading = false },1000);
        return;
      }
      this.templateService.get(this.produto.template_id).subscribe((res:any)=>{
        if(res){
          this.template = res;
        }
        this.loading = false
      }, error => this.loading = false);
    }
  }
   

  gravar(){

    const cart = [{
      produto: this.produto,
      invite: this.template
    }]
    console.log('gravar', cart);
    localStorage.setItem(environment.cartStorage, btoa(JSON.stringify(cart)));
    localStorage.setItem(environment.templateStorage, btoa(JSON.stringify(cart)));
    setTimeout(() => {
      this.router.navigate([`checkout`]);
    });
  }

  toPage(page) {
    this.router.navigate([`${page}`]);
  }

  
}
