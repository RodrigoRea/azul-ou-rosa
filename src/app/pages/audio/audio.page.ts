import { Component, OnInit } from '@angular/core';
import { AdMobGoogleService } from 'src/app/_services/admob-google.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.page.html',
  styleUrls: ['./audio.page.scss'],
})
export class AudioPage implements OnInit {

  status: 'play'|'pause' = 'pause';

  constructor(
    private adMobGoogleService: AdMobGoogleService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){ this.adMobGoogleService.bannerShow(); }
  ionViewWillLeave(){ this.adMobGoogleService.bannerHide(); this.pause(); }

  play() {
    var x: any = document.getElementById("tag-audio"); 
    x.play(); 
    this.status = 'play';
  } 

  pause() { 
    var x: any = document.getElementById("tag-audio");
    x.pause(); 
    this.status = 'pause';
  } 

}
