import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_auth/auth.service';
import { ITemplate } from 'src/app/_interfaces';

declare var $: any;

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss'],
})
export class EditTemplateComponent implements OnInit, OnDestroy, AfterViewChecked {

  ID: string = '';

  isOpenModal: boolean = false;
  isOpenModalOptionList: boolean = false;
  isOpenModalWhatsApp: boolean = false;
  isOpenModalHelp: boolean = false;

  type: string = '';

  phtml: string = '';
  currentInput: string = '';
  currentText: string = '';

  @Input() mode: string = '';
  @Input() template: ITemplate | undefined;
  @Output() templateChange = new EventEmitter<ITemplate>();

  @Output() onChange = new EventEmitter<ITemplate>(); 
  
  local: any | undefined;

  show_page: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { 
    $('.box-show-template-invite').remove();
  }

  ngOnInit() {
    setTimeout(() => {
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
          this.setDefaultValues();          
        });
      });    
    }); 

    setTimeout(() => {
      this.openModalHelp();
    }, 400);
  }

  ngAfterViewChecked(){
    $(document).setMask();
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

  setDefaultValues(){
    if( this.template && this.template.in_cart ){
      setTimeout(() => {
        const template = this.template;
        $("[id^=t-]").each(function(){
          let id = ( $(this).attr('id') ).replace('t-','');
          try {
            const v = template[id];
            if(v){ $(`#t-${id}`).html(v); }            
          } catch (error) { 
            console.log(`Erro id: ${id}`, error);
          }
          // console.log(`id = #t-${id} - valor template[id] = ${template[id]}` );
        })
        // alert('Achamos um convite pré editado');
        this.startActionsTemplateMode();
      });      
    }else{
      this.startActionsTemplateMode();
    }
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
    var nstyle = `
      position: relative;
      top: -15px;
      color: #6f94da;
      float: none;
      text-shadow: 0px 0px 6px rgb(68, 211, 255);

      font-size: 1.5rem;
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;

      -webkit-box-shadow: 0px 0px 5px 0px #fff;
      box-shadow: 0px 0px 5px 0px #fff;
      padding: 2px;
    `; 
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
      var cstyle = `
        position: relative;
        top: -60px;
        color: #6f94da;
        float: none;left: 25px;
        text-shadow: 0px 0px 6px rgb(68, 211, 255);

        font-size: 1.5rem;
        background-color: #fff;
        border-radius: 50%;
        cursor: pointer;

        -webkit-box-shadow: 0px 0px 5px 0px #fff;
        box-shadow: 0px 0px 5px 0px #fff;
        padding: 2px;
      `;
      $("#fixed-data-formated").append(`<i class="fa fa-commenting-o icon-editor" onClick="$('#t-data').click();" style="${cstyle}"></i>`);

    });
  }

  openOptionList(fab: any){
    if(fab){
      //(fab.el).stopPropagation();
      setTimeout(() => { fab.activated = true });
      this.openModalOptionList();
    }
  }

  openModalOptionList(){
    this.isOpenModalOptionList = true;
    $(`#option-list-${this.ID}`).modal('show');
  }

  closeModalOptionList(){
    this.isOpenModalOptionList = false;
    $(`#option-list-${this.ID}`).modal('hide');
  }

  addConfPres(){
    this.template.link_presenca = 'S';
    this.closeModalOptionList();
  }

  delConfPres(){
    this.template.link_presenca = 'N';
    this.closeModalOptionList();
  }
  /************************ */
  openHelp(fab: any){
    if(fab){
      setTimeout(() => { fab.activated = true });
      this.openModalHelp();
    }
  }
  openModalHelp(){
    this.isOpenModalHelp = true;
    $(`#box-help-${this.ID}`).modal('show');
  }
  closeModalHelp(){
    this.isOpenModalHelp = false;
    $(`#box-help-${this.ID}`).modal('hide');
  }
  /************************ */
  openWhatsApp(fab: any){
    if(fab){
      //(fab.el).stopPropagation();
      setTimeout(() => { fab.activated = true });
      this.openModalWhatsApp();
    }
  }
  openModalWhatsApp(){
    this.isOpenModalWhatsApp = true;
    $(`#whats-app-${this.ID}`).modal('show');
  }

  closeModalWhatsApp(){
    this.isOpenModalWhatsApp = false;
    $(`#whats-app-${this.ID}`).modal('hide');
  }

  closeModalWhatsAppWithSave(){
    this.isOpenModalWhatsApp = false;
    $(`#whats-app-${this.ID}`).modal('hide');    
    if( this.mode === 'update' ){
      this.onChange.emit(this.template);
    }
  }

  addWhatsApp(){
    this.template.fone_presenca = 'S';
    this.closeModalWhatsAppWithSave();
  }

  delWhatsApp(){
    this.template.fone = '';
    this.template.fone_presenca = 'N';
    this.closeModalWhatsAppWithSave();
  }
  /*********************************** */
  
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
    $('.box-show-template-invite').remove();
    this.show_page = false;
  }

}
