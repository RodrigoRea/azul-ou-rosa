import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AccessService } from '../_services/access.services';

@Component({
  selector: 'app-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.component.html',
  styleUrls: ['./esqueci-minha-senha.component.scss']
})
export class EsqueciMinhaSenhaComponent implements OnInit {

  @ViewChild('_chave') _chave: any;

  fase: number = 1;

  formulario: FormGroup | undefined;
  email: string = '';
  chaveGerada: boolean = false;
  senhaAlterada: boolean = false;
  typepass: string = 'password';
  senha: string = '';
  mensagem: string = '';

  chave: string = '';

  chaveOld: boolean = false;

  gerandoKey: boolean = false;
  validandoKey: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private accessService: AccessService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    const helper = new JwtHelperService();
    let tk = localStorage.getItem(environment.keytoken);
    if( tk === undefined || tk === null){
      tk = '';
    }
    const decodedToken = helper.decodeToken(tk);
    if(decodedToken){
      if( decodedToken['code'] === 'S' ){
        console.log('decodedToken', decodedToken);    
        this.router.navigate(['/auth/code-validator']);        
        return;
      }
    }


    this.formulario = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      chave: ['',[Validators.minLength(32), Validators.maxLength(32)]]
    });

    this.email = this.route.snapshot.queryParams['email'];
    if( this.email !== undefined && this.email !== null && this.email !== '' ){
      setTimeout(() => {
        this.formulario?.get('email')?.setValue(this.email);
      });
    }
  }

  ionViewWillEnter(){
    this.fase = 1;
    this.chaveGerada = false;
    this.senhaAlterada = false;
    this.typepass = 'password';
    this.senha = '';
    this.mensagem = '';
    this.chaveOld = false;

    this.formulario?.setValidators([Validators.minLength(32), Validators.maxLength(32)])
    this.formulario?.updateValueAndValidity();
  }

  changeTypePass(){
    this.typepass = ( this.typepass === 'password') ? 'text' : 'password';
  }

  jaTenhoChave(){
    this.mensagem = '';
    if( this.formulario !== undefined ){
      if( this.formulario.get('email')?.valid ){
        this.chaveOld = true;
        this.chaveGerada = true;
        this.formulario.get('chave')?.setValidators([Validators.minLength(32), Validators.maxLength(32), Validators.required]);
        this.formulario.get('chave')?.updateValueAndValidity();
      }else{
        this.mensagem = 'Informe seu email';
      }
    }
    
  }

  gerarChave(){    
    this.mensagem = '';
    const email = this.formulario?.get('email')?.value;
    if( (email).length > 3 ){
      this.gerandoKey = true;
      this.accessService.reenviarChave(email).subscribe(res=>{
        if( res['erro'] ){
          this.mensagem = res['mensagem'];
        }else{
          this.chaveGerada = true;
          this.formulario?.get('chave')?.setValidators([Validators.minLength(32), Validators.maxLength(32), Validators.required]);
          this.formulario?.get('chave')?.updateValueAndValidity();
        }
        this.gerandoKey = false;
      });      
    }
  }

  validarChave(){
    this.mensagem = '';
    const email = this.formulario?.get('email')?.value;
    const chave = this.formulario?.get('chave')?.value;
    this.email = email;
    this.chave = chave;
    if( (email).length > 3 && (chave).length === 32 ){
      this.validandoKey = true;
      this.accessService.validarChave(email, chave).subscribe(res=>{
        if( res['erro'] ){
          this.mensagem = res['mensagem'];
        }else{
          this.fase = 2;
          this.formulario?.get('chave')?.setValidators([Validators.minLength(32), Validators.maxLength(32), Validators.required]);
          this.formulario?.get('chave')?.updateValueAndValidity();
        }
        this.validandoKey = false;
      });      
    }

  }

  alterarSenha(){
    this.mensagem = '';
    const email = this.email;
    const chave = this.chave;
    const senha = this.senha;
    if( (email).length > 3 && (chave).length === 32 && (senha).length > 5 ){
      this.accessService.alterarSenha(email, chave, senha).subscribe(res=>{
        if( res['erro'] ){
          this.mensagem = res['mensagem'];
        }else{
          this.senhaAlterada = true;
        }
      });      
    }
  }

  is32char(chave: any){
    if( chave !== undefined ){
      if( typeof chave === 'string' ){
        if( (chave).length === 32 ){
          this.mensagem = '';
        }
      }
    }
  }

  toLogin(){
    this.mensagem = '';
    this.router.navigate(['auth/login']);
  }

  toPageLogin() {
      this.router.navigate(['auth/login']);
    
  }


  // OS61TB9VWB5CE6E8IPVS58EBZD9TV94T

  async onPaste() {
    this.mensagem = '';
    try {
      const text = await navigator.clipboard.readText();
      if( (text).length === 32 ) {
        console.log('chave',text);
        this.mensagem = '';
        this.formulario?.get('chave')?.setValue(text);
      }else{
        if( (text).length > 0 ) {
          this.mensagem = "Quantidade de caracteres inválidos na chave";
        }else{
          this.mensagem = "Copie sua chave recebida por email";
        }
      }
      
    } catch (error) {
      
    }    
  }

}
