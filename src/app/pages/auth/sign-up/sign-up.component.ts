import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AccessService } from '../_services/access.services';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  
  enviando: boolean = false;
  mensagem: string = '';
  redirect: string = '';
  formulario: FormGroup | undefined;

  typepass: string = 'password';
  
  constructor(
    private formBuilder: FormBuilder,
    private accessService: AccessService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.redirect = this.route.snapshot.queryParams['redirect'];

    this.formulario = this.formBuilder.group({
      mail: ['',[Validators.required, Validators.email]],
      pass: ['',[Validators.required, Validators.minLength(5)]]
    });
  }

  toPageLogin() {
    this.router.navigate(['auth/login']);
  
  }

  changeTypePass(){
    this.typepass = (this.typepass === 'password') ? 'text' : 'password';
  }

  cadastrar(){
    
    if( this.formulario?.valid ){
      this.enviando = true;
      this.mensagem = '';
      this.accessService.signIn(this.formulario.value).subscribe(res=>{
        this.enviando = false;
        if( res['status'] === 201 ){

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

        }else{
          this.mensagem = (res.mensagem !== undefined && res.mensagem !== null && res.mensagem !== '' ) ? res.mensagem : '';
        }

      })
    }
  }

}
