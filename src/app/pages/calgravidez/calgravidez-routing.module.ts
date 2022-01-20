import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalgravidezPage } from './calgravidez.page';

const routes: Routes = [
  {
    path: '',
    component: CalgravidezPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalgravidezPageRoutingModule {}
