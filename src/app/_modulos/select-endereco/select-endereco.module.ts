import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectEnderecoComponent } from './select-endereco.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [SelectEnderecoComponent],
  exports: [SelectEnderecoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SelectEnderecoModule { }
