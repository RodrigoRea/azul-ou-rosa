import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalgravidezPageRoutingModule } from './calgravidez-routing.module';

import { CalgravidezPage } from './calgravidez.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalgravidezPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CalgravidezPage]
})
export class CalgravidezPageModule {}
