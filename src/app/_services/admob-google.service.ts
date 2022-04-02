import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AdMobPlus, BannerAd, InterstitialAd } from '@admob-plus/capacitor';

const AdMobPROD = {
    // AppID deve ser alterado em AndroidManifest.xml
    AppID: 'ca-app-pub-2124010802423434~5424089591',
    BannerID: 'ca-app-pub-2124010802423434/9315271137',
    InterstitialID:'ca-app-pub-2124010802423434/2666102300',
}

const AdMobDEV = {
  AppID: 'ca-app-pub-2124010802423434~2940370138',
  BannerID: 'ca-app-pub-3940256099942544/6300978111',
  InterstitialID:'ca-app-pub-3940256099942544/1033173712',
}

@Injectable({ providedIn: 'root' })
export class AdMobGoogleService {

    AdMobIDs = AdMobDEV; //AdMobPROD;

    private _banner: BannerAd;

    constructor(
        private platform: Platform        
    ) { 

    }

    bannerShow(){
        this.platform.ready().then(async () => {
            this._banner = new BannerAd({
                adUnitId: this.AdMobIDs.BannerID,
            })
            await this._banner.show();

            /*
            AdMobPlus.addListener('banner.impression', async () => {
                await banner.hide()
            })
            */
           
        });
    }

    

    bannerHide(){
        console.log('bannerHide');
        if( this._banner ){
            console.log('bannerHide _banner defined');
            AdMobPlus.addListener('banner.impression', async () => {
                await this._banner.hide()
            })
        }        
    }

    interstitial(){
        this.platform.ready().then(async () => {
            const interstitial = new InterstitialAd({
                adUnitId: this.AdMobIDs.InterstitialID,
            })
            await interstitial.load();
            await interstitial.show();
        })
    }

    async canInterstitial(): Promise<boolean>{
        return new Promise(resolve =>{ 
            this.platform.ready().then(async () => {
                const interstitial = new InterstitialAd({
                    adUnitId:this.AdMobIDs.InterstitialID,
                })
                await interstitial.load();
                await interstitial.show();
                resolve(true);
            });
            
        });
    }

}