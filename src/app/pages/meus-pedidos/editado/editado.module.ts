import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditadoPageRoutingModule } from './editado-routing.module';

import { EditadoPage } from './editado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditadoPageRoutingModule
  ],
  declarations: [EditadoPage]
})
export class EditadoPageModule {}
