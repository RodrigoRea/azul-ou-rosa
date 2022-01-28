import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/_auth/auth.service';
import { environment } from 'src/environments/environment';
import { AccessService } from '../_services/access.services';

@Component({
  selector: 'app-code-validator',
  templateUrl: './code-validator.component.html',
  styleUrls: ['./code-validator.component.scss']
})
export class CodeValidatorComponent implements OnInit {

  mensagem: string = '';
  mensagemInfo: string = '';
  enviando: boolean = false;
  enviandoInfo: boolean = false;

  redirect: string = '';

  input1: string = '';
  input2: string = '';
  input3: string = '';
  input4: string = '';
  input5: string = '';
  input6: string = '';

  email: string = '';

  constructor(
    private accessService: AccessService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.redirect = this.route.snapshot.queryParams['redirect'];
  }

  ionViewWillEnter(){
    this.input1 = '';
    this.input2 = '';
    this.input3 = '';
    this.input4 = '';
    this.input5 = '';
    this.input6 = '';

    const helper = new JwtHelperService();
    let tk = localStorage.getItem(environment.keytoken);
    if( tk === undefined || tk === null){
      tk = '';
    }
    const decodedToken = helper.decodeToken(tk);
    this.email = decodedToken['email'];
  }

  vCode(char: string){
    char = `${char}`;
    console.log('char', char);
    if(char === '0' ){
      return true;
    }
    if( char === undefined || char === null || char === '' ){
      return false;
    }
    if( (char).length === 1 && char !== ' ' ){
      return true;
    }
    return false;
  }

  validarCode(){
    if( !this.vCode(this.input1) ){ return; }
    if( !this.vCode(this.input2) ){ return; }
    if( !this.vCode(this.input3) ){ return; }
    if( !this.vCode(this.input4) ){ return; }
    if( !this.vCode(this.input5) ){ return; }
    if( !this.vCode(this.input6) ){ return; }    
    const code = `${this.input1}${this.input2}${this.input3}${this.input4}${this.input5}${this.input6}`;
    this.authCode(code);
  }

  private authCode(code: string){  
    this.enviando = true;
    this.mensagem = '';
    this.mensagemInfo = ''; 
    this.accessService.authCode(code).subscribe(res=>{
      if(res !== undefined){
        if( res.erro ){
          // Erro 
          this.mensagem = res.mensagem;
        }else{

          if( this.redirect !== undefined && this.redirect !== null && this.redirect !== '' ){
            console.log('this.redirect go',this.redirect);
            this.router.navigate([`${this.redirect}`]);
          }else{
            this.router.navigate(['/']);
          }

        }       
      }  
      this.enviando = false;      
    });
  }

  reenviarCodigo(){
    this.enviandoInfo = true;
    this.mensagem = '';
    this.mensagemInfo = '';
    this.accessService.reenviarCode().subscribe((res: any)=>{
      if(res){
        console.log('res reenviarCodigo', res);
        this.mensagemInfo = res['mensagem'];
      }
      this.enviandoInfo = false;
    });
  }

  cancelar(){
    this.authService.setAutenticado(false);
  }
}
