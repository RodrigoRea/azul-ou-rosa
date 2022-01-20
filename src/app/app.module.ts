import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconLogoModule } from './_modulos/icon-logo/icon-logo.module';
import { IdiomaService } from './_services/idioma.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IconLogoModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, IdiomaService],
  bootstrap: [AppComponent],
})
export class AppModule {}
