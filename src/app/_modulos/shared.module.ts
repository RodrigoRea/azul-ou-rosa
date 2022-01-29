import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IconLogoModule } from './icon-logo/icon-logo.module';
import { DirectivesModule } from '../_directive/directives.module';
import { LoadingModule } from './loading/loading.module';

@NgModule({
  imports: [    
    CommonModule, 
    ReactiveFormsModule,  
    FormsModule, 
    RouterModule,
    IconLogoModule,
    LoadingModule
  ],
  declarations: [
  ],
  exports: [
    ReactiveFormsModule,  
    FormsModule, 
    RouterModule,
    IconLogoModule,
    DirectivesModule,
    LoadingModule
  ],
  providers: []
})
export class SharedModule { }