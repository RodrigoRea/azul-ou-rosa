import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ConvitesPageRoutingModule } from './convites-routing.module';

import { ConvitesPage } from './convites.page';
import { SharedModule } from 'src/app/_modulos/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ConvitesPageRoutingModule,
    SharedModule
  ],
  declarations: [ConvitesPage]
})
export class ConvitesPageModule {}
