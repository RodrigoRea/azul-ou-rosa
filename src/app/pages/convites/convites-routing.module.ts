import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConvitesPage } from './convites.page';

const routes: Routes = [
  {
    path: '',
    component: ConvitesPage
  },
  {
    path: 'modelos/:modelo_id',
    loadChildren: () => import('./modelos/modelos.module').then( m => m.ModelosPageModule)
  },
  {
    path: 'produto/:modelo_id',
    loadChildren: () => import('./produto/produto.module').then( m => m.ProdutoPageModule)
  },
  // { path: '', redirectTo: 'convites', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConvitesPageRoutingModule {}
