import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ModelosPageRoutingModule } from './modelos-routing.module';

import { ModelosPage } from './modelos.page';
import { LoadingModule } from 'src/app/_modulos/loading/loading.module';
import { SharedModule } from 'src/app/_modulos/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ModelosPageRoutingModule,
    SharedModule
  ],
  declarations: [ModelosPage]
})
export class ModelosPageModule {}
