import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutoService } from 'src/app/_services/produto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modelos',
  templateUrl: './modelos.page.html',
  styleUrls: ['./modelos.page.scss'],
})
export class ModelosPage implements OnInit {

  loading: boolean = false;
  modelo_id: any | undefined;

  produtos: any[] = [] as any[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private produtoService: ProdutoService
  ) { }

  ngOnInit() {
    this.modelo_id = this.activatedRoute.snapshot.paramMap.get('modelo_id');
    console.log('this.modelo_id', this.modelo_id);
    if( this.modelo_id ){
      this.getProdutos();
    }
  }

  getProdutos(){
    this.loading = true;
    this.produtoService.get(this.modelo_id).subscribe((res: any)=>{
      if(res){
        this.produtos = res;
      }
      this.loading = false;
    }, error => this.loading = false);
  }

  toProduct(produto){
    //console.log('comprar item', item);
    localStorage.setItem(environment.cartStorage, btoa(JSON.stringify(produto)));
    setTimeout(() => {
      this.router.navigate([`convites/produto/${produto.produto_id}`]);
    });
  }

}
