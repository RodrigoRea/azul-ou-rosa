import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { LoginComponent } from './login/login.component';
import { EsqueciMinhaSenhaComponent } from './esqueci-minha-senha/esqueci-minha-senha.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CodeValidatorComponent } from './code-validator/code-validator.component';
import { LogoutComponent } from './logout/logout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from 'src/app/_directive/directives.module';

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
    FormsModule,
    ReactiveFormsModule,
    AuthPageRoutingModule,
    DirectivesModule
  ],
  
})
export class AuthPageModule {}
