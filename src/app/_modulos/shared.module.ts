import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IconLogoModule } from './icon-logo/icon-logo.module';
import { DirectivesModule } from '../_directive/directives.module';
import { LoadingModule } from './loading/loading.module';
import { EditTemplateModule } from './edit-template/edit-template.module';

@NgModule({
  imports: [    
    CommonModule, 
    ReactiveFormsModule,  
    FormsModule, 
    RouterModule,
    IconLogoModule,
    LoadingModule,
    EditTemplateModule
  ],
  declarations: [
  ],
  exports: [
    ReactiveFormsModule,  
    FormsModule, 
    RouterModule,
    IconLogoModule,
    DirectivesModule,
    LoadingModule,
    EditTemplateModule
  ],
  providers: []
})
export class SharedModule { }