import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  step: number = 1;

  socials = [
    //{"name":"Facebook", "icon":"fa fa-facebook", "link":"https://www.facebook.com/appmybabeis"},
    //{"name":"Twitter", "icon":"fa fa-twitter", "link":"https://twitter.com/appmybabeis"},

    {"name":"Site", "icon":"fa fa-globe", "link":"https://mybabeis.com.br"},
    {"name":"Google", "icon":"fa fa-google", "link":"mailto:app.mybabeis.com.br@gmail.com?subject=Aplicativo Azul ou Rosa"},
    {"name":"Instagram", "icon":"fa fa-instagram", "link":"https://www.instagram.com/appmybabeis"},
    
    //{"name":"Avalie", "icon":"fas fa-thumbs-up", "link":"https://play.google.com/store/apps/details?id=br.com.quinhodevops.simuladoscha"},
    //{"name":"Linkedin", "icon":"fab fa-linkedin", "link":""},
    //{"name":"Github", "icon":"fab fa-github", "link":""}
  ]

  constructor() { }

  ngOnInit() {}

}
