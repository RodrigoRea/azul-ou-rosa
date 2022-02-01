import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ITemplate } from 'src/app/_interfaces';

declare var $: any;

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss'],
})
export class EditTemplateComponent implements OnInit {

  isOpenModal: boolean = false;

  type: string = '';

  phtml: string = '';
  currentInput: string = '';
  currentText: string = '';

  @Input() template: ITemplate | undefined;
  @Output() templateChange = new EventEmitter<ITemplate>();
  
  local: any | undefined;

  constructor(
  ) { }

  ngOnInit() {    

    setTimeout(() => {
      console.log('EditTemplateComponent template', this.template);
      const phtml = atob(`${this.template.phtml}`);
      $("#invite-model").html(phtml);
      setTimeout(() => {
        this.startActionsTemplateMode();
      });
    });    

  }

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

  startActionsTemplateMode(){
    $("[id^=t-]").click((elem: any)=>{
      if( elem && elem.target && elem.target.id ){
        const ID = (`${elem.target.id}`).replace('t-','');
        this.toEdit(`${ID}`);
      }
    })
  }

  toEdit(input: string){ 
    this.local = new Object();
    this.type = '';   
    this.currentInput = `${input}`;
    this.currentText = this.template[`${input}`]; 
    
    switch (this.currentInput) {
      case 'data': this.type = 'date'; break;
      case 'hora': this.type = 'time'; break;
      case 'cep':
      case 'endereco':
      case 'numero':
      case 'bairro':
      case 'cidade':
      case 'estado': this.type = 'local'; break;
      default:     this.type = 'text'; break;
    }

    
    if( this.type === 'local' ){
      this.local['endereco']     = $(`#t-endereco`).text();
      this.local['numero']       = $(`#t-numero`).text();
      this.local['bairro']       = $(`#t-bairro`).text();
      this.local['complemento']  = $(`#t-complemento`).text();
      this.local['cidade']       = $(`#t-cidade`).text();
      this.local['estado']       = $(`#t-estado`).text();
      this.local['cep']          = $(`#t-cep`).text();
    }

    if( this.currentInput == 'data' ){
      this.type = 'date';
    }
    
    this.openModal();
  }

  updateCurrentText(){

    if( this.type === 'local' ){
      this.template.endereco    = this.local['endereco'];
      this.template.numero      = this.local['numero'];
      this.template.bairro      = this.local['bairro'];
      this.template.complemento = this.local['complemento'];
      this.template.cidade      = this.local['cidade'];
      this.template.estado      = this.local['estado'];
      this.template.cep         = this.local['cep'];

      for (const key in this.local) {
        let txt                 = this.local[`${key}`]
        this.template[`${key}`] = txt;
        $(`#t-${key}`).html((txt).replace(/\n/g,'<br/>')); 
      }
      this.closeModal();
      return;
    }

    // this.currentText = (this.currentText).replace(/\s/g,'\n');
    console.log('currentInput', this.currentText);
    this.template[`${this.currentInput}`] = this.currentText;
    const txt = (this.currentText).replace(/\n/g,'<br/>');
    $(`#t-${this.currentInput}`).html(txt); 
    
    this.closeModal();
  }

  


}
