import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modelos',
  templateUrl: './modelos.page.html',
  styleUrls: ['./modelos.page.scss'],
})
export class ModelosPage implements OnInit {

  modelo: any | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.modelo = this.activatedRoute.snapshot.paramMap.get('modelo');
    
  }

  toProduct(){
    //console.log('comprar item', item);
    //localStorage.setItem(environment.cartStorage, btoa(JSON.stringify(item)));
    setTimeout(() => {
      this.router.navigate([`convites/produto/${this.modelo}`]);
    });
  }

}
