import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditadoPage } from './editado.page';

const routes: Routes = [
  {
    path: '',
    component: EditadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditadoPageRoutingModule {}
