import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectHourComponent } from './select-hour.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [SelectHourComponent],
  exports: [SelectHourComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class SelectHourModule { }
