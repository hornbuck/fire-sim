if(!self.define){let s,e={};const r=(r,a)=>(r=new URL(r+".js",a).href,e[r]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=r,s.onload=e,document.head.appendChild(s)}else s=r,importScripts(r),e()})).then((()=>{let s=e[r];if(!s)throw new Error(`Module ${r} didn’t register its module`);return s})));self.define=(a,i)=>{const c=s||("document"in self?document.currentScript.src:"")||location.href;if(e[c])return;let o={};const n=s=>r(s,c),b={module:{uri:c},exports:o,require:n};e[c]=Promise.all(a.map((s=>b[s]||n(s)))).then((s=>(i(...s),o)))}}define(["./workbox-1f84e78b"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"/404.html",revision:"138033a20b2195287e0330a9ce592700"},{url:"/assets/64x64-Map-Tiles/Berry Bushes/berry-bush-on-flowers.png",revision:"62da48f433495f2ef8e99b5e6d0c1e99"},{url:"/assets/64x64-Map-Tiles/Berry Bushes/berry-bush-on-light-dirt.png",revision:"be19fca191063b3b97a547ba4b1455ae"},{url:"/assets/64x64-Map-Tiles/Berry Bushes/berry-bush-on-mud.png",revision:"d16d1979c5b8a5091b8d8288158409e2"},{url:"/assets/64x64-Map-Tiles/Berry Bushes/berry-bush-on-rock.png",revision:"c296fd84e81b12fd441cef5a9015b6e5"},{url:"/assets/64x64-Map-Tiles/Berry Bushes/berry-bush-on-sand.png",revision:"27303f2d474e9f51dca23d8d80013736"},{url:"/assets/64x64-Map-Tiles/Big Grasses/grass-on-flowers.png",revision:"ee483c5acc978b0a0b08f2ba18c3c01a"},{url:"/assets/64x64-Map-Tiles/Big Grasses/grass-on-light-dirt.png",revision:"9d3350d44a4dbfdbbb22b9d283f1e1db"},{url:"/assets/64x64-Map-Tiles/Big Grasses/grass-on-mud.png",revision:"5d81342269ee830596d6fc0aef6b749c"},{url:"/assets/64x64-Map-Tiles/Big Grasses/grass-on-rock.png",revision:"70ab07419ac597b1698a41a2814bdd6b"},{url:"/assets/64x64-Map-Tiles/Big Grasses/grass-on-sand.png",revision:"338c92bb6faa06196f67b49c99b11beb"},{url:"/assets/64x64-Map-Tiles/Burned Tiles/burned-grass.png",revision:"05f1e0a75b99ca49220c22b92f09e89b"},{url:"/assets/64x64-Map-Tiles/Burned Tiles/burned-shrubs-on-sand.png",revision:"61d9668b8286fa54a914e30c49234b90"},{url:"/assets/64x64-Map-Tiles/Burned Tiles/burned-trees-on-light-dirt.png",revision:"781ed1b0b3eddf0dc658254b86fa7b8d"},{url:"/assets/64x64-Map-Tiles/Bushes/bush-on-flowers.png",revision:"6a468bbeaf2dfe97f8dedc156637ac4a"},{url:"/assets/64x64-Map-Tiles/Bushes/bush-on-light-dirt.png",revision:"6ed70b92ca1768a4e427a93aad5d226e"},{url:"/assets/64x64-Map-Tiles/Bushes/bush-on-mud.png",revision:"1de81c37f62da83a343f0e0643b80926"},{url:"/assets/64x64-Map-Tiles/Bushes/bush-on-rock.png",revision:"497b3883bb71a14be8334d449e65d537"},{url:"/assets/64x64-Map-Tiles/Bushes/bush-on-sand.png",revision:"748c42b57af2ea9fcf697e236358398c"},{url:"/assets/64x64-Map-Tiles/Deployable Resources/extinguisher.png",revision:"09f7f8a67845b8e78fb4736aefc9409d"},{url:"/assets/64x64-Map-Tiles/Deployable Resources/fire-hose.png",revision:"51af24b7c21414f103678871cd1a2761"},{url:"/assets/64x64-Map-Tiles/Deployable Resources/firetruck.png",revision:"18fb034284e3a403809ca6a8cb188743"},{url:"/assets/64x64-Map-Tiles/Deployable Resources/helicopter.png",revision:"536b019383377c926ec71fc8cc12114f"},{url:"/assets/64x64-Map-Tiles/Dry Grass/dry-grass-on-flowers.png",revision:"02f3c8b7864a7b360fe1b2e80f82e306"},{url:"/assets/64x64-Map-Tiles/Dry Grass/dry-grass-on-light-dirt.png",revision:"c6697512fe3fa573e15578b9c4f741b4"},{url:"/assets/64x64-Map-Tiles/Dry Grass/dry-grass-on-mud.png",revision:"dcdcc1e890ae834800604ac255745278"},{url:"/assets/64x64-Map-Tiles/Dry Grass/dry-grass-on-rock.png",revision:"15843fd3816ed5cf317ec6307d071ec0"},{url:"/assets/64x64-Map-Tiles/Dry Grass/dry-grass-on-sand.png",revision:"e4222e0bc32bee6aece2613a558dcd9c"},{url:"/assets/64x64-Map-Tiles/Flower Bushes/flower-bush-on-flowers.png",revision:"dabea6e338ab6dbfc521fdff65f08156"},{url:"/assets/64x64-Map-Tiles/Flower Bushes/flower-bush-on-light-dirt.png",revision:"dc88e221fb0f269c18693c85b373ca5c"},{url:"/assets/64x64-Map-Tiles/Flower Bushes/flower-bush-on-mud.png",revision:"56c03439d6b91a2bd33bd8a9caaf6ca3"},{url:"/assets/64x64-Map-Tiles/Flower Bushes/flower-bush-on-rock.png",revision:"243bde4467bd48056ca7353671f984a9"},{url:"/assets/64x64-Map-Tiles/Flower Bushes/flower-bush-on-sand.png",revision:"dcc4bdae391a056c5fffe0df458953d9"},{url:"/assets/64x64-Map-Tiles/Pile of Rocks/rock-pile-on-flowers.png",revision:"3a33a91130bf69ca3dce5412372c9af3"},{url:"/assets/64x64-Map-Tiles/Pile of Rocks/rock-pile-on-light-dirt.png",revision:"1e6ea4a88f6b955e3cff477acf6da6d8"},{url:"/assets/64x64-Map-Tiles/Pile of Rocks/rock-pile-on-mud.png",revision:"bb6b6719b27c60f3c922c68960db9c92"},{url:"/assets/64x64-Map-Tiles/Pile of Rocks/rock-pile-on-rock.png",revision:"23f5d542e40ed79b9cbd93c7df36388a"},{url:"/assets/64x64-Map-Tiles/Pile of Rocks/rock-pile-on-sand.png",revision:"6337068fee76b50979849a839fdb245e"},{url:"/assets/64x64-Map-Tiles/Shrubs/shrubs-on-flowers.png",revision:"766f00c3ecf8f9b223828563ca418b59"},{url:"/assets/64x64-Map-Tiles/Shrubs/shrubs-on-light-dirt.png",revision:"bbf3dee55f3376d8c3d06fe9e6dc3269"},{url:"/assets/64x64-Map-Tiles/Shrubs/shrubs-on-mud.png",revision:"a316313c7842f72b483a66a9a2873313"},{url:"/assets/64x64-Map-Tiles/Shrubs/shrubs-on-rock.png",revision:"48e3353a6cd1f129e584863a152b5a26"},{url:"/assets/64x64-Map-Tiles/Shrubs/shrubs-on-sand.png",revision:"515434528ca76712dc8474c6b4f62f98"},{url:"/assets/64x64-Map-Tiles/Trees/trees-on-flowers.png",revision:"40c5e41b8c4ce63361b2fd8b9574ca9f"},{url:"/assets/64x64-Map-Tiles/Trees/trees-on-light-dirt.png",revision:"57e97de67d1881dfe11013af3081e054"},{url:"/assets/64x64-Map-Tiles/Trees/trees-on-mud.png",revision:"48466cf069fa73370b551973de72f8c2"},{url:"/assets/64x64-Map-Tiles/Trees/trees-on-rock.png",revision:"31e0861ab43cdfaa4428f17158c619fc"},{url:"/assets/64x64-Map-Tiles/Trees/trees-on-sand.png",revision:"8cd9771f712cbf889e40183cbe734274"},{url:"/assets/64x64-Map-Tiles/animated-flame.png",revision:"7a1db9ec9c1a15b313ced24b9b9609ca"},{url:"/assets/64x64-Map-Tiles/flowers.png",revision:"d8c1655a4cb52363809d91e4b176137d"},{url:"/assets/64x64-Map-Tiles/flowers2.png",revision:"550fc95856e19df560c4e24209785587"},{url:"/assets/64x64-Map-Tiles/grass.png",revision:"d7a3b283e84e0ac74e0edf0858bb77bc"},{url:"/assets/64x64-Map-Tiles/light-dirt.png",revision:"fd18d9c65cedbc00e80fb3865d64a7fc"},{url:"/assets/64x64-Map-Tiles/mud.png",revision:"c8a84c419441210e2053c498c648ebde"},{url:"/assets/64x64-Map-Tiles/rock.png",revision:"4c28d598b8f92df03bfb4623d91a8951"},{url:"/assets/64x64-Map-Tiles/sand.png",revision:"b58a2fa1ac18645c80ff5aeb69b81c53"},{url:"/assets/64x64-Map-Tiles/splash-sheet.png",revision:"fd4601debd1b421d75c5cbc1bd4cf6e2"},{url:"/assets/64x64-Map-Tiles/water.png",revision:"5f3c90f31c013d19b58844f0dcbe7b00"},{url:"/assets/cursors/airtanker.png",revision:"0abb058c448882572b3b3bfaa10ac24a"},{url:"/assets/cursors/fire-extinguisher.png",revision:"45b3cc986a4efcda3bdbbcf140c5144f"},{url:"/assets/cursors/firetruck.png",revision:"6b6d3b82d60935bb326969c04c8776d4"},{url:"/assets/cursors/glove.png",revision:"564e0a1b91e4e644aafa19628c8bf60d"},{url:"/assets/cursors/helicopter.png",revision:"78493a44f9e36e9ff3877420297ffa65"},{url:"/assets/cursors/hotshot-crew.png",revision:"1890239c8676144be2c7c1bb5b935968"},{url:"/assets/cursors/launch.png",revision:"d46184724573a031dbfd72d3efeee8d2"},{url:"/assets/cursors/water.png",revision:"bb3b8bb204807cf71fb4b792795c32e2"},{url:"/assets/icons/ForestFireBackground.jpg",revision:"5c892495c7cc070eeba387272c4b490a"},{url:"/assets/icons/atIcon.svg",revision:"db64a43eff290eb71a12c1f4bc37d20e"},{url:"/assets/icons/lockIcon.svg",revision:"426041fab41c06444d564ec73708a6a9"},{url:"/assets/icons/personIcon.svg",revision:"56471a242aaf471f30c8a211d24566a2"},{url:"/assets/resources/activated/airtanker.png",revision:"2a43e38b72ca983b5cde75700e1342df"},{url:"/assets/resources/activated/fire-extinguisher.png",revision:"e4e951dcee8be772885762b584739080"},{url:"/assets/resources/activated/fire-hose.png",revision:"c92a5a1e6fc18e3e7e7b7278b8eef41b"},{url:"/assets/resources/activated/firetruck.png",revision:"1dc7d4b25f991e023711a8a586714a67"},{url:"/assets/resources/activated/helicopter.png",revision:"3304141c01cd8e93d6d5a39a75b08759"},{url:"/assets/resources/activated/hotshot-crew.png",revision:"b1f54bee9e51f007ac01cee2dffe56de"},{url:"/assets/resources/activated/smokejumpers.png",revision:"3753bc737855d3c4b4bb765f99c39416"},{url:"/assets/resources/airtanker.png",revision:"a3fbc4b61b8bcd9bb3aad413a410dd14"},{url:"/assets/resources/fire-extinguisher.png",revision:"2b4a3902119123a378d08fb5323b0485"},{url:"/assets/resources/fire-hose.png",revision:"9cf00d68a204d000581ead65b5523827"},{url:"/assets/resources/firetruck.png",revision:"0f747251f779030a70e0a0f7f099c177"},{url:"/assets/resources/helicopter.png",revision:"d5a05f7b17f11bfa4c95146d4ee75f54"},{url:"/assets/resources/hotshot-crew.png",revision:"7ee62a04faaf97fa26100d6596ffea4b"},{url:"/assets/resources/notifications/fire-extinguisher.png",revision:"38c84a36b64f0963b7c0645a9ce50a47"},{url:"/assets/resources/notifications/fire-hose.png",revision:"5f3b2ca5f15d4592866fb945239672d8"},{url:"/assets/resources/notifications/firetruck.png",revision:"52e8ea369a5b53651f60a3fc908dc3bf"},{url:"/assets/resources/notifications/helicopter.png",revision:"33f704bf1fba1e3444ec7dff766b7a8b"},{url:"/assets/resources/smokejumpers.png",revision:"8cac076fd8c43559f6a1bd7fd270de1c"},{url:"/assets/resources/tooltips/airtanker.png",revision:"09a84a03bedb9f64610f32aea3f49b25"},{url:"/assets/resources/tooltips/fire-extinguisher.png",revision:"5b14112dbf92bd8e0f6717ad981300bf"},{url:"/assets/resources/tooltips/fire-hose.png",revision:"7cc0ca1d0cc87cd36b1d52c8e98bca91"},{url:"/assets/resources/tooltips/firetruck.png",revision:"e5d17a37b1dcd90f99c51d14e85b4b7d"},{url:"/assets/resources/tooltips/helicopter.png",revision:"a86fd3ff87bc38117c5d872d7ae98828"},{url:"/assets/resources/tooltips/hotshot-crew.png",revision:"80851d48dfa9b8113c784973750f76b5"},{url:"/assets/resources/tooltips/smokejumpers.png",revision:"0dd2927ae4b5cd68fd41daab30e6451a"},{url:"/assets/temp-logo.png",revision:"81d4b4af2228f363aaa953bccdc1929c"},{url:"/assets/tilemaps/DryGrassTest.json",revision:"6cb6aaa2cad0481c921bce5b7093bc6d"},{url:"/assets/tilemaps/SampleMap.tmj",revision:"42e5622db3492df95cf63533a6607e45"},{url:"/css/style.css",revision:"11644d7471ec31bb47c1e69ab45e2920"},{url:"/favicon.ico",revision:"338abbb5ea8d80b9869555eca253d49d"},{url:"/icon.png",revision:"7676155efec287aaaa1b78ea9a79120d"},{url:"/icon.svg",revision:"d9f4257134b385e84000aacc6d3b8737"},{url:"/index.html",revision:"486d59b2d1284e38a757f2ff50389e19"},{url:"/js/816.6706480ed90880753121.js",revision:null},{url:"/js/816.6706480ed90880753121.js.LICENSE.txt",revision:"b1daa0603488f9cd2983d070c697e378"},{url:"/js/app.baed7102d103861ffcbd.js",revision:null},{url:"/js/runtime.2a8f990b0a42d2ac7673.js",revision:null},{url:"/robots.txt",revision:"00733c197e59662cf705a2ec6d881d44"},{url:"/site.webmanifest",revision:"d19f4e2b84a71c74cca199f218f5dc71"}],{})}));
