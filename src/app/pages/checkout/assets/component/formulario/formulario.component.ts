import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as PayValid from '../../pagamento-validate';
import { Dados } from '../../../checkout';
import { LojaVirtualService } from 'src/app/_services/loja-virtual.service';
import { IUser } from 'src/app/_interfaces';
import { Router } from '@angular/router';

declare var $: any;

var userMOCK = {
  "cpf":"340.974.968-32",
  "dtnascimento":"13/03/1985",
}
@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  MaskNascimento = [/[0-3]/, /[0-9]/, '/', /[0-1]/, /[0-9]/, '/',/[1-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  MaskTelefone = ['(',/[0-9]/,/[0-9]/,')',' ',/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/];
  MaskCPF = [/[0-9]/,/[0-9]/,/[0-9]/,'.',/[0-9]/,/[0-9]/,/[0-9]/,'.',/[0-9]/,/[0-9]/,/[0-9]/,'-',/[0-9]/,/[0-9]/];

  formulario: FormGroup; 
  loading: boolean = false;
  user: IUser | undefined;
  isNameValid: boolean = false;
  isNameDefaultValid: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private lojaVirtualService: LojaVirtualService,
    private router: Router
  ) { }

  @Output() evento = new EventEmitter<Dados>();

  @Input() dados = new Dados();

  ngOnInit() {

    

    this.formulario = this.formBuilder.group({
      nome: [this.dados.nome, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      dtnascimento: [this.dados.dtnascimento, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      CPF: [this.dados.CPF, [Validators.required, PayValid.validaCPFValidator(), Validators.minLength(14), Validators.maxLength(14)]],
      mensagem: [this.dados.mensagem, Validators.maxLength(500)],
      telefone: [this.dados.telefone,[Validators.required,Validators.minLength(11)]],
      email: [this.dados.email, [Validators.required, Validators.email,PayValid.isEmailValidator()]],
      voltar: []
    });

    if( environment.pagseguro_use_sandbox ){
      setTimeout(() => { this.formulario.patchValue(userMOCK); });
    }

    this.getUser();
  }

  getUser(){
    this.loading = true;
    this.lojaVirtualService.get().subscribe((res:any)=>{
      if( res && res.loja_id ){
        this.user = res;
        this.setFormularioCurrentUser();
      }else{
        alert('Por favor! Complete seu cadastro para proseguir com a compra');
        this.loading = false;
        this.router.navigate(['/cadastro'],{queryParams: {'redirect':`checkout`}});
      }
    }, error => { this.loading = false; });
  }

  submit(){
    if( this.formulario.valid ){
      this.formulario.get('voltar').setValue(false);
      this.evento.emit( this.formulario.value );
    }
  }

  ngAfterViewChecked(){
    $(document).setMask();
  }

  voltar(){
    this.formulario.get('voltar').setValue(true);
    this.evento.emit( this.formulario.value );
  }


  setFormularioCurrentUser(){
    setTimeout(() => {

      // sem endereço de cobrança 
      if(
        !this.user.cep        || 
        !this.user.numero     || 
        !this.user.bairro     || 
        !this.user.cidade     ||
        !this.user.estado     || 
        !this.user.endereco   ||

        this.user.cep      === '' || 
        this.user.numero   === '' || 
        this.user.bairro   === '' || 
        this.user.cidade   === '' ||
        this.user.estado   === '' || 
        this.user.endereco === ''
      ){
        this.loading = false;
        alert('Por favor! Complete seu cadastro de endereço para proseguir com a compra');
        setTimeout(() => {
          this.router.navigate(['/cadastro'],{queryParams: {'redirect':`checkout`}});
        });        
        return;
      }

      this.isNameDefaultValid = this.checkInCompletName(this.user.nome);

      this.formulario.get('nome').setValue((this.user.nome)?this.user.nome:'');
      this.formulario.get('dtnascimento').setValue((this.user.data_nasc)?this.user.data_nasc:'');
      this.formulario.get('CPF').setValue((this.user.cpf)?this.user.cpf:'');
      this.formulario.get('mensagem').setValue('');
      this.formulario.get('telefone').setValue((this.user.fone1)?this.user.fone1:'');
      if( environment.pagseguro_use_sandbox ){
        this.formulario.get('email').setValue('app.mybabeis@sandbox.pagseguro.com.br');
      }else{        
        this.formulario.get('email').setValue(`${this.user.email}`);
      }
      this.loading = false;
    });
  }

  
  checkInCompletName(name){
    if( name ){
      const nome = (name).trim();
      if(nome === undefined || nome === null || nome === ''){
        this.isNameValid = false;
        return false;
      }
      if( (nome).length < 5 ){
        this.isNameValid = false;
        return false;
      }
      let parts = (nome).split(" ");
      if( (parts).length <= 1 ){
        this.isNameValid = false;
        return false;
      }
      for(let i = 0; i < (parts).length; i++){
        if( (parts[i]).length < 2 ){
          this.isNameValid = false;
          return false;
        }
      }
      this.isNameValid = true;
      return true;
    }
    this.isNameValid = false;
    return false;
  }
  
}
