import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_auth/auth.service';
import { ITemplate } from 'src/app/_interfaces';

declare var $: any;

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss'],
})
export class EditTemplateComponent implements OnInit, OnDestroy {

  ID: string = '';

  isOpenModal: boolean = false;

  type: string = '';

  phtml: string = '';
  currentInput: string = '';
  currentText: string = '';

  @Input() template: ITemplate | undefined;
  @Output() templateChange = new EventEmitter<ITemplate>();

  @Output() onChange = new EventEmitter<ITemplate>(); 
  
  local: any | undefined;

  show_page: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    
    this.ID = this.authService.generateID();
    console.log('ngOnInit show_page true - sempre cria uma div de edicao de templete nova');
    this.show_page = true;

    setTimeout(() => {
      console.log('EditTemplateComponent template', this.template);
      if( typeof this.template.phtml === 'boolean' && !this.template.phtml ){
        alert("Ops, este convite ainda não está pronto");
        this.router.navigate(['convites']);
        return;
      }
      const phtml = atob(`${this.template.phtml}`); 
      $(`#invite-model-${this.ID}`).html(phtml);
      setTimeout(() => {
        this.startActionsTemplateMode();
      });
    });    

  }


  openModal(){
    this.isOpenModal = true;
    $(`#edit-text-${this.ID}`).modal('show');
    setTimeout(() => {
      $(".modal-body").find('textarea:first-child').focus();
    },100);
  }

  closeModal(){
    this.isOpenModal = false;
    this.currentText = '';
    this.currentInput = '';
    $(`#edit-text-${this.ID}`).modal('hide');
    this.cloneRemoteScript();
    this.createIndicatorEditorMode();
  }

  startActionsTemplateMode(){
    $("[id^=t-]").click((elem: any)=>{
      if( elem && elem.target && elem.target.id ){
        const ID = (`${elem.target.id}`).replace('t-','');
        this.toEdit(`${ID}`);
      }
    });
    this.cloneRemoteScript();
    this.createIndicatorEditorMode();
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
      this.onChange.emit(this.template);
      this.closeModal();
      return;
    }

    // this.currentText = (this.currentText).replace(/\s/g,'\n');
    console.log('currentInput', this.currentText);
    this.template[`${this.currentInput}`] = this.currentText;
    const txt = (this.currentText).replace(/\n/g,'<br/>');
    $(`#t-${this.currentInput}`).html(txt); 
    
    this.onChange.emit(this.template);
    this.closeModal();
  }

  createIndicatorEditorMode(){
    $('.icon-editor').remove();
    var nstyle = `font-size: 1rem;position: relative;top: -15px;color: #c82076;float: none;`; 
    setTimeout(() => {        
      $("[id^=t-]").each(function(){
        var id = $(this).attr('id');
        if(
          id == 't-cep' || 
          id == 't-numero'   || 
          id == 't-bairro'   || 
          id == 't-cidade'   || 
          id == 't-estado'   ||
          id == 't-complemento'   
        ){
          // Não aplicar editor
        }else{
          $( this ).append(`<i class="fa fa-commenting-o icon-editor" onClick="$('#${id}').click();" style="${nstyle}"></i>`);
        }        
      });

      // diferenciais ;
      // data
      var cstyle = `font-size: 1rem;position: relative;top: -60px;color: #c82076;float: none;left: 25px`;
      $("#fixed-data-formated").append(`<i class="fa fa-commenting-o icon-editor" onClick="$('#t-data').click();" style="${cstyle}"></i>`);

    });
  }
  
  cloneRemoteScript(){  
    setTimeout(() => {    
      const meses = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
      ];
      var replaceFormatDate = function(){
          // alert('é nada');
          var data = $(`#t-data`).hide().text();
          if( data && data != ''){
              var part = (data).split('-');
              var dia = part[2];
              var mes = meses[ ((+part[1]) - 1 ) ]; 
              var ano = part[0];
              var html_data = "<div id='fixed-dia' class='fixed-dia'>"+dia+"</div><div class='fixed-mes' style='white-space: nowrap;' >"+mes+"</div>";
              $(`#fixed-data-formated`).html(html_data);
          }
      }
      replaceFormatDate();  
    });   
  }

  ngOnDestroy(){
    $(`.box-show-template-invite`).remove();
  }

}
