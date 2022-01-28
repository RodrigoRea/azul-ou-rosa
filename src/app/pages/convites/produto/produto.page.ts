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

  loading: boolean = false;
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

  openModal(){
    this.isOpenModal = true;
    $(`#edit-text`).modal('show');
  }

  closeModal(){
    this.isOpenModal = false;
    this.currentText = '';
    this.currentInput = '';
    $(`#edit-text`).modal('hide');
  }

  ngOnInit() {
    this.produto = this.getInviteSelected();
    this.getInviteTemplate();
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

  getInviteTemplate(){
    this.template = undefined;
    if( this.produto.template_id ){
      this.loading = true;
      this.templateService.get(this.produto.template_id).subscribe((res:any)=>{
        if(res){
          this.template = res;
        }
        this.loading = false
      }, error => this.loading = false);
    }
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

    const cart = [{
      produto: this.produto,
      invite: this.template
    }]
    console.log('gravar', cart);
    localStorage.setItem(environment.cartStorage, btoa(JSON.stringify(cart)));
    setTimeout(() => {
      this.router.navigate([`checkout`]);
    });
  }

  toPage(page) {
    this.router.navigate([`${page}`]);
  }
}
