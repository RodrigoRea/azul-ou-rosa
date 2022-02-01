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
    this.type = '';   
    this.currentInput = `${input}`;
    this.currentText = this.template[`${input}`]; 
    
    switch (this.currentInput) {
      case 'data': this.type = 'date'; break;
      case 'hora': this.type = 'time'; break;
      default:     this.type = 'text'; break;
    }

    if( this.currentInput == 'data' ){
      this.type = 'date';
    }
    
    this.openModal();
  }

  updateCurrentText(){
    // this.currentText = (this.currentText).replace(/\s/g,'\n');
    console.log('currentInput', this.currentText);
    this.template[`${this.currentInput}`] = this.currentText;
    const txt = (this.currentText).replace(/\n/g,'<br/>');
    $(`#t-${this.currentInput}`).html(txt); 
    
    this.closeModal();
  }

  


}
