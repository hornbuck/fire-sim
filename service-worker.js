if(!self.define){let s,e={};const i=(i,r)=>(i=new URL(i+".js",r).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(r,a)=>{const f=s||("document"in self?document.currentScript.src:"")||location.href;if(e[f])return;let c={};const n=s=>i(s,f),o={module:{uri:f},exports:c,require:n};e[f]=Promise.all(r.map((s=>o[s]||n(s)))).then((s=>(a(...s),c)))}}define(["./workbox-1f84e78b"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"/fire-sim/404.html",revision:"138033a20b2195287e0330a9ce592700"},{url:"/fire-sim/assets/64x64-Map-Tiles/Berry Bushes/berry-bush-on-flowers.png",revision:"62da48f433495f2ef8e99b5e6d0c1e99"},{url:"/fire-sim/assets/64x64-Map-Tiles/Berry Bushes/berry-bush-on-light-dirt.png",revision:"be19fca191063b3b97a547ba4b1455ae"},{url:"/fire-sim/assets/64x64-Map-Tiles/Berry Bushes/berry-bush-on-mud.png",revision:"d16d1979c5b8a5091b8d8288158409e2"},{url:"/fire-sim/assets/64x64-Map-Tiles/Berry Bushes/berry-bush-on-rock.png",revision:"c296fd84e81b12fd441cef5a9015b6e5"},{url:"/fire-sim/assets/64x64-Map-Tiles/Berry Bushes/berry-bush-on-sand.png",revision:"27303f2d474e9f51dca23d8d80013736"},{url:"/fire-sim/assets/64x64-Map-Tiles/Big Grasses/grass-on-flowers.png",revision:"ee483c5acc978b0a0b08f2ba18c3c01a"},{url:"/fire-sim/assets/64x64-Map-Tiles/Big Grasses/grass-on-light-dirt.png",revision:"9d3350d44a4dbfdbbb22b9d283f1e1db"},{url:"/fire-sim/assets/64x64-Map-Tiles/Big Grasses/grass-on-mud.png",revision:"5d81342269ee830596d6fc0aef6b749c"},{url:"/fire-sim/assets/64x64-Map-Tiles/Big Grasses/grass-on-rock.png",revision:"70ab07419ac597b1698a41a2814bdd6b"},{url:"/fire-sim/assets/64x64-Map-Tiles/Big Grasses/grass-on-sand.png",revision:"338c92bb6faa06196f67b49c99b11beb"},{url:"/fire-sim/assets/64x64-Map-Tiles/Burned Tiles/burned-grass.png",revision:"05f1e0a75b99ca49220c22b92f09e89b"},{url:"/fire-sim/assets/64x64-Map-Tiles/Burned Tiles/burned-shrubs-on-sand.png",revision:"61d9668b8286fa54a914e30c49234b90"},{url:"/fire-sim/assets/64x64-Map-Tiles/Burned Tiles/burned-trees-on-light-dirt.png",revision:"781ed1b0b3eddf0dc658254b86fa7b8d"},{url:"/fire-sim/assets/64x64-Map-Tiles/Bushes/bush-on-flowers.png",revision:"6a468bbeaf2dfe97f8dedc156637ac4a"},{url:"/fire-sim/assets/64x64-Map-Tiles/Bushes/bush-on-light-dirt.png",revision:"6ed70b92ca1768a4e427a93aad5d226e"},{url:"/fire-sim/assets/64x64-Map-Tiles/Bushes/bush-on-mud.png",revision:"1de81c37f62da83a343f0e0643b80926"},{url:"/fire-sim/assets/64x64-Map-Tiles/Bushes/bush-on-rock.png",revision:"497b3883bb71a14be8334d449e65d537"},{url:"/fire-sim/assets/64x64-Map-Tiles/Bushes/bush-on-sand.png",revision:"748c42b57af2ea9fcf697e236358398c"},{url:"/fire-sim/assets/64x64-Map-Tiles/Deployable Resources/airtanker.png",revision:"b95b1a70e95f6bbc389d1583fbcd9dc8"},{url:"/fire-sim/assets/64x64-Map-Tiles/Deployable Resources/extinguisher.png",revision:"09f7f8a67845b8e78fb4736aefc9409d"},{url:"/fire-sim/assets/64x64-Map-Tiles/Deployable Resources/fire-hose.png",revision:"51af24b7c21414f103678871cd1a2761"},{url:"/fire-sim/assets/64x64-Map-Tiles/Deployable Resources/firetruck.png",revision:"18fb034284e3a403809ca6a8cb188743"},{url:"/fire-sim/assets/64x64-Map-Tiles/Deployable Resources/helicopter.png",revision:"536b019383377c926ec71fc8cc12114f"},{url:"/fire-sim/assets/64x64-Map-Tiles/Deployable Resources/hotshot-crew.png",revision:"67309d548eb9d05563912cd00481813e"},{url:"/fire-sim/assets/64x64-Map-Tiles/Deployable Resources/smokejumpers.png",revision:"465db192f84cc0a53b379898c8fe2449"},{url:"/fire-sim/assets/64x64-Map-Tiles/Deployable Resources/trench-digger.png",revision:"467fdd10296d9fa5ec7fc5ac00117c04"},{url:"/fire-sim/assets/64x64-Map-Tiles/Dry Grass/dry-grass-on-flowers.png",revision:"02f3c8b7864a7b360fe1b2e80f82e306"},{url:"/fire-sim/assets/64x64-Map-Tiles/Dry Grass/dry-grass-on-light-dirt.png",revision:"c6697512fe3fa573e15578b9c4f741b4"},{url:"/fire-sim/assets/64x64-Map-Tiles/Dry Grass/dry-grass-on-mud.png",revision:"dcdcc1e890ae834800604ac255745278"},{url:"/fire-sim/assets/64x64-Map-Tiles/Dry Grass/dry-grass-on-rock.png",revision:"15843fd3816ed5cf317ec6307d071ec0"},{url:"/fire-sim/assets/64x64-Map-Tiles/Dry Grass/dry-grass-on-sand.png",revision:"e4222e0bc32bee6aece2613a558dcd9c"},{url:"/fire-sim/assets/64x64-Map-Tiles/Extinguished Tiles/grass.png",revision:"1a5a85424ef46e465ae6f3d29e4dd849"},{url:"/fire-sim/assets/64x64-Map-Tiles/Extinguished Tiles/shrub.png",revision:"802a3f2cd1880cea75311ecfa16d22fe"},{url:"/fire-sim/assets/64x64-Map-Tiles/Extinguished Tiles/tree.png",revision:"1161101ec564e6d138eecf807025d626"},{url:"/fire-sim/assets/64x64-Map-Tiles/Flower Bushes/flower-bush-on-flowers.png",revision:"dabea6e338ab6dbfc521fdff65f08156"},{url:"/fire-sim/assets/64x64-Map-Tiles/Flower Bushes/flower-bush-on-light-dirt.png",revision:"dc88e221fb0f269c18693c85b373ca5c"},{url:"/fire-sim/assets/64x64-Map-Tiles/Flower Bushes/flower-bush-on-mud.png",revision:"56c03439d6b91a2bd33bd8a9caaf6ca3"},{url:"/fire-sim/assets/64x64-Map-Tiles/Flower Bushes/flower-bush-on-rock.png",revision:"243bde4467bd48056ca7353671f984a9"},{url:"/fire-sim/assets/64x64-Map-Tiles/Flower Bushes/flower-bush-on-sand.png",revision:"dcc4bdae391a056c5fffe0df458953d9"},{url:"/fire-sim/assets/64x64-Map-Tiles/Pile of Rocks/rock-pile-on-flowers.png",revision:"3a33a91130bf69ca3dce5412372c9af3"},{url:"/fire-sim/assets/64x64-Map-Tiles/Pile of Rocks/rock-pile-on-light-dirt.png",revision:"1e6ea4a88f6b955e3cff477acf6da6d8"},{url:"/fire-sim/assets/64x64-Map-Tiles/Pile of Rocks/rock-pile-on-mud.png",revision:"bb6b6719b27c60f3c922c68960db9c92"},{url:"/fire-sim/assets/64x64-Map-Tiles/Pile of Rocks/rock-pile-on-rock.png",revision:"23f5d542e40ed79b9cbd93c7df36388a"},{url:"/fire-sim/assets/64x64-Map-Tiles/Pile of Rocks/rock-pile-on-sand.png",revision:"6337068fee76b50979849a839fdb245e"},{url:"/fire-sim/assets/64x64-Map-Tiles/Shrubs/shrubs-on-flowers.png",revision:"766f00c3ecf8f9b223828563ca418b59"},{url:"/fire-sim/assets/64x64-Map-Tiles/Shrubs/shrubs-on-light-dirt.png",revision:"bbf3dee55f3376d8c3d06fe9e6dc3269"},{url:"/fire-sim/assets/64x64-Map-Tiles/Shrubs/shrubs-on-mud.png",revision:"a316313c7842f72b483a66a9a2873313"},{url:"/fire-sim/assets/64x64-Map-Tiles/Shrubs/shrubs-on-rock.png",revision:"48e3353a6cd1f129e584863a152b5a26"},{url:"/fire-sim/assets/64x64-Map-Tiles/Shrubs/shrubs-on-sand.png",revision:"84a9e7a9bca70bbcc34befacaf3e6e0e"},{url:"/fire-sim/assets/64x64-Map-Tiles/Trees/trees-on-flowers.png",revision:"40c5e41b8c4ce63361b2fd8b9574ca9f"},{url:"/fire-sim/assets/64x64-Map-Tiles/Trees/trees-on-light-dirt.png",revision:"57e97de67d1881dfe11013af3081e054"},{url:"/fire-sim/assets/64x64-Map-Tiles/Trees/trees-on-mud.png",revision:"48466cf069fa73370b551973de72f8c2"},{url:"/fire-sim/assets/64x64-Map-Tiles/Trees/trees-on-rock.png",revision:"31e0861ab43cdfaa4428f17158c619fc"},{url:"/fire-sim/assets/64x64-Map-Tiles/Trees/trees-on-sand.png",revision:"8cd9771f712cbf889e40183cbe734274"},{url:"/fire-sim/assets/64x64-Map-Tiles/animated-flame.png",revision:"7a1db9ec9c1a15b313ced24b9b9609ca"},{url:"/fire-sim/assets/64x64-Map-Tiles/flowers.png",revision:"d8c1655a4cb52363809d91e4b176137d"},{url:"/fire-sim/assets/64x64-Map-Tiles/flowers2.png",revision:"550fc95856e19df560c4e24209785587"},{url:"/fire-sim/assets/64x64-Map-Tiles/grass.png",revision:"d7a3b283e84e0ac74e0edf0858bb77bc"},{url:"/fire-sim/assets/64x64-Map-Tiles/light-dirt.png",revision:"fd18d9c65cedbc00e80fb3865d64a7fc"},{url:"/fire-sim/assets/64x64-Map-Tiles/mud.png",revision:"c8a84c419441210e2053c498c648ebde"},{url:"/fire-sim/assets/64x64-Map-Tiles/rock.png",revision:"4c28d598b8f92df03bfb4623d91a8951"},{url:"/fire-sim/assets/64x64-Map-Tiles/sand.png",revision:"b58a2fa1ac18645c80ff5aeb69b81c53"},{url:"/fire-sim/assets/64x64-Map-Tiles/splash-sheet.png",revision:"fd4601debd1b421d75c5cbc1bd4cf6e2"},{url:"/fire-sim/assets/64x64-Map-Tiles/water.png",revision:"5f3c90f31c013d19b58844f0dcbe7b00"},{url:"/fire-sim/assets/UI/Title.png",revision:"aaae2669cc73d0ec4bc253cb05cbbb4d"},{url:"/fire-sim/assets/UI/add-to-cart.png",revision:"c445b9d5d947f6d71cf09db3f696e2fd"},{url:"/fire-sim/assets/UI/close.png",revision:"f0201b03337ef70c621d3a101a635796"},{url:"/fire-sim/assets/UI/east.png",revision:"8f410f0500d129dcf8653a480b7835d4"},{url:"/fire-sim/assets/UI/humidity_full.png",revision:"ffe8ff0355bdbdcc1f26aa6a8fa75ed9"},{url:"/fire-sim/assets/UI/humidity_half.png",revision:"02766096e40ab775dd5443acc49654a2"},{url:"/fire-sim/assets/UI/humidity_low.png",revision:"d1657b4360e25ae217e8ebb2da885fc2"},{url:"/fire-sim/assets/UI/login.png",revision:"c89dddeeeeb934c5e35430b1e294b577"},{url:"/fire-sim/assets/UI/no-funds.png",revision:"b8230e2ebcce45fc9c363b8e43837746"},{url:"/fire-sim/assets/UI/north.png",revision:"29f9fb0f7f50c294d95c8f5eb227d790"},{url:"/fire-sim/assets/UI/open-shop.png",revision:"2b6733c6c13f2fba9feda28f9d859db8"},{url:"/fire-sim/assets/UI/price-tag.png",revision:"0694dd176e789613d62943bab43cd918"},{url:"/fire-sim/assets/UI/purchase.png",revision:"7629363c9416b564e0656dc3f1cda00b"},{url:"/fire-sim/assets/UI/remove-button.png",revision:"b86d85762ebd3c17a19846c29d022ee1"},{url:"/fire-sim/assets/UI/remove-from-cart.png",revision:"4f750ba5b0798c2083a3f84870cb83e5"},{url:"/fire-sim/assets/UI/restartButton.png",revision:"497d091b81cb9212da21e9fccda68a6c"},{url:"/fire-sim/assets/UI/shop.png",revision:"8292951f96a30e7a89bbab528969304c"},{url:"/fire-sim/assets/UI/south.png",revision:"ba47a2e4c0e131150ace2900d181a3ae"},{url:"/fire-sim/assets/UI/toggle-add-to-cart.png",revision:"4f21aaae23a3a0e980b335b156f55840"},{url:"/fire-sim/assets/UI/weather_panel.png",revision:"13efdb0e35c8cad11ab05eea4af934ce"},{url:"/fire-sim/assets/UI/weather_title.png",revision:"93bfa4f90a9899dbc001de8deb226857"},{url:"/fire-sim/assets/UI/weather_title_closed.png",revision:"f3587d26fb1185a64c1559706f6d6308"},{url:"/fire-sim/assets/UI/weather_title_opened.png",revision:"13121b69a0c7fc8eaa165a19f3c6cc50"},{url:"/fire-sim/assets/UI/west.png",revision:"72fd009a49bca69c8a3e0b9615ddc560"},{url:"/fire-sim/assets/UI/wind_1arrow.png",revision:"5a00658cdaa6270c376355459b82ed49"},{url:"/fire-sim/assets/UI/wind_2arrow.png",revision:"2b9224db0f83803b62502b755fe1d7c0"},{url:"/fire-sim/assets/UI/wind_3arrow.png",revision:"752fe0151a8256e1125d63158fb7738f"},{url:"/fire-sim/assets/UI/wind_direction_arrow.png",revision:"c17b527356c4b42a8122933b80b7e9fe"},{url:"/fire-sim/assets/coins.png",revision:"9ac9804206c8168d5bc7df7f0c83eca2"},{url:"/fire-sim/assets/cursors/airtanker.png",revision:"0abb058c448882572b3b3bfaa10ac24a"},{url:"/fire-sim/assets/cursors/fire-extinguisher.png",revision:"45b3cc986a4efcda3bdbbcf140c5144f"},{url:"/fire-sim/assets/cursors/firetruck.png",revision:"6b6d3b82d60935bb326969c04c8776d4"},{url:"/fire-sim/assets/cursors/glove.png",revision:"564e0a1b91e4e644aafa19628c8bf60d"},{url:"/fire-sim/assets/cursors/helicopter.png",revision:"78493a44f9e36e9ff3877420297ffa65"},{url:"/fire-sim/assets/cursors/hotshot-crew.png",revision:"1890239c8676144be2c7c1bb5b935968"},{url:"/fire-sim/assets/cursors/launch.png",revision:"d46184724573a031dbfd72d3efeee8d2"},{url:"/fire-sim/assets/cursors/water.png",revision:"bb3b8bb204807cf71fb4b792795c32e2"},{url:"/fire-sim/assets/icons/ForestFireBackground.jpg",revision:"5c892495c7cc070eeba387272c4b490a"},{url:"/fire-sim/assets/icons/atIcon.svg",revision:"db64a43eff290eb71a12c1f4bc37d20e"},{url:"/fire-sim/assets/icons/lockIcon.svg",revision:"426041fab41c06444d564ec73708a6a9"},{url:"/fire-sim/assets/icons/personIcon.svg",revision:"56471a242aaf471f30c8a211d24566a2"},{url:"/fire-sim/assets/resources/activated/airtanker.png",revision:"2a43e38b72ca983b5cde75700e1342df"},{url:"/fire-sim/assets/resources/activated/fire-extinguisher.png",revision:"e4e951dcee8be772885762b584739080"},{url:"/fire-sim/assets/resources/activated/fire-hose.png",revision:"c92a5a1e6fc18e3e7e7b7278b8eef41b"},{url:"/fire-sim/assets/resources/activated/firetruck.png",revision:"1dc7d4b25f991e023711a8a586714a67"},{url:"/fire-sim/assets/resources/activated/helicopter.png",revision:"3304141c01cd8e93d6d5a39a75b08759"},{url:"/fire-sim/assets/resources/activated/hotshot-crew.png",revision:"b1f54bee9e51f007ac01cee2dffe56de"},{url:"/fire-sim/assets/resources/activated/smokejumpers.png",revision:"3753bc737855d3c4b4bb765f99c39416"},{url:"/fire-sim/assets/resources/airtanker.png",revision:"a3fbc4b61b8bcd9bb3aad413a410dd14"},{url:"/fire-sim/assets/resources/fire-extinguisher.png",revision:"2b4a3902119123a378d08fb5323b0485"},{url:"/fire-sim/assets/resources/fire-hose.png",revision:"9cf00d68a204d000581ead65b5523827"},{url:"/fire-sim/assets/resources/firetruck.png",revision:"0f747251f779030a70e0a0f7f099c177"},{url:"/fire-sim/assets/resources/helicopter.png",revision:"d5a05f7b17f11bfa4c95146d4ee75f54"},{url:"/fire-sim/assets/resources/hotshot-crew.png",revision:"7ee62a04faaf97fa26100d6596ffea4b"},{url:"/fire-sim/assets/resources/notifications/airtankers.png",revision:"36bf9580c8600f673acee43b783f2db7"},{url:"/fire-sim/assets/resources/notifications/cooldown.png",revision:"1805d2f6e23987f64af3cfdac94213f0"},{url:"/fire-sim/assets/resources/notifications/fire-extinguisher.png",revision:"38c84a36b64f0963b7c0645a9ce50a47"},{url:"/fire-sim/assets/resources/notifications/fire-hose.png",revision:"5f3b2ca5f15d4592866fb945239672d8"},{url:"/fire-sim/assets/resources/notifications/firetruck.png",revision:"52e8ea369a5b53651f60a3fc908dc3bf"},{url:"/fire-sim/assets/resources/notifications/helicopter.png",revision:"33f704bf1fba1e3444ec7dff766b7a8b"},{url:"/fire-sim/assets/resources/notifications/hotshot-crews.png",revision:"e8b7b17cfd2f0b93dde6eb3b6706e3ba"},{url:"/fire-sim/assets/resources/notifications/smokejumpers.png",revision:"8c7174e405771900963e266f730f5ab0"},{url:"/fire-sim/assets/resources/smokejumpers.png",revision:"8cac076fd8c43559f6a1bd7fd270de1c"},{url:"/fire-sim/assets/resources/tooltips/airtanker.png",revision:"09a84a03bedb9f64610f32aea3f49b25"},{url:"/fire-sim/assets/resources/tooltips/fire-extinguisher.png",revision:"5b14112dbf92bd8e0f6717ad981300bf"},{url:"/fire-sim/assets/resources/tooltips/fire-hose.png",revision:"7cc0ca1d0cc87cd36b1d52c8e98bca91"},{url:"/fire-sim/assets/resources/tooltips/firetruck.png",revision:"e5d17a37b1dcd90f99c51d14e85b4b7d"},{url:"/fire-sim/assets/resources/tooltips/helicopter.png",revision:"a86fd3ff87bc38117c5d872d7ae98828"},{url:"/fire-sim/assets/resources/tooltips/hotshot-crew.png",revision:"80851d48dfa9b8113c784973750f76b5"},{url:"/fire-sim/assets/resources/tooltips/smokejumpers.png",revision:"0dd2927ae4b5cd68fd41daab30e6451a"},{url:"/fire-sim/assets/tilemaps/DryGrassTest.json",revision:"6cb6aaa2cad0481c921bce5b7093bc6d"},{url:"/fire-sim/assets/tilemaps/SampleMap.tmj",revision:"42e5622db3492df95cf63533a6607e45"},{url:"/fire-sim/assets/timer.png",revision:"9f438b96ebfaee01d4bbb7a1cfdcbce0"},{url:"/fire-sim/assets/title-logo.jpeg",revision:"ad5d5863042df4332b151356023f8027"},{url:"/fire-sim/css/style.css",revision:"11644d7471ec31bb47c1e69ab45e2920"},{url:"/fire-sim/favicon.ico",revision:"338abbb5ea8d80b9869555eca253d49d"},{url:"/fire-sim/icon.png",revision:"7676155efec287aaaa1b78ea9a79120d"},{url:"/fire-sim/icon.svg",revision:"d9f4257134b385e84000aacc6d3b8737"},{url:"/fire-sim/index.html",revision:"6b4239f1acaab0611fc3405c1a9b27df"},{url:"/fire-sim/js/816.6706480ed90880753121.js",revision:null},{url:"/fire-sim/js/816.6706480ed90880753121.js.LICENSE.txt",revision:"b1daa0603488f9cd2983d070c697e378"},{url:"/fire-sim/js/app.bd502ec06f6110a2dc84.js",revision:null},{url:"/fire-sim/js/runtime.2a8f990b0a42d2ac7673.js",revision:null},{url:"/fire-sim/robots.txt",revision:"00733c197e59662cf705a2ec6d881d44"},{url:"/fire-sim/site.webmanifest",revision:"d19f4e2b84a71c74cca199f218f5dc71"}],{})}));
