import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutPageRoutingModule } from './checkout-routing.module';

import { CheckoutPage } from './checkout.page';
import { CartaoComponent } from './assets/component/cartao/cartao.component';
import { FormularioComponent } from './assets/component/formulario/formulario.component';
import { BoletoComponent } from './assets/component/boleto/boleto.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CheckoutPageRoutingModule
  ],
  declarations: [CheckoutPage, CartaoComponent, FormularioComponent, BoletoComponent]
})
export class CheckoutPageModule {}
