import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';
import { CodeValidatorComponent } from './code-validator/code-validator.component';
import { EsqueciMinhaSenhaComponent } from './esqueci-minha-senha/esqueci-minha-senha.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { 
    path: '', 
    component: AuthPage,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'esqueci-minha-senha', component: EsqueciMinhaSenhaComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'code-validator', component: CodeValidatorComponent },
      { path: 'logout', component: LogoutComponent },
    ],
    
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
