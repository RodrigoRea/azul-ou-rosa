import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './_auth/auth.service';
import { DirectivesModule } from './_directive/directives.module';
import { IconLogoModule } from './_modulos/icon-logo/icon-logo.module';
import { IdiomaService } from './_services/idioma.service';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      // return localStorage.getItem("token");
      return localStorage.getItem(environment.keytoken);
    },
    allowedDomains: environment.dominiosComToken
  }
}

import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AuthGuard } from './_auth/auth.guard';
registerLocaleData(ptBr);
@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IconLogoModule, 
    HttpClientModule, 
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    }),
    DirectivesModule
  ],
  providers: [
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    }, 
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    },
    IdiomaService, 
    AuthService,
    AuthGuard
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
