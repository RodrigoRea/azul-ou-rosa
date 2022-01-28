import { Directive, ElementRef, Input, Renderer2, HostListener } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../environments/environment';

@Directive({
  selector: '[imageFile]'
})
export class ImageFileDirective {

  loadingIMG = '/assets/img/loading-image.gif';
  onErrorSrc = '/assets/img/no-image-found.jpg';

  imagepath: string = '';

  @Input() size: ''|'minimum'|'medium'|'maximum'|'genuine' = '';
  @Input() lazy: boolean = true;
  @Input() lojaID: any;
  @Input() set imageFile(src: string | ArrayBuffer){
    const helper = new JwtHelperService();

    if( src === undefined || src === null || src === '' ){
      this.imagepath = '';
      // this.el.nativeElement.src = this.onErrorSrc;
      // this.renderer.setAttribute(this.el.nativeElement, 'src', this.onErrorSrc);
      return;
    }
    setTimeout(() => {
      let lojaID = this.lojaID;

      if( lojaID === undefined || lojaID === null ){
        let tk = localStorage.getItem(environment.keytoken);
        if( tk === undefined || tk === null){
          tk = '';
        }
        const token: any = helper.decodeToken( tk );
        lojaID = token.loja_id;
      }

      let link = src;

      if( typeof src === 'string' ){
        const parts = (src).split('.'); 
        let ext = '';
        if((parts).length > 0){
          ext = parts[((parts).length-1)];
          if( (ext).length <= 4 ){

            let thumb = 'xg';
            switch (this.size) {
              case 'minimum': thumb = 'p'; break;
              case 'medium': thumb  = 'g'; break;
              case 'maximum': thumb = 'xg'; break;
              case 'genuine': thumb = 'nr'; break;
            }

            link = `${environment.api}/imagem/${lojaID}/${thumb}/${src}`;
          }
        }
      }

      this.imagepath = link as string;
      if( this.loadingIMG !== undefined && this.loadingIMG !== null ){
        if( this.lazy ){
          this.el.nativeElement.src = this.loadingIMG;
        }else{
          this.el.nativeElement.src = this.imagepath;
        }
      }
    });
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {
  }

  @HostListener('load') onLoad() {
    if( this.loadingIMG !== undefined && this.loadingIMG !== null && this.loadingIMG !== '' ){
      if( this.el.nativeElement.src !== this.imagepath){
        this.renderer.setAttribute(this.el.nativeElement, 'src', this.imagepath);
      }
    }
  }
  @HostListener('error') onError() {
    this.imagepath = this.onErrorSrc;
    if( this.el.nativeElement.src !== this.imagepath){
      this.el.nativeElement.src = this.imagepath;
      this.el.nativeElement.style = 'max-width: 200px; text-align: center; margin: auto';
      this.el.nativeElement.alt = 'No Image Found';
    }
    /*if( this.loadingIMG !== undefined && this.loadingIMG !== null && this.loadingIMG !== '' ){
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.onErrorSrc);
    }*/
  }

}
