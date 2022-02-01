import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTemplateComponent } from './edit-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SelectDateModule } from '../select-date/select-date.module';
import { SelectHourModule } from '../select-hour/select-hour.module';
import { SelectEnderecoModule } from '../select-endereco/select-endereco.module';



@NgModule({
  declarations: [EditTemplateComponent],
  exports: [EditTemplateComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SelectDateModule,
    SelectHourModule,
    SelectEnderecoModule
  ]
})
export class EditTemplateModule { }
