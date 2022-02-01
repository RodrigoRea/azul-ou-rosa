import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { LoginComponent } from './login/login.component';
import { EsqueciMinhaSenhaComponent } from './esqueci-minha-senha/esqueci-minha-senha.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CodeValidatorComponent } from './code-validator/code-validator.component';
import { LogoutComponent } from './logout/logout.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/_modulos/shared.module';

@NgModule({
  declarations: [
    AuthPage,
    LoginComponent,
    EsqueciMinhaSenhaComponent,
    SignUpComponent,
    CodeValidatorComponent,
    LogoutComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    AuthPageRoutingModule,
    IonicModule
  ],
  
})
export class AuthPageModule {}
