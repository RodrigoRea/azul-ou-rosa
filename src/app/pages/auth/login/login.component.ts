import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/_auth/auth.service';
import { environment } from 'src/environments/environment';
import { AccessService } from '../_services/access.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  enviando: boolean = false;
  mensagem: string = '';
  redirect: string = '';
  formulario?: FormGroup;

  typepass: string = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private accessService: AccessService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ionViewWillEnter(){
    console.log('ionViewWillEnter');
    const isAuth = this.authService.getAuthState();
    if( isAuth ){           
      this.router.navigate(['/']);
      return;
    }
  }

  ngOnInit() {

    if( this.authService.tokenInStorage() ){           
      this.router.navigate(['/']);
      return;
    }

    this.formulario = this.formBuilder.group({
      mail: ['',[Validators.required, Validators.email]],
      pass: ['',[Validators.required, Validators.minLength(5)]]
    });

    this.redirect = this.route.snapshot.queryParams['redirect'];
  }

  changeTypePass(){
    this.typepass = ( this.typepass === 'password') ? 'text' : 'password';
    console.log('this.typepass',this.typepass);
  }

  toPage(page: string, redirect?: string){
    if( redirect !== undefined && redirect !== null && redirect !== '' ){
      this.router.navigate([`${page}`],{queryParams: {'redirect':`${redirect}`}});
      return
    }
    this.router.navigate([`${page}`]);
  }

  toPageEsqueciMinhaSenha(page: string){
    if( this.formulario !== undefined && this.formulario !== null ){
      const email = this.formulario.get('mail')?.value;
      if( email !== undefined && email !== null && email !== '' ){
        this.router.navigate([`${page}`],{queryParams: {'email':`${email}`}});
        return
      }
      this.router.navigate([`${page}`]);
    }
  }

  login(){
    
    if( this.formulario !== undefined && this.formulario.valid ){

      this.mensagem = '';
      this.enviando = true;

      this.accessService.login(this.formulario.value).subscribe(res=>{
        console.log(res);
        if(res !== undefined){
          if( res.erro ){
            /*if(res.mensagem === 'code'){
              this.router.navigate(['/auth/code-validator']);
              return;
            }*/
            // Erro 
            this.mensagem = (res.mensagem !== undefined && res.mensagem !== null && res.mensagem !== '' ) ? res.mensagem : '';
          }else{

            const helper = new JwtHelperService();
            let tk = localStorage.getItem(environment.keytoken);
            if( tk === undefined || tk === null){
              tk = '';
            }
            const decodedToken = helper.decodeToken(tk);
            if( decodedToken['code'] === 'S' ){
                console.log('decodedToken', decodedToken);                
                if( this.redirect !== undefined && this.redirect !== null && this.redirect !== '' ){
                  console.log('this.redirect go',this.redirect);
                  this.router.navigate(['/auth/code-validator'],{queryParams: {'redirect':`${this.redirect}`}});
                }else{
                  this.router.navigate(['/auth/code-validator']);
                }
                return;
            }
            
            if( this.redirect !== undefined && this.redirect !== null && this.redirect !== '' ){
              console.log('this.redirect go',this.redirect);
              this.router.navigate([`${this.redirect}`]);
            }else{
              this.router.navigate(['/']);
            }

          }
          this.enviando = false;    
              
        }        
      })
    }
  }
  
}
