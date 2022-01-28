import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskvDirective } from './maskv.directive';
import { ImageFileDirective } from '../_directive/image-file.directive';
import { SafePipe } from './safe.directive';

@NgModule({
  imports: [  
    CommonModule,    
  ],
  declarations: [
    MaskvDirective,
    ImageFileDirective,
    SafePipe
  ],
  exports: [
    MaskvDirective,
    ImageFileDirective,
    SafePipe
  ],
  providers: []
})
export class DirectivesModule { }