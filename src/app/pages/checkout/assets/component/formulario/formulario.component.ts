import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as PayValid from '../../pagamento-validate';
import { Dados } from '../../../checkout';

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
  
  constructor(private formBuilder: FormBuilder) { }

  @Output() evento = new EventEmitter<Dados>();

  @Input() dados = new Dados();

  ngOnInit() {

    this.formulario = this.formBuilder.group({
      nome: [this.dados.nome, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      dtnascimento: [this.dados.dtnascimento, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      CPF: [this.dados.CPF, [Validators.required, PayValid.validaCPFValidator(), Validators.minLength(14), Validators.maxLength(14)]],
      mensagem: [this.dados.mensagem, Validators.maxLength(500)],
      telefone: [this.dados.telefone,[Validators.required,Validators.minLength(13)]],
      email: [this.dados.email, [Validators.required, Validators.email,PayValid.isEmailValidator()]],
      voltar: []
    });

    if( !environment.production ){
      this.setFormularioTeste();
    }
  }

  submit(){
    if( this.formulario.valid ){
      this.formulario.get('voltar').setValue(false);
      this.evento.emit( this.formulario.value );
    }
  }

  voltar(){
    this.formulario.get('voltar').setValue(true);
    this.evento.emit( this.formulario.value );
  }

  setFormularioTeste(){
    setTimeout(() => {
      this.formulario.get('nome').setValue('Rodrigo Rea Mendes');
      this.formulario.get('dtnascimento').setValue('13/03/1985');
      this.formulario.get('CPF').setValue('340.974.968-32');
      this.formulario.get('mensagem').setValue('teste');
      this.formulario.get('telefone').setValue('(11)987065302');
      this.formulario.get('email').setValue('c55887303879267249916@sandbox.pagseguro.com.br');
    }, 500);
  }
}
