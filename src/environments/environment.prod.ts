export const environment = {
  production: true,
  cartStorage: 'cart',
};

/************************************************************************************ */
/************************************************************************************ */
/************************************************************************************ */
/*
-- Construir imagens a partir de resources/icon.png
-- https://capacitorjs.com/docs/guides/splash-screens-and-icons
-- https://github.com/ionic-team/capacitor-assets

$ npm install -g cordova-res
resources/
├── icon.png
└── splash.png

resources/android/
├── icon-background.png
└── icon-foreground.png

cordova-res android --skip-config --copy
*/
/************************************************************************************ */
/************************************************************************************ */
/************************************************************************************ */
// ## IONIC 
// ## Build Capacitor
// ionic cap add android   <--- Rodar apenas na primeira vez

// ionic cap copy
// ionic cap sync

// ## Abrir no android studio
// ionic cap open android
/************************************************************************************ */
/************************************************************************************ */
/************************************************************************************ */
// Android / app / build.gradle <- versao do app