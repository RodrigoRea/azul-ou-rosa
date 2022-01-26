import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConvitesPageRoutingModule } from './convites-routing.module';

import { ConvitesPage } from './convites.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConvitesPageRoutingModule
  ],
  declarations: [ConvitesPage]
})
export class ConvitesPageModule {}
