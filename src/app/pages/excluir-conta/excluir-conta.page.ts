import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LojaVirtualService } from 'src/app/_services/loja-virtual.service';

@Component({
  selector: 'app-excluir-conta',
  templateUrl: './excluir-conta.page.html',
  styleUrls: ['./excluir-conta.page.scss'],
})
export class ExcluirContaPage implements OnInit {

  motivo: string = '';
  passo: number = 1;

  constructor(
    private lojaVirtualService: LojaVirtualService,
    private router: Router
  ) { }

  ngOnInit() {
  }


  excluir(){
    this.passo = 3;   
    this.lojaVirtualService.delete(this.motivo).subscribe(res=>{
      if( res && res['status'] === 201){
        this.router.navigate(['/auth/logout']);
      }else{
        this.passo = 4;
      }
    });       
  }

}
