import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ProdutoPageRoutingModule } from './produto-routing.module';

import { ProdutoPage } from './produto.page';
import { SharedModule } from 'src/app/_modulos/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProdutoPageRoutingModule,
    SharedModule
  ],
  declarations: [ProdutoPage]
})
export class ProdutoPageModule {}
