import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeusPedidosPage } from './meus-pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: MeusPedidosPage
  },
  {
    path: 'produto/:pedido_id/:item_id',
    loadChildren: () => import('./produto/produto.module').then( m => m.ProdutoPageModule)
  },
  {
    path: 'editado',
    loadChildren: () => import('./editado/editado.module').then( m => m.EditadoPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeusPedidosPageRoutingModule {}
