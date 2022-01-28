import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccessService } from '../auth/_services/access.services';
import * as MyValidators from 'src/app/_helpers/validacoes';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.page.html',
  styleUrls: ['./alterar-senha.page.scss'],
})
export class AlterarSenhaPage implements OnInit {

  formulario: FormGroup | undefined;

  vpass1: boolean = false;
  vpass2: boolean = false;
  vpass3: boolean = false;

  constructor(
      private formBuilder: FormBuilder,
      private accessService: AccessService
  ) {
  }


  ngOnInit() {
      this.formulario = this.formBuilder.group({
          senhaAtual:     ['',[Validators.required, Validators.minLength(6)]],
          senhaNova:      ['',[Validators.required, Validators.minLength(6), MyValidators.NotCompareValidator('#senhaAtual'), MyValidators.CompareValidator('#reSenhaNova')]],
          reSenhaNova:    ['',[Validators.required, Validators.minLength(6), MyValidators.CompareValidator('#senhaNova')]],
      })
  }

  mensagemErr = '';
  mensagemSucces = '';
  alterarSenha(){
      this.mensagemErr = '';
      this.mensagemSucces = '';
      this.accessService.atualizarSenha(this.formulario?.value).subscribe(res=>{
          if( res !== undefined && res !== null ){
            console.log('res', res);
            if( res['status'] === 304 ){
              this.mensagemErr = "A senha nova é igual a senha antiga";
              return;
            }else{
              if( res['erro'] ){
                  this.mensagemErr = (res['mensagem'] !== undefined && res['mensagem'] !== null && res['mensagem'] !== '' ) ? res['mensagem'] : '' ;
              }else{
                  this.mensagemSucces = (res['mensagem'] !== undefined && res['mensagem'] !== null && res['mensagem'] !== '' ) ? res['mensagem'] : '' ;
              }
            }
          }
      })
      
  }

  updatePass(){
    // console.log('updatePass');

    this.formulario.get('senhaAtual').updateValueAndValidity();
    this.formulario.get('senhaNova').updateValueAndValidity();
    this.formulario.get('reSenhaNova').updateValueAndValidity();
  }


}

