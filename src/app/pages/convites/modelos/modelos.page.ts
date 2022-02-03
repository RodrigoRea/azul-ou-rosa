import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_auth/auth.service';
import { ProdutoService } from 'src/app/_services/produto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modelos',
  templateUrl: './modelos.page.html',
  styleUrls: ['./modelos.page.scss'],
})
export class ModelosPage implements OnInit {

  show: number = 1;
  limit: number = 2;

  url: string = environment.api;
  tema: string = '0000';

  isAuth: boolean = false;

  loading: boolean = false;
  modelo_id: any | undefined;

  produtos: any[] = [] as any[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private produtoService: ProdutoService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isAuth = this.authService.getAuthState();
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

  // Usuario deve ter cadastro para efetuar compras
  toProduct(produto){
    //console.log('comprar item', item);
    localStorage.setItem(environment.cartStorage, btoa(JSON.stringify(produto)));

    this.isAuth = this.authService.getAuthState();

    setTimeout(() => {
      if( this.isAuth ){
        this.router.navigate([`convites/produto/${produto.produto_id}`]);
      }else{
        this.router.navigate([`/auth/login`],{queryParams: {'redirect':`convites/produto/${produto.produto_id}`}});
      }
    });
  }

  toPage(page) {
    this.router.navigate([`${page}`]);
  }

  nextShow(){
    if( this.show < this.limit ){
      this.show = this.show + 1;
    }else if( this.show === this.limit ){
      this.show = 1;
    }
  }

  getPathImg(id: number){
    return ("0000" + id).slice(-4);
  }

}
