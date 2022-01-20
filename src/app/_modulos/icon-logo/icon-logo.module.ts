import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IconLogoComponent } from './icon-logo.component';



@NgModule({
  declarations: [IconLogoComponent],
  exports: [IconLogoComponent],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class IconLogoModule { }
