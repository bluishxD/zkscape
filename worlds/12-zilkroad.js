/* ZKSCAPE world 12: THE ZK MARKET (Zilkroad) - the marketplace of identities.

   THE QUESTION: what does it mean to choose, purchase and own a digital collectible?

   THE MECHANIC: one complete simulated purchase. You walk the arcade, inspect a listing, pin two to the
   Inspection Table and compare them, decide, review, confirm or cancel, wait while the transaction is
   pending, see it resolve (it can fail), and then the portrait is in your collection, can be inspected as
   something you own, and can be worn as your portrait inside this world.

   NOTHING HERE IS REAL MONEY OR A REAL TRANSACTION. The purse, prices, sellers, listings, the pending
   state and every ownership change are game state, labelled SIM everywhere they appear.

   ART: the portraits are the real zkSNARK artworks, drawn 1:1 (26x26 pixel grids extracted cell-for-cell
   from the supplied PNGs; the Poopie's hat lettering is a higher-resolution layer). Four extra portraits
   are original fictional pieces drawn for this game. Verified facts (the three record sales, the Poopie)
   are kept apart from fictional game data: the Hall of Records is real, the Arcade's listings are not.

   THE MYSTERY: a listing in the back alley claims to be a famous piece, at an impossible price. The portrait
   in the frame is not the piece it claims to be. Solving it takes comparison, not a key.

   ENGINE: same hooks as every adventure world (bg / avatar / startWorld / stopWorld) plus a scoped fore() so
   the shared pink fog wedges cannot tint this world. Persistence is S.zk through the engine's save().
   The registration block below is the original, unchanged. */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
W.push({id:'zilkroad',n:'ZILKROAD',bonus:1,title:'THE ZK MARKET',sub:'Shielded identities, on display',q:'Culture lives on Zcash too.',video:'videos/zilkroad.mp4',link:'zilkroad',linkLabel:'VISIT ZILKROAD',more:'EXPLORE ZKSNARKS',desc:'zkSNARKs is a collection of 10,000 shielded identities on Zcash.',steps:[
 'zkSNARKs is a collection of 10,000 shielded identities on Zcash.','Zilkroad is the marketplace and index for the collection.','Exploring is free. Buying one is never required to complete ZKSCAPE.'],deep:'Collectibles are not financial advice.'});
A.zilkroad='Market Token';
A.zilkroad='Market Token';
TH.zilkroad={sky:['#0a0420','#2c0a4c'],moon:[.15,.2,.1,'#ff6ad5','planet'],mt:'#0b0522',fog:'#14072e',amb:'pix'};
DEC.zilkroad=function(){};GIANT.zilkroad=function(){};
LM.zilkroad=function(x,y,s,c,t,a,B){for(let k=0;k<9;k++)hg.fillRect(-s+(k%3)*s*.7,-s+((k/3)|0)*s*.7,s*.5,s*.5)};

const ZSD={"glitch":{"n":26,"rows":["..........................","..........................","..........................","..........................","..........................","..........................",".....Āā..ĂāĀăăăăăăă.......",".......āĄĂāăăăąąąąăă......","...Ćć.ĆĆĈćĆăăąąąąąąą......",".....ĉĂĂĈāăăąąąąąąąąă.....","........ĄĂăăąąąąąąąąă.....","...ā.ĀāāĄĂăăąąąąąąąąą.....","......ĆĆĈćăăąąąąąąąąą.....","........ĈāăăąąĊĊąąĊĊą.....","....Ă..āĄĂăăąąċČąąċčą.....",".....ĀāāĄĂăăąąąąąąąąą.....","..ĆĆ....Ĉćăăąąąąąąąąą.....",".........āăăăąąąąąąąă.....","......āāĄĂāăăąąąąąąą......",".........ĂāĀăăăąąąăă......","....ćĉ..ĈćĆĉććăăăăă.......","......ĂĂĈāĂĉāāĈĂāĉĂĂ......",".......āĄĂāĀĂĂĄāĂĀāāĄ.....","...āĂĀāāĄĂāĀĂĂĄāĂĀāāĄ.....",".....ĉĆĆĈćĆĉććĈĆćĉĆĆĈć....","....āĉĂĂĈāĂĉāāĈĂāĉĂĂĈā...."],"pal":{"Ā":"#1f30dd","ā":"#dde1de","Ă":"#0f1416","ă":"#191f22","Ą":"#c4da00","ą":"#0a0e10","Ć":"#262d2f","ć":"#f1f1ec","Ĉ":"#e81c30","ĉ":"#0dd2c9","Ċ":"#dddddd","ċ":"#f1f1f1","Č":"#fefefd","č":"#fdfefd"}},"visor":{"n":26,"rows":["..........................","..........................","..........................","..........................","..........................","..........................",".....Āā..ĂăĄąĆĆĆĆĆĆ.......",".......ćĈĉĊċąĆČČččĆĎ......","...ďĐ.đĒēĔĕĆĆČČčČĖČč......",".....ėĘęĚěĆĆčČččČČččĆ.....","........ĜĝĆĆČčČčččČčĆ.....","...Ğ.ğĠġĢģĤĆČČČČČČČčč.....","......ĥĦħĨĩĩĩĪĪĪĪĪĪĪĪĪ....","........īĬĩĩĩĪĭĮįİıĲĳĪ....","....Ĵ..ĵĶķĆĩĩĪĸĹĺĻļĽľĪ....",".....ĿŀŁłķĆĆĩĪĪĪĪĪĪĪĪĪ....","..Ńń....ŅņąĆČčČččČčČč.....",".........ŇĤĆĆčČČččČČĆ.....","......ňŉŊŋŌĆĆČČČčČČČ......",".........ōŎŏċĆĆČčČĆĆ......","....Őő..ŒœŔŕŖŗĆĆĆĆĆ.......","......ŘřŚśŜŝŞşŠšŢţŤť......",".......ŦŧŨũŪūŬŭŮůŰűŲų.....","...ŴŵŶŷŸŹźŻżŽžſƀƁƂƃƄƅ.....",".....ƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖ....","....ƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨ...."],"pal":{"Ā":"#acd19c","ā":"#acb776","Ă":"#efa379","ă":"#efb27d","Ą":"#eba783","ą":"#2f2c2a","Ć":"#2f2d2a","ć":"#e1d580","Ĉ":"#e9b86c","ĉ":"#e9aa6c","Ċ":"#e79a70","ċ":"#2e2d2a","Č":"#161412","č":"#161411","Ď":"#2f2c29","ď":"#aad199","Đ":"#a5b774","đ":"#add196","Ē":"#b4d092","ē":"#ded586","Ĕ":"#e9be79","ĕ":"#e9ab77","Ė":"#161311","ė":"#eec978","Ę":"#e6c96a","ę":"#c5c67c","Ě":"#a6c199","ě":"#d1c8a1","Ĝ":"#c9c4b2","ĝ":"#adabcf","Ğ":"#c6b1cd","ğ":"#efa677","Ġ":"#e79e65","ġ":"#e9b36a","Ģ":"#ddbe82","ģ":"#baa3bd","Ĥ":"#2f2d29","ĥ":"#efa976","Ħ":"#e99f67","ħ":"#e9ad6a","Ĩ":"#e3bf7f","ĩ":"#070707","Ī":"#141414","ī":"#eeac77","Ĭ":"#efc07f","ĭ":"#041c10","Į":"#043119","į":"#034822","İ":"#035e2b","ı":"#077736","Ĳ":"#148f43","ĳ":"#30a752","Ĵ":"#a8a1a8","ĵ":"#eebf89","Ķ":"#efaa7b","ķ":"#e79b6f","ĸ":"#074123","Ĺ":"#056831","ĺ":"#00913e","Ļ":"#00be4c","ļ":"#12e05e","Ľ":"#48f47d","ľ":"#97ffac","Ŀ":"#c0cdb2","ŀ":"#c9c88c","Ł":"#e8c77e","ł":"#e9b276","Ń":"#a8bbd0","ń":"#a1a2aa","Ņ":"#edd28d","ņ":"#eebf86","Ň":"#efc689","ň":"#b0b6cf","ŉ":"#bbccb4","Ŋ":"#c3c88b","ŋ":"#e7c67c","Ō":"#e9a66d","ō":"#dcd487","Ŏ":"#e4ad62","ŏ":"#e9a069","Ő":"#b4b2cf","ő":"#999fa8","Œ":"#add19c","œ":"#c1be71","Ŕ":"#e1c065","ŕ":"#e4a560","Ŗ":"#e3945d","ŗ":"#eda076","Ř":"#abb9cb","ř":"#b3c4be","Ś":"#9cc58b","ś":"#adc586","Ŝ":"#cabf70","ŝ":"#e3bd65","Ş":"#e4a761","ş":"#e2945d","Š":"#e38b61","š":"#e38b5e","Ţ":"#e3985e","ţ":"#e4a060","Ť":"#e2b769","ť":"#e8c57b","Ŧ":"#a7a9ce","ŧ":"#b3c5af","Ũ":"#a1c48b","ũ":"#adc486","Ū":"#d5c979","ū":"#e9b76f","Ŭ":"#e2a461","ŭ":"#e4955d","Ů":"#e5945e","ů":"#e5925e","Ű":"#e9a76c","ű":"#e9bc76","Ų":"#e2c47f","ų":"#e7cb80","Ŵ":"#edd183","ŵ":"#e9b772","Ŷ":"#dea787","ŷ":"#b89fbe","Ÿ":"#a69ac0","Ź":"#a6a4cf","ź":"#b3c4b2","Ż":"#a8ca9b","ż":"#b2c993","Ž":"#dacc87","ž":"#e9bf7d","ſ":"#ebbd7e","ƀ":"#ebb77d","Ɓ":"#e9b37c","Ƃ":"#eba376","ƃ":"#ebab78","Ƅ":"#e8bc85","ƅ":"#d0cd97","Ɔ":"#efb887","Ƈ":"#d5aca8","ƈ":"#bca4cd","Ɖ":"#a299bf","Ɗ":"#a1a1bf","Ƌ":"#a3c493","ƌ":"#9dca97","ƍ":"#b8ca92","Ǝ":"#d5cd8a","Ə":"#e9ce86","Ɛ":"#eac184","Ƒ":"#eab27d","ƒ":"#eba47b","Ɠ":"#e7a37f","Ɣ":"#ccb487","ƕ":"#a7c68e","Ɩ":"#ceca88","Ɨ":"#eda77f","Ƙ":"#e19263","ƙ":"#ebaf89","ƚ":"#ceacb6","ƛ":"#bba3ce","Ɯ":"#a7a0cf","Ɲ":"#a9b1c9","ƞ":"#a4c294","Ɵ":"#a5c489","Ơ":"#bac684","ơ":"#d4ca82","Ƣ":"#e8cb7e","ƣ":"#e7b97a","Ƥ":"#e9af7a","ƥ":"#e89c70","Ʀ":"#e3a27f","Ƨ":"#bfbc9a","ƨ":"#b2c68d"}},"d3":{"n":26,"rows":["..........................","..........................","..........................","..........................","..........................","..........................",".....Āā..ĂăĄąĆĆĆąćĆ.......",".......ĀĈāāĉćĆĊĊĊĊĆĆ......","...ċĄ.ČčĎāĄąĉĊĊĊĊĊĊĊ......",".....ďĄĈāāĆąĊĊĊĊĊĊĊĊĐ.....","........ĂċĆĉĊĊĊĊĊĊĊĊĆ.....","...ă.ďĄĈāāćąĊĊĊđĊĊĊĊĊ.....","......čāāĄĒĒĒēēēēēēēēē....","........ăĀĒĒĒēĔĕĕēĖėėē....","....ā..ĂăĄĆĒĒēĔĕĕēĖėėē....",".....ČĈāāĄĆĉĒēēēēēēēēē....","..Āā....ĀďąąĊĊĊĊĊĊĘęĊ.....",".........ĚąĐěĊĊĊĊĊĊĊĉ.....","......ĎăĄāĄĉĆĊĊĊĊĊĊĊ......",".........ĚĜĈĆąĆĊĊĊĉĆ......","....ĝĞ..ĚĜğāāĜĆĉĆĐĐ.......","......ăČāĄĠāāĜāĜĠāāĄ......",".......ĄġĄĈĢģĤĥĦħĨĩĄā.....","...ČĈāāĄġĄĪāāĄīĬĪāāĄġ.....",".....ċĄġĄĭĮįİıĬĲĳįİĴĄĈ....","....ĂĵĄġĄĪāāĄāĶķāāĄāĄĈ...."],"pal":{"Ā":"#9effff","ā":"#ffffff","Ă":"#ffebff","ă":"#ffe0f6","Ą":"#d9ffff","ą":"#bab9ba","Ć":"#bababa","ć":"#b9b9b9","Ĉ":"#ffffe8","ĉ":"#babab9","Ċ":"#2d2d2d","ċ":"#ffe0f7","Č":"#9dffff","č":"#ffffdd","Ď":"#ffecff","ď":"#bcffff","Đ":"#b9baba","đ":"#2d2e2d","Ē":"#a4aab5","ē":"#f4f6fa","Ĕ":"#ff5e65","ĕ":"#c32231","Ė":"#5cbbff","ė":"#1e5ec3","Ę":"#2e2d2e","ę":"#2e2e2d","Ě":"#bdffff","ě":"#b9b9ba","Ĝ":"#e4ffff","ĝ":"#ffffdc","Ğ":"#fffdff","ğ":"#fffff4","Ġ":"#fffff3","ġ":"#f8ffff","Ģ":"#ff89c9","ģ":"#ff5a64","Ĥ":"#67d5e8","ĥ":"#5f64b5","Ħ":"#36b573","ħ":"#ffc95e","Ĩ":"#ff5ea8","ĩ":"#ff8585","Ī":"#fffff2","ī":"#559aff","Ĭ":"#36ff8e","ĭ":"#fff468","Į":"#ff88ca","į":"#ff636b","İ":"#36f2ff","ı":"#86c5ff","Ĳ":"#fff551","ĳ":"#ff99ec","Ĵ":"#95a6ff","ĵ":"#fffbff","Ķ":"#36dd80","ķ":"#ffca47"}},"r9045":{"n":26,"rows":["..........................","..........................","..........................","..........................","..........................","..........................",".....ab..cabddddddd.......",".......abbbdddeeeedd......","...ab.aaabbddfgeehhe......",".....abbbbddgehehhhhd.....","........acddeefeeehed.....","...a.cbbbbddeehefghhg.....","......abbbddhehhhhheh.....","........aaddegiiehiih.....","....b..aabddegiiefiie.....",".....abbjbddehehhhheh.....","..ab....acddhgegefhee.....",".........adddeehefeed.....","......aabbbddfehehee......",".........ckbdddfhhdd......","....ab..akkkkkddddd.......","......aabbkkkkkkkkkb......",".......bbbblmnnnnmlbb.....","...abbbbbbbbbboobbbbb.....",".....abbbllpoqoqooolbb....","....cbbbbbbbbblmbbbbbb...."],"pal":{"a":"#74ffff","b":"#a1ffff","c":"#75ffff","d":"#00d4e7","e":"#52e9f2","f":"#51e9f2","g":"#51e9f3","h":"#52e9f3","i":"#ffeb57","j":"#a0ffff","k":"#a9ffff","l":"#00a6bb","m":"#00a6ba","n":"#008ca2","o":"#00bfd5","p":"#00bfd4","q":"#00c0d5"}},"r9284":{"n":26,"rows":["..........................","..........................","..........................","..........................","...........abcccccc.......",".........baacccccddc......",".....ef.aaacccccccdd......",".......ghbacccccccccc.....","...gf.eebbacccccccccc.....",".....ehhijklklmmlmlmln....",".......jjolnklmlkmnnml....","...g.phhiiqqrrrrrsstu.....","......ghhhvwxyzAzByzAy....","........egCDwyEEFAEEFz....","....f..eghCDwzEEFyEEFw....",".....ghhiGiDwxzyAzyBzx....","..gf....egffHCCHHHHHf.....",".........ghIICIHHIHCi.....","......gghiihhfvHHCHJ......",".........gfhhfhIIJIf......","....gf..gfffffhJJJJ.......","......gghhfffffffffh......",".......ffhfJfhJJhhvCh.....","...ghhhfhhiCIIJCJiiIh.....",".....gfffhJiiiiICCIihh....","....ghhffhCIICJIJiiJhh...."],"pal":{"a":"#5e2d83","b":"#5e2c83","c":"#733394","d":"#8f4fac","e":"#675a4c","f":"#1f1f1f","g":"#635447","h":"#272727","i":"#323232","j":"#452e69","k":"#523277","l":"#523276","m":"#513277","n":"#513276","o":"#452d69","p":"#625447","q":"#303030","r":"#aa9e88","s":"#9b8b7a","t":"#656159","u":"#252525","v":"#6a665d","w":"#7e5110","x":"#996818","y":"#d2a63b","z":"#bc8b25","A":"#e5c76c","B":"#f4e8c0","C":"#8b7c6d","D":"#5c370b","E":"#f2f2ee","F":"#0a0a0c","G":"#5bf4ff","H":"#b2a68f","I":"#a39280","J":"#6a655d"}},"r5235":{"n":26,"rows":["..........................","..........................","..........................","..........................","..........................","..........................",".....ab..cabddddddd.......",".......abbbdddeeeedd......","...ab.aaabbddfgeehhe......",".....abbbbddgehehhhhd.....","........acddeefeeehed.....","...a.cbbbbddeehefghhg.....","......abbbddhehhhhheh.....","........aaddegiiehiih.....","....b..aabddegjiefjie.....",".....abbkbddehehhhheh.....","..ab....acddhgegefhee.....",".........adddeehefeed.....","......aabbbddfehehee......",".........clbdddfhhdd......","....ab..alllllddddd.......","......aabblllllllllb......",".......bbbbmnoooonmbb.....","...abbbbbbbbbbppbbbbb.....",".....abbbmmqprprpppmbb....","....cbbbbbbbbbmnbbbbbb...."],"pal":{"a":"#74ffff","b":"#a1ffff","c":"#75ffff","d":"#00d4e7","e":"#52e9f2","f":"#51e9f2","g":"#51e9f3","h":"#52e9f3","i":"#16181d","j":"#eef0e7","k":"#a0ffff","l":"#a9ffff","m":"#00a6bb","n":"#00a6ba","o":"#008ca2","p":"#00bfd5","q":"#00bfd4","r":"#00c0d5"}},"poopie":{"n":26,"rows":["..........................","..........................","..........................","..........................","...........aabbbbbb.......",".........aaabbbbbccb......",".....de.aaabbbbbbbcc......",".......dfaabbbbbbbbbb.....","...de.ddaaabbbbbbbbbb.....",".....dfff.abbbbbbbbbbk....","..........aakkkkkakkkk....","...d.dffffeefffffffff.....","......dfffllmddddmddd.....","........ddllmmakmmkad.....","....e..ddfllmmgkmmgkd.....",".....dfffnllmmmmmmmmd.....","..de....ddllmmmmmmmmd.....",".........dlllmdmmmmml.....","......ddfffllmmmmmmd......",".........deflllmmdff......","....de..deeeeffllff.......","......ddffeeeeeeeeef......",".......ddffffeeeeffff.....","...dffffddddddddddddd.....",".....dddfffddddddddfff....","....medddddfffffffffff...."],"pal":{"a":"#0c0c0e","b":"#1d1d1f","c":"#37353a","d":"#835232","e":"#4a2f1e","f":"#6c4229","g":"#ebebeb","h":"#666666","i":"#2d2d2f","j":"#9a9a9a","k":"#141416","l":"#5e3820","m":"#7b4a2b","n":"#fdaf01"},"runs":[[94,53,2,"#79797b"],[96,53,8,"#6f6f71"],[94,54,1,"#ffffff"],[95,54,1,"#f1f1ef"],[96,54,8,"#f1f1f1"],[144,54,3,"#f1f1ef"],[94,55,1,"#ffffff"],[95,55,1,"#f1f1ef"],[96,55,8,"#f0f0ee"],[104,55,1,"#dddddd"],[105,55,1,"#eeeeee"],[144,55,3,"#eeeeec"],[94,56,1,"#ffffff"],[95,56,1,"#f0f0ee"],[96,56,8,"#f1f1ef"],[104,56,2,"#eeeeec"],[144,56,3,"#f3f3f1"],[94,57,1,"#ffffff"],[95,57,1,"#f0f0ee"],[96,57,2,"#efefed"],[102,57,1,"#fefefe"],[103,57,1,"#eeeeec"],[104,57,2,"#efefed"],[94,58,1,"#fffeff"],[95,58,1,"#f0efed"],[96,58,2,"#efefed"],[102,58,1,"#fcfcfc"],[103,58,1,"#ededeb"],[104,58,2,"#efefed"],[109,58,1,"#454547"],[110,58,2,"#68686a"],[112,58,4,"#676767"],[121,58,1,"#414141"],[122,58,1,"#575757"],[123,58,5,"#666465"],[132,58,4,"#646464"],[136,58,4,"#626262"],[151,58,1,"#636363"],[152,58,6,"#626262"],[94,59,1,"#fefefe"],[95,59,1,"#f1f0ee"],[96,59,2,"#efefed"],[102,59,1,"#fdfdfd"],[103,59,1,"#eeeeec"],[104,59,2,"#f0f0f0"],[109,59,1,"#828282"],[110,59,2,"#ededeb"],[112,59,4,"#f0f0ee"],[121,59,1,"#878789"],[122,59,6,"#f0eeef"],[132,59,4,"#f0f0f0"],[136,59,4,"#f0f0ee"],[144,59,3,"#ececec"],[151,59,1,"#ececec"],[152,59,5,"#efefef"],[157,59,1,"#d6d6d6"],[94,60,1,"#ffffff"],[95,60,1,"#f0efed"],[96,60,2,"#eeeeec"],[102,60,2,"#fbfbfb"],[104,60,2,"#efefef"],[108,60,1,"#b6b6b8"],[109,60,1,"#d5d5d5"],[110,60,2,"#eeeeec"],[112,60,4,"#f1f1ef"],[116,60,2,"#bebebe"],[120,60,1,"#b0b0b0"],[121,60,1,"#d1d1d1"],[122,60,6,"#f0efed"],[128,60,2,"#c1c1c3"],[132,60,4,"#eeedeb"],[136,60,4,"#f1f1ef"],[140,60,2,"#b9b9b9"],[144,60,3,"#f1f1ef"],[149,60,2,"#bbbbbb"],[151,60,1,"#f5f3f4"],[152,60,6,"#f1eff0"],[158,60,1,"#c7c7c7"],[94,61,1,"#fefeff"],[95,61,1,"#f1f0ee"],[96,61,2,"#efefed"],[98,61,4,"#000000"],[102,61,2,"#f9f9f9"],[104,61,2,"#eeeeee"],[108,61,3,"#efefef"],[111,61,1,"#ffffff"],[112,61,3,"#ffffff"],[115,61,3,"#ededed"],[120,61,3,"#eeeeec"],[123,61,4,"#ffffff"],[127,61,1,"#ebebe9"],[128,61,2,"#efefed"],[132,61,3,"#f0efed"],[135,61,1,"#fdfdfd"],[136,61,3,"#ffffff"],[139,61,3,"#efefef"],[144,61,3,"#f0f0ee"],[149,61,3,"#f5f5f3"],[152,61,7,"#f4f4f4"],[94,62,1,"#ffffff"],[95,62,1,"#f0f0ee"],[96,62,8,"#efefed"],[104,62,2,"#ededed"],[108,62,3,"#f0f0f0"],[114,62,1,"#808082"],[115,62,3,"#efefed"],[120,62,3,"#eeeced"],[126,62,1,"#444444"],[127,62,1,"#ededeb"],[128,62,2,"#eeeeec"],[132,62,3,"#f2f1ef"],[138,62,1,"#000000"],[139,62,3,"#eeeeee"],[144,62,3,"#eeeeee"],[149,62,3,"#f6f6f4"],[152,62,1,"#ffffff"],[156,62,3,"#f0f0f0"],[159,62,1,"#000000"],[94,63,1,"#ffffff"],[95,63,1,"#efefed"],[96,63,8,"#efefed"],[108,63,3,"#efefef"],[114,63,1,"#7f7f81"],[115,63,3,"#f1f1f1"],[120,63,3,"#ededeb"],[126,63,1,"#424242"],[127,63,1,"#eeeeec"],[128,63,2,"#efefed"],[132,63,3,"#f0efed"],[138,63,1,"#000000"],[139,63,3,"#efeff1"],[144,63,3,"#f0f0f0"],[149,63,3,"#f6f6f4"],[152,63,1,"#f9f9f9"],[153,63,3,"#757577"],[156,63,3,"#f4f4f4"],[159,63,1,"#000000"],[94,64,1,"#ffffff"],[95,64,1,"#efefed"],[96,64,8,"#efefed"],[108,64,3,"#f1f1f1"],[114,64,1,"#848484"],[115,64,3,"#f1f1f1"],[120,64,3,"#eeeeec"],[126,64,1,"#414143"],[127,64,1,"#f0f0f0"],[128,64,2,"#f2f2f0"],[132,64,3,"#efefed"],[138,64,1,"#000000"],[139,64,3,"#efefed"],[144,64,3,"#f0f0f0"],[149,64,3,"#f8f8f8"],[152,64,7,"#efefed"],[94,65,1,"#ffffff"],[95,65,1,"#efefed"],[96,65,2,"#efefed"],[108,65,3,"#f1f1f1"],[114,65,1,"#868686"],[115,65,3,"#f0f0f0"],[120,65,3,"#efefed"],[126,65,1,"#464648"],[127,65,1,"#f1f1ef"],[128,65,2,"#f1f1ef"],[132,65,3,"#f1f0ee"],[138,65,1,"#000000"],[139,65,3,"#efefed"],[144,65,3,"#f0f0f0"],[149,65,3,"#f8f8f8"],[152,65,7,"#f2f2f2"],[159,65,1,"#000000"],[94,66,1,"#ffffff"],[95,66,1,"#f0f0ee"],[96,66,2,"#f0f0ee"],[108,66,3,"#efefef"],[114,66,1,"#808080"],[115,66,3,"#f1f1ef"],[120,66,3,"#f0f0ee"],[126,66,1,"#434345"],[127,66,1,"#f0f0ee"],[128,66,2,"#efefed"],[132,66,3,"#f1f1ef"],[138,66,1,"#000000"],[139,66,3,"#eeeeec"],[144,66,3,"#efefed"],[149,66,3,"#f6f6f4"],[152,66,1,"#ffffff"],[94,67,1,"#fefefe"],[95,67,1,"#eeeeec"],[96,67,2,"#efefed"],[108,67,3,"#f0f0ee"],[114,67,1,"#808080"],[115,67,3,"#f1f1ef"],[120,67,3,"#f0f0f0"],[126,67,1,"#424242"],[127,67,1,"#f0efed"],[128,67,2,"#f0efed"],[132,67,4,"#efefed"],[136,67,6,"#ededeb"],[144,67,3,"#f1f0ee"],[149,67,3,"#f8f8f8"],[152,67,1,"#ffffff"],[94,68,1,"#ffffff"],[95,68,1,"#f0efed"],[96,68,2,"#f0efed"],[108,68,4,"#eeeef0"],[112,68,6,"#eeeeee"],[120,68,8,"#f4f2f3"],[128,68,2,"#efefef"],[132,68,4,"#efefed"],[136,68,4,"#ededed"],[144,68,3,"#efefef"],[149,68,3,"#f9f9f9"],[152,68,6,"#ededed"],[158,68,1,"#ffffff"],[94,69,1,"#fffeff"],[95,69,1,"#f0efed"],[96,69,2,"#f0efed"],[109,69,1,"#959595"],[110,69,2,"#ededeb"],[112,69,4,"#efefef"],[121,69,1,"#959595"],[122,69,6,"#f1f1f1"],[132,69,4,"#f0f0f0"],[136,69,4,"#f3f3f3"],[144,69,3,"#f1f1f1"],[151,69,1,"#f1f1f1"],[152,69,6,"#efefef"],[158,69,1,"#ffffff"],[94,70,1,"#ffffff"],[95,70,1,"#f0efed"],[96,70,2,"#f1f0ee"],[109,70,1,"#8b8b8b"],[110,70,2,"#eeeeec"],[112,70,4,"#f2f2f2"],[121,70,1,"#919191"],[122,70,6,"#f0f0f0"],[132,70,3,"#f0f0f0"],[144,70,3,"#f2f2f2"],[151,70,1,"#f1f1f1"],[152,70,7,"#f1f1f1"],[132,71,3,"#efefed"],[132,72,3,"#efefed"],[132,73,3,"#f0f0ee"],[132,74,3,"#eeeeee"],[85,88,3,"#121116"],[88,88,8,"#121214"],[96,88,8,"#121214"],[104,88,8,"#121214"],[112,88,8,"#111113"],[120,88,8,"#131315"],[128,88,8,"#131315"],[136,88,8,"#131315"],[144,88,8,"#131315"],[152,88,8,"#131315"],[160,88,8,"#121214"],[85,89,3,"#121015"],[88,89,8,"#131315"],[96,89,8,"#111113"],[104,89,8,"#121214"],[112,89,8,"#111214"],[120,89,8,"#121214"],[128,89,8,"#121214"],[136,89,8,"#131315"],[144,89,8,"#121214"],[152,89,8,"#121315"],[160,89,8,"#131315"],[85,90,3,"#151112"],[88,90,8,"#131112"],[96,90,8,"#161213"],[104,90,8,"#131112"],[112,90,8,"#141213"],[120,90,8,"#131112"],[128,90,8,"#131112"],[136,90,8,"#131112"],[144,90,8,"#161213"],[152,90,8,"#161213"],[160,90,8,"#141213"],[72,120,2,"#f0b01a"],[77,120,1,"#f3b21a"],[79,120,1,"#edb11f"],[72,128,8,"#7c4912"],[48,152,8,"#1b0a00"],[56,152,8,"#1e0a01"],[64,152,3,"#1c0902"],[70,152,1,"#1b0a03"],[32,160,8,"#53372b"],[40,160,4,"#2e1d16"],[45,160,3,"#2d1f16"],[64,160,8,"#503929"],[48,168,8,"#563a2c"],[56,168,8,"#52382b"],[152,168,8,"#473124"],[48,176,8,"#6d5344"],[64,176,8,"#623a20"],[80,176,8,"#492914"],[88,176,8,"#4a2713"],[96,176,8,"#4c2915"],[136,176,8,"#4d2a14"],[144,176,8,"#4c2915"],[160,176,8,"#0f0100"],[24,184,8,"#000000"],[32,184,8,"#000000"],[40,184,8,"#000000"],[48,184,8,"#000000"],[56,184,1,"#865535"],[72,184,8,"#653b22"],[80,184,8,"#673d24"],[88,184,8,"#663a21"],[96,184,3,"#683c21"],[101,184,3,"#6a3e21"],[104,184,8,"#462512"],[112,184,8,"#472710"],[120,184,8,"#452612"],[128,184,8,"#492912"],[137,184,7,"#673d24"],[144,184,8,"#694024"],[152,184,8,"#663c23"],[160,184,8,"#663d21"],[24,192,8,"#876450"],[32,192,8,"#694c3c"],[40,192,8,"#683c1f"],[48,192,8,"#683f23"],[56,192,2,"#6a3e25"],[59,192,5,"#693d24"],[64,192,8,"#8a593b"],[72,192,5,"#87583a"],[78,192,2,"#87583a"],[80,192,5,"#865739"],[153,192,1,"#85563a"],[156,192,2,"#855338"],[159,192,1,"#865537"],[160,192,3,"#875638"],[168,192,8,"#0a0000"],[32,200,8,"#000000"],[40,200,8,"#7f5032"],[64,200,7,"#663e25"],[72,200,3,"#6a4125"],[76,200,4,"#6a4125"],[80,200,8,"#693f26"],[88,200,1,"#865535"],[90,200,1,"#85563a"],[104,200,2,"#855638"],[112,200,8,"#855736"],[121,200,1,"#855638"],[123,200,1,"#855736"],[136,200,4,"#855638"],[141,200,1,"#855638"],[144,200,1,"#865537"],[191,201,1,"#71716f"],[190,203,1,"#383637"],[190,205,1,"#535353"]]},"witness":{"n":26,"rows":["..........................","..........................","..........................","..........................","..........................","..........................",".....bh..bbgeeeeeee.......",".......bdddeeeaaaaei......","...bh.bbbddeeaaaaaaa......",".....bdddgeeaaaaaaaai.....","........bbeeaaaaaaaai.....","...b.bddddeeaaaaaaaaa.....","......bdddfffccccccccc....","........bbfffclmnopqrc....","....h..bbdeffcstuvwxyc....",".....bddddeefccccccccc....","..bh....bbeeaaaaaaaaa.....",".........beeeaaaaaaai.....","......bbdzzeeaaaaaaa......",".........bABeeeaaaii......","....bh..bAACDEeeeii.......","......bbdzCCDFGHIJKj......",".......ggzBkkaaaaccjj.....","...bddddggLLMMiiNNNOO.....",".....bggdkkeeeiiiiicjj....","....bhggggLBPPkkQQRjjj...."],"pal":{"a":"#0a0711","b":"#a5a2c1","c":"#141414","d":"#ccaed3","e":"#1d1921","f":"#070707","g":"#dbccd5","h":"#ab70cc","i":"#19181c","j":"#9b95bc","k":"#16131a","l":"#181f96","m":"#005bbe","n":"#00948b","o":"#10ae46","p":"#c29108","q":"#c51523","r":"#b80f65","s":"#2d1eff","t":"#00b9ff","u":"#00ef53","v":"#ffef20","w":"#ff6312","x":"#ff1435","y":"#ff0684","z":"#c7abd0","A":"#a370d9","B":"#bfa8cd","C":"#9a6cd5","D":"#9267d1","E":"#c9bcdf","F":"#8963cd","G":"#7e5dc8","H":"#7759c4","I":"#7056c1","J":"#6a53be","K":"#5f4db9","L":"#d6c9d2","M":"#d1c7d0","N":"#c9c3cd","O":"#c3c0ca","P":"#b8a4c9","Q":"#a89cc2","R":"#a199bf"}},"proof":{"n":26,"rows":["..........................","..........................","..........................","..........................","..........................","..........................",".....ci..ccebbbbbbb.......",".......cdddbbbaaaabb......","...ci.cccddbbaaaaaaa......",".....cdddebbaaaaaaaab.....","........ccbbaaaaaaaab.....","...c.cddddbbaaaaaaaaa.....","......cdddbgbhbhbjhbhh....","........ccbaghkmahkmab....","....i..ccdbagbnlahnlag....",".....cddddbagbbhhbhjbb....","..ci....ccbbaaaaaaaaa.....",".........cbbbaaaaaaab.....","......ccdddbbaaaaaaa......",".........cfdbbbaaabb......","....ci..cffffobbbbb.......","......ccddfffffffffd......",".......eeddggaaaaggdd.....","...cddddeeeeeebbeeeee.....",".....ceedggbbbbbbbbgdd....","....cieeeeedddggdddddd...."],"pal":{"a":"#141414","b":"#212121","c":"#3bbbc1","d":"#2e9ed3","e":"#4dc9d5","f":"#267ecd","g":"#1b1b1b","h":"#282828","i":"#2060b5","j":"#313131","k":"#6438ae","l":"#f3cf85","m":"#1b6fe3","n":"#16bcae","o":"#3bbbe0"}},"oracle":{"n":26,"rows":["..........................","..........................","..........................","..........................","..........................","..........................",".....ch..ccdbbbbbbb.......",".......cdddbbbaaaabb......","...ch.cccddbbaaaaaaa......",".....cddddbbaaaaaaaab.....","........ccbbaaaaaaaab.....","...c.cddddbbaaaaaaaaa.....","......cdddgggeeeeeeeee....","........ccgggejklmnope....","....h..ccdbggeqrstuvwe....",".....cddddbbgeeeeeeeee....","..ch....ccbbaaaaaaaaa.....",".........cbbbaaaaaaab.....","......ccdddbbaaaaaaa......",".........cfdbbbaaabb......","....ch..cffffxbbbbb.......","......ccddfffffffffd......",".......ddddiiaaaaiidd.....","...cddddddddddbbddddd.....",".....cdddiibbbbbbbbidd....","....chddddddddiidddddd...."],"pal":{"a":"#ebebeb","b":"#dedede","c":"#394747","d":"#1b1b05","e":"#141414","f":"#0e1402","g":"#070707","h":"#21220c","i":"#e4e4e4","j":"#181f96","k":"#005bbe","l":"#00948b","m":"#10ae46","n":"#c29108","o":"#c51523","p":"#b80f65","q":"#2d1eff","r":"#00b9ff","s":"#00ef53","t":"#ffef20","u":"#ff6312","v":"#ff1435","w":"#ff0684","x":"#070e00"}},"grail":{"n":26,"rows":["...V..................V...","...y...........yy.....y...","..yyyy...yy....yy....yyy..",".....VyyyyVyyyyVVyyyV.....","....yyyyyyyyyyyyyyyyyy....","...yYnnnnhhhhhhhhhnnnYy...","...yYnnnyhhHHHHHhhhnnYy...","...yYnnhhhHkkkkkHhVVnYy...","...yYnhVVHkkkkkkkHhVhYy...","...yYnhVHKkkkkkkkkHhhYy...","...yYhhhHKkkkkkkkkHhhYy...","...yYhhHKKkkkkkkkkkHhYy...","...yYhhHKKVVVVVEkkkyhYy...","...yYhhHKKkEEEEkkkkHhYy...","...yYhhHKKkkkkkkkkkHhYy...","...yYhhEEKkkkkkkkkkHhYy...","...yYhhEHKkkkkkkkyyhhYy...","...yYnhhHKkkYyYkkkyhhYy...","...yYnhhhHkkkkkkkHhhhYy...","...yYnnyhhkkkkkkkhhhnYy...","...yYnnnKKKKKKKKKKKnnYy...","...yYnnkkkkkkkkkkkkknYy...","...yYnkkyyyyyyyyyyykkYy...","...yYkkkkkkkkykkkkkkkky...","...yYkkkkkkkyyykkkkkkky...","...yYkkkkkkkkkkkkkkkkky..."],"pal":{".":null,"n":"#1d1038","h":"#35216a","H":"#4b2f94","y":"#ffc94a","Y":"#b8801c","k":"#0a0a10","K":"#1e1b2a","V":"#8f4dff","E":"#c9a4ff"},"bg":"#0f0a22"}};
// ======================= layout =======================
const LW=5700,HW=30,PH=112,SPD=320,JMP=840,GRAV=2500;
const XS={pip:560,f:[1000,1280,1560,1840,2120],table:2440,sable:2740,lost:2960,ph:3180,board:3420,hall:[3700,3960,4220,4480],coll:4800,bell:5340};
const CRATE=[[2900,150,120],[2400,0,0]].filter(c=>c[1]);
const C={pc:'#ffe9f6',ac:'#ff6ad5',se:'#4ee3f0',gd:'#ffd35a',gr:'#5dd68a',dk:'#12082a',mid:'#221140',lit:'#3a1f63',glow:'#ff4ad0',mu:'#b49ad8',bad:'#ff8a7a',ok:'#7cf0b6',ink:'#08031a'};
const FEE=.0001;
// ======================= the market's data (FICTIONAL game data, except RECS) =======================
const ITEMS=[
 {id:'witness',spr:'witness',cap:'Skeles to the Moon',n:'THE HIDDEN WITNESS',p:6,seller:'Marlow',rar:'Common',x:0,fr:0,
  tr:['Shell: dark hood, lilac trail','Face: a rainbow visor bar','Trail: scattered marks, drifting left'],pv:'Painted once, listed once.',st:'It looks like it is keeping something to itself.'},
 {id:'proof',spr:'proof',cap:'Skeles to the Moon',n:'THE PROOFSMITH',p:11,seller:'Orrin',rar:'Uncommon',x:1,fr:1,
  tr:['Shell: dark hood, blue trail','Eyes: two pairs, violet, blue, teal and cream','Trail: drifting left'],pv:'Two owners before this listing.',st:'Precise to the pixel. People who like things to add up like this one.'},
 {id:'oracle',spr:'oracle',cap:'Skeles to the Moon',n:'THE ORCHARD ORACLE',p:7.5,seller:'Fennel',rar:'Common',x:2,fr:2,
  tr:['Shell: white skull-like helm','Face: a rainbow visor bar','Trail: dark, drifting left'],pv:'Listed by the artist\u2019s friend.',st:'Something grew out of it and it did not mind.'},
 {id:'visor',spr:'visor',n:'VERDANT VISOR',p:14,seller:'Marlow',rar:'Rare',x:3,fr:3,
  tr:['Face: one green visor bar','Shell: dark helmet','Trail: pastel, drifting left'],pv:'Listed once. Price has not changed since.',st:'The visor is the whole personality.'},
 {id:'d3',spr:'d3',n:'DEPTH PERCEPTION',p:9.5,seller:'quill_dot',rar:'Uncommon',x:4,fr:4,
  tr:['Face: red and blue lenses on a white bar','Shell: grey helm, dark face','Trail: pale, almost white'],pv:'Seller has listed three pieces here.',st:'Everything looks flatter when you stop wearing them.'}];
const PHANTOM={id:'phantom',spr:'glitch',n:'BLUE #9045 \u2014 FRESH, MUST SELL',p:.9,seller:'ghost.zec',rar:'\u201CRecord-class\u201D',
  tr:['CLAIMS: pale-blue shell, yellow eyes','CLAIMS: the same piece as the record sale','Trail: (not described)'],pv:'Seller created yesterday. Three listings, no sales.',st:'',fake:true};
const RARE={id:'grail',spr:'grail',n:'THE VEILED GRAIL',p:0,seller:'\u2014',rar:'Rare (not for sale)',
  tr:['Frame: ornate arch, gold','Creature: hooded, violet visor','Symbols: floating'],pv:'Given, never sold. Awarded to whoever catches the Phantom.',st:'A hidden result can still leave a trace.'};
const ALL=ITEMS.concat([PHANTOM,RARE]);
const byId=id=>ALL.find(i=>i.id===id);
// REAL records, as reported by the ZKSCAPE creator. They are not listed for sale.
const RECS=[{id:'r9045',spr:'r9045',n:'zkSNARK #9045',l:['Highest sale so far: 54 ZEC.','Sold 19.09.2026.','Pale-blue shell, two yellow eyes.']},
 {id:'r9284',spr:'r9284',n:'zkSNARK #9284',l:['Second highest sale: 20 ZEC.','Sold 19.09.2026.','Purple hat, gold goggles, a ragged dark body.']},
 {id:'r5235',spr:'r5235',n:'zkSNARK #5235',l:['Third highest sale: 16.9 ZEC.','Sold 19.09.2026.','Pale blue, dark eyes with a white glint.']},
 {id:'poopie',spr:'poopie',n:'THE POOPIE',l:['Not a sale. The ZKSCAPE creator\u2019s own.']}];
const POOP=['The Poopie. This one is not here for its price. It is the lore thats behind it',
         'People listed poopies and called them ugly, and the floor fell from 0.7 to 0.3 with about 30 listed.',
         'When someone said the project would die because of poopies, NFTPurp made one his PFP and kept winding them up.']

let V=null,U=1,W_=0,H_=0,GY=0;
const K={l:0,r:0,j:0,jp:0,e:0};
const coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const X=x=>(x-V.cx)*U,Y=y=>GY-y*U,isZ=()=>run&&cur&&cur.id==='zilkroad'&&V&&V.on;
const L=(x,f)=>(x-V.cx*f)*U;
const MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace';
const SERIF=n=>'400 '+Math.round(Math.max(14,n*U))+"px 'Abril Fatface',Georgia,serif";
const P=(x,y,w,h,c,a)=>{if(a!=null)g2.globalAlpha=a;g2.fillStyle=c;g2.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));if(a!=null)g2.globalAlpha=1};
const rr=(x,y,w,h,c,a)=>P(X(x),Y(y+h),w*U,h*U,c,a);       // y is the BOTTOM edge, in world height
const mxc=(a,b,t)=>{t=clamp(t,0,1);const q=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A_=q(a),B_=q(b);return '#'+A_.map((v,i)=>Math.round(v+(B_[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const TS=(s,x,y,c,n,al)=>{g2.save();g2.textAlign=al||'center';g2.font=MONO(n);g2.lineWidth=4;g2.strokeStyle='#08031acc';g2.lineJoin='round';g2.strokeText(s,x,y);g2.fillStyle=c;g2.fillText(s,x,y);g2.restore()};
const rgba=(h,a)=>{const q=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));return 'rgba('+q+','+a+')'};
const fmt=n=>(Math.round(n*10000)/10000).toFixed(n%1?4:1).replace(/(\.\d*?)0+$/,'$1').replace(/\.$/,'.0');

// ======================= artwork: prerendered once at 8px per cell, so detail is exact =======================
const ZS={},ZT={};   // ZS = artwork on its backdrop (frames, table); ZT = the same cells with NO backdrop (worn portrait)
(function(){for(const k in ZSD){const d=ZSD[k],mk=bg_=>{const cv=document.createElement('canvas');cv.width=cv.height=208;const q=cv.getContext('2d'),c8=208/d.n;
 if(bg_){q.fillStyle=d.bg||'#000';q.fillRect(0,0,208,208)}
 d.rows.forEach((r,y)=>{for(let x=0;x<d.n;x++){const ch=r[x];if(ch==='.')continue;q.fillStyle=d.pal[ch];q.fillRect(x*c8,y*c8,c8,c8)}});
 if(d.runs)d.runs.forEach(a=>{q.fillStyle=a[3];q.fillRect(a[0],a[1],a[2],1)});
 return cv};ZS[k]=mk(1);ZT[k]=mk(0)}})();
function art(id,x,y,s){g2.imageSmoothingEnabled=false;g2.drawImage(ZS[id],Math.round(x),Math.round(y),Math.round(s),Math.round(s))}

// ======================= persistence (S.zk through the engine's save()) =======================
const SVz=()=>{S.zk=S.zk||{v:1};const z=S.zk;if(z.bal==null)z.bal=30;z.own=z.own||[];z.seen=z.seen||{};z.cmp=z.cmp||[];z.f=z.f||{};z.n=z.n||{};if(z.eq===undefined)z.eq=null;return z};
const F=()=>SVz().f;
const keep=()=>{try{save()}catch(e){}};
const owns=id=>SVz().own.includes(id);

// ======================= input and panels =======================
if(!window.__zkZR){window.__zkZR=1;
 const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'u',KeyW:'u',ArrowDown:'d',KeyS:'d',KeyE:'e',Enter:'e',KeyF:'e',Escape:'esc',KeyQ:'esc',KeyC:'coll'})[c];
 addEventListener('keydown',e=>{const k=km(e.code);if(!k||!isZ())return;
  if(V.ui){e.preventDefault();const u=V.ui;if(u.lock)return;
   if(k==='u'||k==='l'){u.sel=(u.sel+u.o.length-1)%u.o.length;AM.sfx('click')}
   else if(k==='d'||k==='r'){u.sel=(u.sel+1)%u.o.length;AM.sfx('click')}
   else if(k==='e'||k==='j'){if(!e.repeat)choose(u.sel)}
   else if(k==='esc'&&u.cancel!==false){V.ui=null;AM.sfx('click')}
   return}
  e.preventDefault();
  if(k==='e'){if(!e.repeat)K.e=1;return}
  if(k==='coll'){if(!e.repeat)collection();return}
  if(k==='esc')return;
  if(k==='j'||k==='u'){if(!K.j)K.jp=1;K.j=1;return}
  if(k==='d')return;
  K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(k==='j'||k==='u')K.j=0;else if(k==='l'||k==='r')K[k]=0});   // K.e is a one-shot the frame consumes
 addEventListener('blur',()=>{K.l=K.r=K.j=0});}
addEventListener('pointerdown',e=>{if(!isZ()||!V.ui||V.ui.lock||e.target!==g2.canvas)return;
 const r=g2.canvas.getBoundingClientRect(),px=(e.clientX-r.left)*g2.canvas.width/r.width,py=(e.clientY-r.top)*g2.canvas.height/r.height;
 for(const q of(V.uiR||[]))if(px>=q.x&&px<=q.x+q.w&&py>=q.y&&py<=q.y+q.h){V.ui.sel=q.i;choose(q.i);return}});
function ctl(on){let c=$z('zkctl');if(c&&c.dataset.own!=='zilkroad'){c.remove();c=null}if(!c){c=document.createElement('div');c.id='zkctl';c.dataset.own='zilkroad';
 c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);
  b.style.cssText='pointer-events:auto;touch-action:none;width:60px;height:60px;border-radius:50%;margin:0 4px;font:600 22px sans-serif;color:#fff;background:#12082acc;border:2px solid #ff6ad5';
  const set=v=>e=>{e.preventDefault();if(!V)return;
   if(V.ui){if(v&&!V.ui.lock){const u=V.ui;if(k==='u'||k==='l')u.sel=(u.sel+u.o.length-1)%u.o.length;else if(k==='d'||k==='r')u.sel=(u.sel+1)%u.o.length;else if(k==='e')choose(u.sel);else if(k==='c'&&u.cancel!==false)V.ui=null}return}
   if(k==='j'&&v&&!K.j)K.jp=1;if(k==='e'){if(v)K.e=1;return}if(k==='c'){if(v)collection();return}K[k]=v};
  b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const A1=document.createElement('div'),B1=document.createElement('div');
 A1.append(mb('\u25C0','l','left'),mb('\u25B6','r','right'));
 B1.append(mb('\uD83C\uDFA8','c','your collection'),mb('\u270B','e','use'),mb('\u2934','j','jump'));
 c.append(A1,B1);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}
// ui({t,b,o:[{l,f}],art:id|[ids],lock}). Choosing closes the panel first so f can open the next one.
function ui(o){V.ui=o;if(o){o.sel=o.sel||0;AM.sfx('click')}}
function choose(i){const u=V.ui;if(!u||u.lock)return;const op=u.o[i];if(!op)return;V.ui=null;AM.sfx('interaction');if(op.f)op.f()}
const OK=(f,l)=>[{l:l||'OK',f}];
function talk(who,col,lines,after,art_){let i=0;const step=()=>{ui({t:who,c:col,b:lines[i],art:art_,cancel:false,
 o:[{l:i<lines.length-1?'\u2026':'[ close ]',f:()=>{if(i<lines.length-1){i++;step()}else if(after)after()}}]})};step()}
const note=s=>{V.msg=s;V.mt=Math.max(5,s.length/15)};
const say=(x,s,y)=>V.ft.push({x,y:y||250,s,l:2.4});
const spark=(x,y,c,n=10)=>{for(let i=0;i<n&&V.vp.length<220;i++){const a=Math.random()*6.28,s=60+Math.random()*180;
 V.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.9,c:Array.isArray(c)?c[i%c.length]:c,s:5,g:170})}};
const avail=()=>SVz().bal;

// ======================= listings: inspect, pin, compare =======================
const rarCol=r=>/Rare/.test(r)?C.gd:/Uncommon/.test(r)?C.se:C.mu;
function listingText(it){const z=SVz(),own=owns(it.id),pinned=z.cmp.includes(it.id);
 return [(it.fake?'GAME DATA \u00B7 FICTIONAL LISTING':'GAME DATA \u00B7 FICTIONAL PRICE AND SELLER'),
  'PRICE   '+(it.p?fmt(it.p)+' ZEC (SIM)':'not for sale'),'SELLER  '+it.seller,'RARITY  '+it.rar,'',...it.tr,'','PROVENANCE: '+it.pv,
  'OWNER   '+(own?'YOU (simulated). It is in your collection.':it.id==='grail'?'nobody yet':'listed by '+it.seller+', unsold'),
  pinned?'\u25CF pinned for comparison':''].filter((s,i,a)=>s!==''||a[i-1]!=='').join('\n')}
function inspect(it){const z=SVz();z.seen[it.id]=1;if(it.id==='phantom')F().insPh=1;keep();
 const own=owns(it.id),pinned=z.cmp.includes(it.id),o=[];
 if(!own&&it.p)o.push({l:'BUY THIS  ('+fmt(it.p)+' ZEC SIM)',f:()=>review(it)});
 if(it.p&&!own)o.push({l:pinned?'UNPIN FROM THE TABLE':'PIN FOR COMPARISON  ('+z.cmp.length+'/2)',f:()=>{pin(it)}});
 if(own&&it.id!=='phantom')o.push({l:z.eq===it.id?'TAKE IT OFF':'WEAR IT AS YOUR PORTRAIT (this world only)',f:()=>{z.eq=z.eq===it.id?null:it.id;keep();AM.sfx('core-activate');note(z.eq?'You wear '+it.n+'. It is cosmetic and only applies inside Zilkroad. Your real PFP is untouched.':'Back to your own face.')}});
 o.push({l:'WALK AWAY',f:null});
 ui({t:it.n,c:rarCol(it.rar),b:listingText(it),art:it.spr,o});
 if(it.id==='phantom')note('That price is wrong by a lot. Not a typo you can ignore. Compare it with what it claims to be.')}
function pin(it){const z=SVz(),i=z.cmp.indexOf(it.id);
 if(i>=0){z.cmp.splice(i,1);note('Unpinned. The table has '+z.cmp.length+' of 2.')}
 else{if(z.cmp.length>=2)z.cmp.shift();z.cmp.push(it.id);note(z.cmp.length<2?'Pinned. Pin one more, then go to the Inspection Table.':'Two pinned. The Inspection Table can show them side by side.')}
 AM.sfx('collectible');keep()}
function tableAct(){const z=SVz();
 if(z.cmp.length<2){AM.sfx('interaction');note('The table is empty. Pin two listings from the arcade (E at a portrait), then bring them here to compare ('+z.cmp.length+'/2).');return}
 const a=byId(z.cmp[0]),b=byId(z.cmp[1]);F().cmp=1;keep();
 const pad=(s,n)=>(s+' '.repeat(n)).slice(0,n),W=34,rows=(it)=>[it.n.slice(0,W-1),fmt(it.p)+' ZEC (SIM)','by '+it.seller,it.rar,...it.tr.map(t=>t.slice(0,W-1)),it.pv.slice(0,W-1)];
 const ra=rows(a),rb=rows(b),n=Math.max(ra.length,rb.length),body=Array.from({length:n},(_,i)=>pad(ra[i]||'',W)+'| '+(rb[i]||'')).join('\n');
 ui({t:'THE INSPECTION TABLE \u00B7 SIDE BY SIDE',c:C.se,b:body+'\n\nSame fictional market, two ways to spend the same purse. Nothing says which one is better.',art:[a.spr,b.spr],
  o:[{l:'BUY THE LEFT ONE  '+a.n,f:()=>review(a)},{l:'BUY THE RIGHT ONE  '+b.n,f:()=>review(b)},{l:'CLEAR THE TABLE',f:()=>{z.cmp=[];keep();note('The table is clear.')}},{l:'BACK',f:null}]})}

// ======================= the purchase: review -> confirm/cancel -> pending -> resolve -> ownership =======================
function review(it){const z=SVz();
 if(owns(it.id)){note('You already own that one.');return}
 if(it.p+FEE>avail()+1e-9){AM.sfx('incorrect');V.bad=.4;
  ui({t:'INSUFFICIENT SIMULATED FUNDS',c:C.bad,b:'It costs '+fmt(it.p)+' plus a '+FEE+' fee. Your purse holds '+fmt(avail())+' (SIM). Nothing was charged and nothing changed.',art:it.spr,o:OK(()=>inspect(it),'BACK TO THE LISTING')});return}
 ui({t:'REVIEW YOUR PURCHASE \u00B7 SIMULATED',c:C.gd,b:'ITEM    '+it.n+'\nSELLER  '+it.seller+'\nPRICE   '+fmt(it.p)+' ZEC (SIM)\nFEE     '+FEE+'\nTOTAL   '+fmt(it.p+FEE)+'\nPURSE   '+fmt(avail())+'  \u2192  '+fmt(avail()-it.p-FEE)+'\n\nThis is a game. No real wallet, funds or blockchain is involved. Confirm to place the order, or cancel and nothing happens.',art:it.spr,
  o:[{l:'CONFIRM  \u00B7  PLACE THE ORDER',f:()=>place(it)},{l:'CANCEL',f:()=>{AM.sfx('click');note('Cancelled. Your purse is untouched ('+fmt(avail())+' SIM). Looking costs nothing.')}}]})}
function place(it){V.pend={it,t:0};AM.sfx('rise');
 ui({t:'TRANSACTION PENDING \u00B7 SIMULATED',c:C.se,art:it.spr,lock:true,b:()=>{const t=V.pend?V.pend.t:0,st=t<1?'1. Signing the order\u2026':t<2.2?'2. Broadcast. Waiting to be included in a block\u2026':t<3.6?'3. Included. Waiting for confirmations (1 of 2)\u2026':'3. Confirmations (2 of 2)\u2026';
  return 'Ordering '+it.n+'.\n\n'+st+'\n\n'+'\u2588'.repeat(Math.min(24,Math.floor(t/4.4*24)))+'\u2591'.repeat(24-Math.min(24,Math.floor(t/4.4*24)))+'\n\nA pending order is not yours yet. Until it resolves, it can still fail.\n\nIN ZCASH: a payment is not final the moment it is broadcast. Each block mined on top adds a confirmation, and more confirmations make it harder to reverse.'},o:[{l:'\u2026'}]})}
function pendStep(dt){const p=V.pend;if(!p)return;p.t+=dt;if(p.t<4.4)return;V.pend=null;V.ui=null;resolve(p.it)}
function resolve(it){const z=SVz();
 if(it.fake){AM.sfx('incorrect');V.bad=.5;F().burned=1;keep();V.shake=.6;
  ui({t:'TRANSACTION FAILED \u00B7 SIMULATED',c:C.bad,b:'The seller withdrew the listing before it settled. The order did not complete. Your '+fmt(it.p)+' was returned in full ('+fmt(avail())+' SIM).\n\nA price that far below every comparable piece, from a seller created yesterday, for a portrait that does not match its own description. Worth remembering.',art:it.spr,o:OK(()=>pipRub(),'OK')});return}
 z.bal=Math.round((z.bal-it.p-FEE)*10000)/10000;z.own.push(it.id);z.n.spent=(z.n.spent||0)+it.p;z.cmp=z.cmp.filter(x=>x!==it.id);keep();
 AM.sfx('world-complete');V.flash=1;spark(it.x!=null?XS.f[it.x]:V.px,170,[C.gd,C.ac,C.se,'#fff'],40);
 ui({t:'PURCHASE COMPLETE \u00B7 SIMULATED',c:C.ok,b:it.n+' is yours in this game.\n\nPURSE   '+fmt(avail())+' ZEC (SIM)\nOWNER   YOU (simulated)\n\nA listing is something you can look at. Ownership is something that changes who the market says it belongs to. It is now in your collection (press C anywhere, or visit the gallery), and you can wear it as your portrait in this world.',art:it.spr,
  o:[{l:'WEAR IT NOW',f:()=>{z.eq=it.id;keep();AM.sfx('core-activate');note('You wear '+it.n+'. Cosmetic, this world only.')}},{l:'JUST KEEP IT',f:null}]});
 setTimeout(()=>{if(V&&V.on&&!V.ui)reactBuy(it)},9000)}
function reactBuy(it){note(owns('proof')&&it.id==='proof'?'Sable nods from across the market. She noticed.':'Pip saw that from his stall. He is already telling someone.')}
function pipRub(){note('Pip, from his stall: \u201CEverybody buys that one once. It\u2019s a rite of passage.\u201D')}

// ======================= your collection =======================
function collection(){if(V.ui)return;const z=SVz();
 if(!z.own.length){note('Your collection is empty. A portrait only joins it when a purchase completes.');AM.sfx('click');return}
 ui({t:'YOUR COLLECTION \u00B7 SIMULATED OWNERSHIP',c:C.ac,b:'Purse '+fmt(avail())+' ZEC (SIM). Owned: '+z.own.length+'.'+(z.eq?'  Wearing: '+byId(z.eq).n+'.':''),
  o:z.own.map(id=>({l:byId(id).n+(z.eq===id?'   (worn)':''),f:()=>inspect(byId(id))})).concat([{l:'CLOSE',f:null}])})}

// ======================= merchants =======================
function sableAct(){const z=SVz(),f=F(),seen=ITEMS.filter(i=>z.seen[i.id]).length,bought=z.own.filter(i=>i!=='grail'),own=bought.length;
 const open=(seen===0&&!z.own.length)?'Browsing? Good. Look at everything before you touch the purse.'
  :own===0?'You have looked at '+seen+' of my neighbours\u2019 pieces and bought none. That is how provenance people buy. Slowly.'
  :'So you bought '+byId(bought[bought.length-1]).n+'. Fine taste or fine luck. I will check the paper trail either way.';
 ui({t:'SABLE \u00B7 PROVENANCE',c:C.se,b:'\u201C'+open+'\u201D',cancel:true,o:[
  {l:'WHAT MAKES ONE WORTH MORE?',f:()=>talk('SABLE',C.se,['Where it came from, who held it, how many exist, and whether the paper trail has holes.','A rare piece with a hole in its history is worth less than a common one with none. Value is a story you can check.'],()=>sableAct())},
  {l:'THAT ALLEY LISTING',f:()=>{talk('SABLE',C.se,f.insPh?['You looked at it. Good. Then you saw the price.','It claims to be the record piece. Go to the Hall of Records and look at the real one. Then look at that listing again, slowly.']
   :['Something is on sale in the back alley for nearly nothing. I do not look at it and I do not recommend that you do.','If you do, bring the real thing to compare it to.'],()=>{f.sable=1;keep();sableAct()})}},
  {l:'WHAT SHOULD I BUY?',f:()=>talk('SABLE',C.se,[z.cmp.length===2?'You have two pinned. The table will show you the rest. Choose the one whose paper trail you could defend to a stranger.':'I will not tell you. Pin two, set them side by side, and defend your choice to yourself.'],()=>sableAct())},
  {l:'LEAVE',f:null}]})}
function pipAct(){const z=SVz(),f=F();
 if(!f.met){talk('PIP',C.ac,['Welcome to Zilkroad. Nothing here is real money, nothing here touches a wallet, and everything here has a face.','The portraits are zkSNARKs, a collection made for the Zcash community. The name winks at zk-SNARKs, the proofs behind shielded Zcash.','Nobody owns Zcash. Independent organizations build its software, its wallets and marketplaces like this one.','Here: 30 ZEC, simulated. Spend it, hoard it, or keep it all the way out the other side. The bell at the end rings either way.','The arcade is ahead. Pin two portraits, set them on the table, make up your mind. Mind the alley.'],()=>{f.met=1;keep();AM.sfx('collectible');note('You were given a purse: 30.0 ZEC (SIM). Press C any time to open your collection.')});return}
 const own=z.own.length,wear=z.eq?byId(z.eq).n:null;      // Pip counts gifts too: a face is a face
 const open=wear?'Ha! Look at you in '+wear+'. It suits you. Does it have a story yet?':own?'You are carrying '+own+(own>1?' faces':' face')+' now. Tell me they have names.':f.poop?'You were at the Hall of Records, weren\u2019t you. You went quiet.':'Looking around? Good. A market is mostly faces.';
 ui({t:'PIP \u00B7 THE STORYTELLER',c:C.ac,b:'\u201C'+open+'\u201D',o:[
  {l:'WHAT MAKES ONE WORTH MORE?',f:()=>talk('PIP',C.ac,['Whether you still like it at three in the morning.','A rare one nobody loves is a number. A common one that is yours is a face. Both are real; they are just different kinds of real.'],()=>pipAct())},
  {l:'ABOUT THAT ONE THEY CALL THE POOPIE',f:()=>talk('PIP',C.ac,f.poop?['You read it, then. People laughed at that one and he wore it as his face anyway.','I think that is the most honest way to own anything.']:['Hall of Records, the last frame. It is the only one there that is not a sale. Go and read it.'],()=>pipAct())},
  {l:'THE ALLEY LISTING',f:()=>talk('PIP',C.ac,f.solved?['You caught it! The whole street heard. That listing is gone and nobody will admit they looked.']:f.burned?['Everybody buys it once. At least yours came back.']:['Do not tell Sable, but I have seen it. It never sells and it never leaves.','Whoever lists it is hoping you do not look at the face.'],()=>pipAct())},
  {l:'LEAVE',f:null}]})}
function lostAct(){const f=F();AM.sfx('interaction');
 if(!f.lost){f.lost=1;keep();AM.sfx('card-reveal');spark(XS.lost,170,C.gd,14)}
 ui({t:'THE LOST-AND-FOUND CRATE',c:C.gd,b:'Under a scarf, a folded slip someone dropped:\n\n\u201Cghost.zec. Account made yesterday. Three listings. Not one sale. Always the same line: MUST SELL.\u201D\n\nYou were the sort of person who climbed to look. It helps.',o:OK()})}

// ======================= the mystery: the Phantom listing =======================
function boardAct(){const f=F();
 if(f.solved){ui({t:'THE NOTICE BOARD',c:C.ok,b:'A fresh notice, in your handwriting: \u201CListing removed. The portrait did not match the piece it claimed to be.\u201D\n\nThe alley is quiet.',o:OK()});return}
 if(!f.insPh){ui({t:'THE NOTICE BOARD',c:C.gd,b:'Reports go here: anything in the market that does not add up.\n\nNothing has caught your eye yet. The alley listing is a short walk to the right.',o:OK()});return}
 ui({t:'REPORT A LISTING',c:C.gd,b:'The alley listing: \u201CBLUE #9045 \u2014 FRESH, MUST SELL\u201D, 0.9 ZEC (SIM). What is the strongest thing you can show?',
  o:[{l:'IT IS FAR TOO CHEAP',f:()=>report('price')},{l:'THE SELLER IS NEW AND HAS NEVER SOLD ANYTHING',f:()=>report('seller')},{l:'THE PORTRAIT DOES NOT MATCH THE PIECE IT CLAIMS TO BE',f:()=>report('art')},{l:'NOT YET',f:null}]})}
function report(k){const f=F();
 if(k==='art'){if(!f.hall9045){AM.sfx('incorrect');ui({t:'CAN YOU SHOW THAT?',c:C.bad,b:'That is a strong claim, but you have nothing to put next to it. The real record piece is in the Hall of Records. Go and look at it, then look at the listing again.',o:OK()});return}
  solve();return}
 ui({t:'NOT QUITE',c:C.gd,b:k==='price'?'Suspicious, yes. But cheap is not proof: plenty of honest things are underpriced. What does the listing itself say, and what does the frame show?'
  :'Also suspicious, and the lost-and-found slip says as much. But a new seller is not proof either. What does the portrait in the frame actually show, compared with what it claims?',o:OK()})}
function solve(){const f=F(),z=SVz();f.solved=1;if(!z.own.includes('grail'))z.own.push('grail');keep();
 AM.sfx('world-complete');V.flash=1;V.solveT=0;spark(XS.board,200,[C.gd,C.se,C.ac],40);
 talk('THE MARKET',C.gd,['The listing says: pale-blue shell, yellow eyes, the same piece as the record sale. The frame shows a black hood with white eyes.','You compared the claim with the real thing and the two did not match. That is the whole trick. Nobody had to be told.',
  'Sable steps out of her stall. \u201CWell. That is how it is done.\u201D Pip is already telling the street.','A piece nobody ever sold is waiting for you: THE VEILED GRAIL. It is now in your collection.'],()=>{note('THE VEILED GRAIL joined your collection. Press C to see it.')},'grail')}

// ======================= the Hall of Records: REAL sales and the Poopie =======================
function hallAct(i){const r=RECS[i],f=F();
 if(r.id==='poopie'){f.poop=1;SVz().seen.poopie=1;keep();let k=0;const step=()=>{ui({t:r.n+' \u00B7 '+(k+1)+'/'+POOP.length,c:C.ac,b:POOP[k],art:'poopie',cancel:true,o:[{l:k<POOP.length-1?'NEXT':'[ close ]',f:()=>{if(k<POOP.length-1){k++;step()}}}]})};step();return}
 if(r.id==='r9045'){f.hall9045=1;keep()}SVz().seen[r.id]=1;
 ui({t:r.n+' \u00B7 REAL RECORD',c:C.gd,b:r.l.join('\n')+'\n\nA record of a real sale, as reported by the ZKSCAPE creator. It is not listed in this market. The market\u2019s other prices and sellers are game data and are not real.',art:r.spr,o:OK()})}

// ======================= the finale: the closing bell =======================
function bellAct(){const z=SVz(),f=F();
 if(f.fin){note('The lanterns are up. The market is closing for the night. Walk it again if you like.');return}
 if(!(z.own.length||f.cmp)){AM.sfx('interaction');ui({t:'THE CLOSING BELL',c:C.gd,b:'The bell rings for anyone who has made up their mind. Walk the arcade, pin two portraits, set them side by side on the table. Then decide: buy one, or walk away. Both count.',o:OK()});return}
 ui({t:'THE CLOSING BELL',c:C.gd,b:'Ring it, and the market closes for the night.',o:[{l:'RING THE BELL',f:ring},{l:'NOT YET',f:null}]})}
function ring(){const f=F(),z=SVz();f.fin=1;keep();V.parade=0;AM.sfx('world-complete');V.flash=1;spark(XS.bell,250,[C.gd,C.ac,C.se,C.gr,'#fff'],60);
 const own=z.own.filter(i=>i!=='grail').length,solved=f.solved,spent=z.n.spent||0;
 const line=own?'You are walking out with '+own+(own>1?' portraits':' portrait')+(solved?' and a Veiled Grail':'')+', and '+fmt(avail())+' left in the purse.'
  :solved?'You bought nothing, caught a fake, and took home a Veiled Grail.':'You are walking out with nothing and all '+fmt(avail())+' of your purse. A lot of people do. The market was open for you either way.';
 setTimeout(()=>talk('PIP',C.ac,[line,own||solved?'A market is just a lot of people deciding what to keep.':'You looked, you compared, you decided. That is the whole market.',
  f.poop?'And you read the last frame in the Hall. Not everything here has a price.':'There is one frame in the Hall of Records that is not a sale. Come back and read it.'],()=>{
   talk('SABLE',C.se,[f.solved?'You checked before you trusted. I will say that to everyone.':'Whatever you carry out, check its paper trail first.','The bell is yours. Come back whenever.'],()=>{setTimeout(()=>{if(V&&V.on&&!S.done.zilkroad)finishWorld()},1600)})}),1800)}

// ======================= interactables =======================
function spots(){const a=[];
 a.push({x:XS.pip,l:'TALK TO PIP',f:pipAct});
 ITEMS.forEach((it,i)=>a.push({x:XS.f[i],l:(owns(it.id)?'YOURS: ':'INSPECT ')+it.n,f:()=>inspect(it),r:105}));
 a.push({x:XS.table,l:'INSPECTION TABLE  ('+SVz().cmp.length+'/2)',f:tableAct},{x:XS.sable,l:'TALK TO SABLE',f:sableAct},
  {x:XS.lost,l:'LOST-AND-FOUND',f:lostAct,y:120});
 if(!F().solved)a.push({x:XS.ph,l:'INSPECT THE ALLEY LISTING',f:()=>inspect(PHANTOM),r:105});
 a.push({x:XS.board,l:'NOTICE BOARD',f:boardAct});
 RECS.forEach((r,i)=>a.push({x:XS.hall[i],l:r.id==='poopie'?'THE POOPIE':'RECORD '+r.n.replace('zkSNARK ',''),f:()=>hallAct(i),r:105}));
 a.push({x:XS.coll,l:'YOUR COLLECTION',f:collection},{x:XS.bell,l:F().fin?'THE BELL':'THE CLOSING BELL',f:bellAct,r:120});
 return a}
const nearSpot=()=>{let b=null,bd=1e9;for(const s of spots()){if(Math.abs(V.py-(s.y||0))>34)continue;const d=Math.abs(V.px-s.x);if(d<(s.r||95)&&d<bd){bd=d;b=s}}return b};
const onCrate=x=>CRATE.find(k=>x>k[0]-8&&x<k[0]+k[1]+8);
function zInit(){const f=F();SVz();
 V={on:1,px:150,py:0,vx:0,vy:0,gr:1,face:1,cx:0,msg:'',mt:0,vp:[],ft:[],stt:'play',last:performance.now(),step:0,near:null,buf:0,coy:0,ui:null,
  t:0,bad:0,flash:0,shake:0,pend:null,parade:f.fin?9:-1,solveT:f.solved?9:-1,uiR:[],crowd:[]};
 K.l=K.r=K.j=K.jp=K.e=0;ctl(1);window.__zv=()=>V;
 note(f.met?'The market is open. C opens your collection.':'Lanterns, stalls, faces. Walk right. E to use things, C for your collection.')}

// ======================= frame =======================
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5));
 const now=performance.now(),dt=Math.min(.033,(now-V.last)/1000||.016);V.last=now;V.t+=dt;
 if(!fin)tx=ax;
 const live=V.stt==='play'&&!V.ui,dir=live?K.r-K.l:0,tv=dir*SPD;
 V.vx+=Math.sign(tv-V.vx)*Math.min(Math.abs(tv-V.vx),(V.gr?2800:1900)*dt);
 if(dir)V.face=dir;
 V.coy=V.gr?.1:(V.coy||0)-dt;V.buf=(V.buf||0)-dt;
 if(K.jp){V.buf=.12;K.jp=0}
 if(live&&V.buf>0&&V.coy>0){V.vy=JMP;V.gr=0;V.coy=0;V.buf=0;AM.sfx('interaction')}
 if(live&&!K.j&&V.vy>0)V.vy-=GRAV*1.2*dt;
 V.px+=V.vx*dt;const y0=V.py;V.vy-=GRAV*dt;V.py+=V.vy*dt;
 let top=0;if(V.vy<=0){const k=onCrate(V.px);if(k&&y0>=k[2]-2)top=k[2]}
 if(V.py<=top){V.py=top;V.vy=0;V.gr=1}else V.gr=0;
 V.px=clamp(V.px,HW,LW-HW);
 if(V.gr&&Math.abs(V.vx)>60&&(V.step-=dt)<=0){V.step=.3;AM.sfx('step')}
 const vw=w/U;V.cx+=((V.px-vw*.42+V.face*60)-V.cx)*(1-Math.exp(-5*dt));V.cx=clamp(V.cx,0,Math.max(0,LW-vw));
 pendStep(dt);
 V.near=null;if(live){const s=nearSpot();if(s)V.near=s}
 if(K.e){K.e=0;if(live){if(V.near)V.near.f();else AM.sfx('click')}}
 V.parade=V.parade>=0?Math.min(V.parade+dt,9):-1;V.solveT=V.solveT>=0?Math.min(V.solveT+dt,9):-1;
 V.flash=Math.max(0,V.flash-dt*1.4);V.shake=Math.max(0,V.shake-dt);V.bad=Math.max(0,V.bad-dt);
 V.vp.forEach(q=>{q.vy-=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt*1.2});V.vp=V.vp.filter(q=>q.l>0);
 V.ft.forEach(f=>f.l-=dt);V.ft=V.ft.filter(f=>f.l>0);V.mt-=dt}

// ======================= scene =======================
// Layers: sky + skyline (.08-.15) / passers-by (.5) / the market itself (1.0) / lantern strings (.6, drawn over).
const PS=()=>Math.max(4,Math.round(U*6.4));          // one pixel of portrait art, in screen px (integer, so it stays crisp)
function sky(t){const g=g2.createLinearGradient(0,0,0,H_);g.addColorStop(0,'#0a0420');g.addColorStop(.55,'#2a0c4a');g.addColorStop(1,'#14072e');g2.fillStyle=g;g2.fillRect(0,0,W_,H_);
 const mx=L(300,.05),my=H_*.2,pg=g2.createRadialGradient(mx,my,0,mx,my,120*U);pg.addColorStop(0,'rgba(255,106,213,.55)');pg.addColorStop(1,'rgba(255,106,213,0)');g2.fillStyle=pg;g2.fillRect(mx-120*U,my-120*U,240*U,240*U);
 g2.fillStyle='#ff9be6';g2.beginPath();g2.arc(mx,my,34*U,0,7);g2.fill();g2.fillStyle='#2a0c4a';g2.beginPath();g2.arc(mx+12*U,my-6*U,32*U,0,7);g2.fill();
 for(let k=Math.floor(V.cx*.12/160)-1;k<Math.floor((V.cx*.12+W_/U)/160)+2;k++){const h=90+(Math.sin(k*12.9)*.5+.5)*180,w=110,sx=L(k*160,.12);
  P(sx,Y(0)-h*U-60*U,w*U,(h+60)*U,'#1a0838');
  for(let j=0;j<h/30;j++)for(let q=0;q<3;q++){const on=Math.sin(k*7+j*3+q)>-.2;if(on)P(sx+(12+q*32)*U,Y(0)-(h-j*30+30)*U-60*U+50*U,14*U,10*U,[C.gd,C.ac,C.se][(k+j+q)%3],.35+.2*Math.sin(t*2+k+j))}}}
function crowd(t){for(let i=0;i<9;i++){const sp=14+i%4*6,x=((i*613+t*sp*(i%2?1:-1))%(LW+400)+LW+400)%(LW+400)-200,gx=L(x,.55),by=Y(0)+6*U,s=.85+(i%3)*.12;
  const col=['#2a1450','#3a1f63','#1d0f3d'][i%3];g2.fillStyle=col;g2.beginPath();g2.moveTo(gx-14*U*s,by);g2.lineTo(gx-9*U*s,by-72*U*s);g2.lineTo(gx+9*U*s,by-72*U*s);g2.lineTo(gx+14*U*s,by);g2.closePath();g2.fill();
  g2.beginPath();g2.arc(gx,by-82*U*s,9*U*s,0,7);g2.fill();P(gx-5*U*s,by-84*U*s,3*U,3*U,['#ffd35a','#ff6ad5','#4ee3f0'][i%3],.7)}}
function lanterns(t){const fin=F().fin?1:0;
 for(let k=Math.floor(V.cx*.6/460)-1;k<Math.floor((V.cx*.6+W_/U)/460)+2;k++){const x=k*460;
  g2.strokeStyle='#5a3a95';g2.lineWidth=1.5;g2.beginPath();g2.moveTo(L(x,.6),Y(470));g2.quadraticCurveTo(L(x+230,.6),Y(395),L(x+460,.6),Y(470));g2.stroke();
  for(let j=1;j<5;j++){const lx=x+j*92,ly=470-52*Math.sin(j/5*Math.PI),gx=L(lx,.6),gy=Y(ly),c=[C.gd,C.ac,C.se,C.gr][(k+j)%4],fl=.85+.15*Math.sin(t*3+k*3+j);
   const g=g2.createRadialGradient(gx,gy,0,gx,gy,(34+fin*28)*U);g.addColorStop(0,rgba(c,.5*fl+fin*.2));g.addColorStop(1,rgba(c,0));g2.fillStyle=g;g2.fillRect(gx-70*U,gy-70*U,140*U,140*U);
   P(gx-4*U,gy-5*U,8*U,10*U,c,.95)}}}
function floor(t){const y0=Y(0);P(0,y0,W_,H_-y0+2,'#1a0b36');
 let y=y0,hh=Math.max(7,15*U),i=0;while(y<H_){const k=clamp((y-y0)/Math.max(1,H_-y0),0,1);P(0,y,W_,hh,mxc('#26124a','#0c0522',k));P(0,y,W_,1,'#4a2a85',.5*(1-k));
  const wd=(110+i*18)*U,off=(V.cx*U*(1+i*.05)+i*37*U)%wd;for(let x=-off;x<W_;x+=wd)P(x,y,2,hh,'#0a0420',.8);y+=hh;hh*=1.17;i++}
 P(0,y0,W_,Math.max(4,4*U),C.ac);
 // wet shine under the lit stalls
 for(const x of[XS.pip,XS.sable,XS.table,XS.bell]){const gx=X(x),g=g2.createRadialGradient(gx,y0+18*U,0,gx,y0+18*U,150*U);g.addColorStop(0,'rgba(255,106,213,.18)');g.addColorStop(1,'rgba(255,106,213,0)');g2.fillStyle=g;g2.fillRect(gx-150*U,y0,300*U,60*U)}}
function canopy(x,w,h,c1,c2){const sx=X(x),sy=Y(0);for(let i=0;i<9;i++)P(sx-w*U/2+i*(w/9)*U,sy-h*U,(w/9)*U+1,44*U,i%2?c1:c2);
 for(let i=0;i<9;i++){g2.fillStyle=i%2?c1:c2;g2.beginPath();const x0=sx-w*U/2+i*(w/9)*U;g2.moveTo(x0,sy-h*U+44*U);g2.lineTo(x0+(w/9)*U,sy-h*U+44*U);g2.lineTo(x0+(w/18)*U,sy-h*U+58*U);g2.closePath();g2.fill()}}
function merchant(x,kind,t){const gx=X(x),gy=Y(0),b=Math.sin(t*2+x)*2*U;
 if(kind==='pip'){g2.fillStyle='#ff9be6';g2.beginPath();g2.arc(gx,gy-44*U+b,34*U,0,7);g2.fill();g2.fillStyle='#3a1f63';g2.fillRect(gx-30*U,gy-60*U+b,60*U,10*U);
  g2.fillStyle='#ffe9f6';g2.beginPath();g2.arc(gx,gy-92*U+b,15*U,0,7);g2.fill();P(gx-5*U,gy-95*U+b,3*U,4*U,'#12082a');P(gx+3*U,gy-95*U+b,3*U,4*U,'#12082a');
  g2.fillStyle='#4ee3f0';g2.fillRect(gx-17*U,gy-112*U+b,34*U,10*U);g2.fillRect(gx-11*U,gy-120*U+b,22*U,10*U)}
 else{g2.fillStyle='#16142e';g2.beginPath();g2.moveTo(gx-20*U,gy);g2.lineTo(gx-12*U,gy-96*U+b);g2.lineTo(gx+12*U,gy-96*U+b);g2.lineTo(gx+20*U,gy);g2.closePath();g2.fill();
  g2.fillStyle='#e8d8c0';g2.beginPath();g2.arc(gx,gy-108*U+b,12*U,0,7);g2.fill();g2.fillStyle='#4ee3f0';g2.fillRect(gx-13*U,gy-134*U+b,26*U,6*U);g2.fillRect(gx-7*U,gy-142*U+b,14*U,8*U);
  g2.strokeStyle='#ffd35a';g2.lineWidth=Math.max(2,2*U);g2.beginPath();g2.arc(gx+5*U,gy-110*U+b,7*U,0,7);g2.stroke()}
 TS(kind==='pip'?'PIP':'SABLE',gx,gy-(kind==='pip'?136:156)*U+b,kind==='pip'?C.ac:C.se,10)}
function stalls(t){
 // Pip: the storyteller, loud canopy, a sign about faces
 const px=XS.pip;rr(px-120,0,240,24,C.mid);rr(px-120,24,240,6,C.lit);rr(px-96,30,10,170,'#2a1450');rr(px+86,30,10,170,'#2a1450');canopy(px,250,215,C.ac,'#ffe9f6');
 rr(px-96,150,192,30,C.dk);TS('EVERY FACE HAS A STORY',X(px),Y(0)-160*U,C.gd,10);merchant(px,'pip',t);
 // Sable: the provenance desk, cool and tidy
 const sx=XS.sable;rr(sx-110,0,220,24,C.mid);rr(sx-110,24,220,6,C.se,.6);rr(sx-90,30,8,170,'#1a1438');rr(sx+82,30,8,170,'#1a1438');canopy(sx,230,215,'#1d3a5c','#4ee3f0');
 rr(sx-90,150,180,26,C.dk);TS('PROVENANCE \u00B7 PAPER TRAILS',X(sx),Y(0)-196*U,C.se,10);merchant(sx,'sable',t);
 rr(sx+36,30,34,22,'#e8d8c0');rr(sx+38,34,28,2,'#2a1a3a');rr(sx+38,40,22,2,'#2a1a3a')}
function portraitDisplay(it,x,t){const gs=PS(),s=26*gs,sx=Math.round(X(x)),top=Math.round(Y(150))-s,own=owns(it.id),pin=SVz().cmp.includes(it.id),k=it.fr||0;
 // pedestal
 rr(x-62,0,124,70,C.mid);rr(x-70,70,140,10,C.lit);rr(x-34,80,68,56,'#1a0b38');
 // five frame styles so the pieces are not interchangeable squares
 const x0=sx-s/2,pad=Math.round(gs*2.2);
 if(k===0){P(x0-pad*2,top-pad*2,s+pad*4,s+pad*4,'#7a4e10');P(x0-pad*1.4,top-pad*1.4,s+pad*2.8,s+pad*2.8,C.gd);P(x0-pad*.6,top-pad*.6,s+pad*1.2,s+pad*1.2,'#b8801c')}
 else if(k===1){g2.save();g2.shadowColor=C.se;g2.shadowBlur=22;P(x0-pad,top-pad,s+pad*2,s+pad*2,C.se);g2.restore();P(x0-pad*.5,top-pad*.5,s+pad,s+pad,'#06222c')}
 else if(k===2){P(x0-pad*2,top-pad*2,s+pad*4,s+pad*4,'#3c2a1a');P(x0-pad*1.2,top-pad*1.2,s+pad*2.4,s+pad*2.4,'#6b4a2a');for(let q=0;q<6;q++)P(x0-pad*2+q*(s/5),top-pad*2.4,gs*1.5,gs*2,C.gr,.9)}
 else if(k===3){P(x0-pad*1.5,top-pad*1.5,s+pad*3,s+pad*3,'#cfe8ff',.35);P(x0-pad,top-pad,s+pad*2,s+pad*2,'#0a1830');g2.save();g2.fillStyle='rgba(255,255,255,.08)';g2.fillRect(x0,top,s*.4,s);g2.restore()}
 else{P(x0-pad,top-pad,s+pad*2,s+pad*2,'#08031a');for(const c of[[0,0],[1,0],[0,1],[1,1]])P(x0-pad+(c[0]?s+pad:0),top-pad+(c[1]?s+pad:0),pad,pad,c[0]===c[1]?'#ff4a6a':'#4a8aff')}
 art(it.spr,x0,top,s);
 if(pin){g2.strokeStyle=C.gd;g2.lineWidth=3;g2.setLineDash([6,5]);g2.strokeRect(x0-pad*2.6,top-pad*2.6,s+pad*5.2,s+pad*5.2);g2.setLineDash([])}
 // price sign
 const ty=Math.round(Y(104)),tw=Math.round((it.cap?140:116)*U);P(sx-tw/2,ty,tw,Math.round((it.cap?50:36)*U),'#12082a');P(sx-tw/2,ty,tw,3,rarCol(it.rar));
 TS(it.n.replace('THE ','').slice(0,15),sx,ty+Math.round(15*U),C.pc,9);
 TS(own?'YOURS':fmt(it.p)+' ZEC SIM',sx,ty+Math.round(30*U),own?C.ok:C.gd,10);
  if(it.cap)TS(it.cap,sx,ty+Math.round(44*U),C.mu,8);
 if(own){g2.save();g2.translate(sx+s/2-4,top+4);g2.rotate(.5);P(-34*U,-8*U,68*U,16*U,C.ok);TS('OWNED',0,4*U,'#08031a',9);g2.restore()}}
function arcade(t){ITEMS.forEach((it,i)=>{if(Math.abs(X(XS.f[i]))<W_*.9+260)portraitDisplay(it,XS.f[i],t)});
 TS('THE PORTRAIT ARCADE',X(1560),Y(0)-372*U,C.ac,14)}
function table(t){const x=XS.table,z=SVz();rr(x-110,0,220,80,C.mid);rr(x-120,80,240,12,C.lit);rr(x-120,92,240,3,C.se,.7);
 for(let i=0;i<2;i++){const id=z.cmp[i],cx=Math.round(X(x-56+i*112)),s=Math.round(26*Math.max(3,PS()/2));
  P(cx-s/2-3,Y(98)-s-3,s+6,s+6,'#08031a');if(id)art(byId(id).spr,cx-s/2,Y(98)-s,s);else TS('?',cx,Y(98)-s/2+6*U,C.mu,14)}
 TS('INSPECTION TABLE',X(x),Y(0)-190*U,C.se,10)}
function alley(t){const x=XS.ph,f=F();
 // a darker back alley: dim, flickering, wrong
 rr(x-190,0,380,330,'#05010f',.65);
 const fl=Math.sin(t*23)>.7?.35:1,gx=X(x-90),gy=Y(300);P(gx-3*U,Y(340),6*U,40*U,'#2a1450');P(gx-9*U,gy-8*U,18*U,12*U,'#ff4a6a',.8*fl);
 if(f.solved){const gs=PS(),s=26*gs,x0=Math.round(X(x)-s/2),top=Math.round(Y(150))-s;P(x0-gs*2,top-gs*2,s+gs*4,s+gs*4,'#14072e');TS('REMOVED',X(x),Y(150)-s/2+4*U,C.mu,12);TS('\u2014 reported by you \u2014',X(x),Y(104),C.ok,9);return}
 portraitDisplay(Object.assign({},PHANTOM,{fr:4}),x,t);
 TS('MUST SELL',X(x),Y(0)-300*U,'#ff4a6a',16);
 TS('THE BACK ALLEY',X(x-100),Y(0)+22*U,C.mu,9)}
function lostBox(){const f=F();rr(2900,0,150,120,'#3a2a1a');rr(2900,120,150,6,'#5a4429');rr(2924,126,24,10,'#4ee3f0',.8);rr(3000,126,26,8,C.ac,.8);TS('LOST & FOUND',X(2975),Y(0)-150*U,C.gd,9)}
function board(){const x=XS.board;rr(x-60,0,120,200,C.mid);rr(x-52,80,104,110,'#2a1a14');for(let i=0;i<5;i++)rr(x-44+(i%3)*30,100+((i/3)|0)*40,24,34,'#e8d8c0',.8);
 if(F().solved)rr(x-40,100,80,40,C.ok,.9);rr(x-58,200,116,8,C.lit);TS('NOTICE BOARD',X(x),Y(0)-232*U,C.gd,10)}
function hall(t){const gs=Math.max(3,Math.round(PS()*.85)),s=26*gs;
 TS('THE HALL OF RECORDS',X(3960),Y(0)-340*U,C.gd,14);TS('REAL SALES \u00B7 NOT LISTED HERE',X(3960),Y(0)-318*U,C.mu,9);
 RECS.forEach((r,i)=>{const x=XS.hall[i],sx=Math.round(X(x)),top=Math.round(Y(130))-s,x0=sx-s/2,pad=gs*2;
  rr(x-56,0,112,60,C.mid);rr(x-64,60,128,10,C.lit);
  P(x0-pad*1.6,top-pad*1.6,s+pad*3.2,s+pad*3.2,r.id==='poopie'?'#6b4a2a':'#7a4e10');P(x0-pad,top-pad,s+pad*2,s+pad*2,r.id==='poopie'?'#c28a52':C.gd);art(r.spr,x0,top,s);
  const ty=Math.round(Y(96)),tw=Math.round(112*U);P(sx-tw/2,ty,tw,Math.round(26*U),'#12082a');P(sx-tw/2,ty,tw,2,C.gd);
  TS(r.id==='poopie'?'THE POOPIE':r.n.replace('zkSNARK ','')+' \u00B7 '+(r.id==='r9045'?'54':r.id==='r9284'?'20':'16.9')+' ZEC',sx,ty+Math.round(17*U),r.id==='poopie'?'#ffcf9a':C.gd,9);
  if(r.id==='poopie'){const ry=top+s+gs*7;P(sx-s/2-gs*5,ry-s*.28,gs*2,s*.28+gs*3,C.ac,.9);P(sx+s/2+gs*3,ry-s*.28,gs*2,s*.28+gs*3,C.ac,.9);P(sx-s/2-gs*5,ry-s*.18,s+gs*8,gs*1.2,C.ac,.8)}})}
function collWall(t){const x=XS.coll,z=SVz(),gs=3,s=26*gs;rr(x-190,0,380,24,C.mid);rr(x-190,24,380,260,'#14072e');rr(x-190,284,380,8,C.lit);TS('YOUR COLLECTION',X(x),Y(0)-318*U,C.ac,12);
 const ids=['witness','proof','oracle','visor','d3','grail'];
 ids.forEach((id,i)=>{const cx=Math.round(X(x-140+(i%3)*140)),cy=Math.round(Y(232-((i/3)|0)*118)),own=z.own.includes(id);
  P(cx-s/2-5,cy-5,s+10,s+10,own?C.gd:'#2a1450');P(cx-s/2-2,cy-2,s+4,s+4,'#08031a');
  if(own)art(byId(id).spr,cx-s/2,cy,s);else TS(id==='grail'?'?':'\u2022',cx,cy+s/2+5*U,'#4a2a85',12)})}
function bell(t){const x=XS.bell,f=F(),k=f.fin?1:0;rr(x-18,0,36,260,C.lit);rr(x-60,0,120,20,C.mid);rr(x-50,260,100,10,C.gd);
 const sw=f.fin?Math.sin(t*5)*.2*Math.max(0,1-(V.parade||0)/6):0,gx=X(x),gy=Y(240);g2.save();g2.translate(gx,gy);g2.rotate(sw);g2.fillStyle=C.gd;g2.beginPath();g2.moveTo(-26*U,56*U);g2.quadraticCurveTo(-26*U,10*U,0,0);g2.quadraticCurveTo(26*U,10*U,26*U,56*U);g2.closePath();g2.fill();P(-3*U,56*U,6*U,12*U,'#fff2b8');g2.restore();
 if(k){const g=g2.createRadialGradient(gx,gy,0,gx,gy,320*U);g.addColorStop(0,'rgba(255,211,90,.35)');g.addColorStop(1,'rgba(255,211,90,0)');g2.fillStyle=g;g2.fillRect(gx-320*U,gy-320*U,640*U,640*U)}
 TS(f.fin?'THE MARKET IS CLOSED FOR THE NIGHT':'THE CLOSING BELL',gx,Y(0)-330*U,C.gd,11)
 // closing parade: the portraits you own cross the plaza
 if(f.fin&&V.parade>=0){const own=SVz().own;own.forEach((id,i)=>{const px=XS.bell-420+((V.parade*70+i*130)%520),py=300+Math.sin(V.parade*2+i)*10;const gs=Math.max(3,Math.round(PS()*.5)),s=26*gs;
   P(X(px)-s/2-3,Y(py)-s-3,s+6,s+6,C.gd);art(byId(id).spr,X(px)-s/2,Y(py)-s,s)})}}
function entrance(t){const x=300;rr(x-160,0,28,330,C.lit);rr(x+132,0,28,330,C.lit);rr(x-176,330,352,34,C.mid);rr(x-176,360,352,5,C.ac);
 g2.save();g2.shadowColor=C.glow;g2.shadowBlur=22;g2.textAlign='center';g2.fillStyle=C.pc;g2.font=SERIF(34);g2.fillText('ZILKROAD',X(x),Y(334)+8*U);g2.restore();
 TS('THE MARKETPLACE OF IDENTITIES',X(x),Y(300),C.mu,10);
 for(let i=0;i<5;i++){const bx=X(x-120+i*60),by=Y(370+Math.sin(t*1.5+i)*14),c=[C.ac,C.se,C.gd,C.gr,'#ff4a6a'][i];P(bx-2*U,by,4*U,60*U,'#5a3a95',.6);g2.fillStyle=c;g2.beginPath();g2.ellipse(bx,by,15*U,19*U,0,0,7);g2.fill();P(bx-6*U,by-9*U,5*U,7*U,'#fff',.4)}
 // a few portraits already on show from the entrance, so the market reads as a market of faces at a glance
 const gs=Math.max(3,Math.round(PS()*.5));[['witness',-20,150],['oracle',60,166]].forEach(a=>{});}
function scene(t){sky(t);crowd(t);floor(t);entrance(t);stalls(t);arcade(t);table(t);lostBox();alley(t);board();hall(t);collWall(t);bell(t);
 CRATE.forEach(k=>{rr(k[0],k[2]-16,k[1],16,'#3a2a1a');rr(k[0],k[2]-3,k[1],3,'#5a4429')});
 lanterns(t);
 V.vp.forEach(q=>{g2.globalAlpha=Math.min(1,q.l*1.5);P(X(q.x),Y(q.y),q.s*U,q.s*U,q.c);g2.globalAlpha=1});
 if(V.solveT>=0&&V.solveT<3){g2.globalAlpha=1-V.solveT/3;for(let i=0;i<20;i++){const a=i/20*6.28,r=V.solveT*190;P(X(XS.board)+Math.cos(a)*r*U,Y(180)+Math.sin(a)*r*U,6*U,6*U,[C.gd,C.se,C.ac][i%3])}g2.globalAlpha=1}
 V.ft.forEach(f=>bubble(f.s,X(f.x),Y(f.y),C.ac,260*U,Math.min(1,f.l)))}
function wrap(s,mw){const o=[];s.split('\n').forEach(par=>{let l='';par.split(' ').forEach(w=>{const t=l?l+' '+w:w;if(g2.measureText(t).width>mw&&l){o.push(l);l=w}else l=t});o.push(l)});return o}
function bubble(s,x,y,col,mw,a){g2.font=MONO(12);const fs=Math.round(Math.max(11,12*U)),ln=wrap(s,mw),lh=fs*1.4,bw=Math.max(...ln.map(l=>g2.measureText(l).width))+18,bh=ln.length*lh+12;
 const bx=Math.max(8,Math.min(W_-bw-8,x-bw/2)),by=y-bh;g2.save();g2.globalAlpha=a==null?1:a;P(bx,by,bw,bh,'#08031aea');g2.strokeStyle=col;g2.lineWidth=2;g2.strokeRect(bx,by,bw,bh);
 g2.fillStyle=C.pc;g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx+9,by+6+lh*(i+.8)));g2.restore()}

// ======================= player, panels, HUD =======================
function drawPlayer(p){const eq=SVz().eq,ph=PH*U,sx=X(V.px),sy=Y(V.py),idle=V.gr&&Math.abs(V.vx)<20?Math.sin(T*3)*.012:0;
 g2.fillStyle='#0009';g2.beginPath();g2.ellipse(sx,sy+3,ph*.28,5*U,0,0,7);g2.fill();
 g2.save();g2.shadowColor=C.glow;g2.shadowBlur=16;g2.imageSmoothingEnabled=false;g2.translate(sx,sy);g2.scale(V.face<0?-(1-idle):1-idle,1+idle);
 if(eq&&ZT[byId(eq).spr]){const s=ph*1.02;g2.drawImage(ZT[byId(eq).spr],-s/2,-s,s,s)}      // the worn portrait, cosmetic and local to this world
 else if(pim&&pim.complete&&pim.width){const aw=ph*pim.width/pim.height;g2.drawImage(pim,-aw/2,-ph,aw,ph)}
 g2.restore()}
function uiDraw(){const u=V.ui;if(!u)return;const body=typeof u.b==='function'?u.b():u.b;
 const arts=u.art?(Array.isArray(u.art)?u.art:[u.art]):[],two=arts.length>1,asz=two?Math.round(Math.max(96,110*U)):Math.round(Math.max(120,176*U)),acol=arts.length?asz+(two?asz+14:0)+22:0;
 const mw=Math.min(W_-30,arts.length?(two?980:860):720),pad=18;g2.font=MONO(13);const fs=Math.round(Math.max(12,13*U)),lh=fs*1.45,ln=wrap(body,mw-pad*2-acol);
 const oh=Math.round(Math.max(30,32*U)),textH=lh*ln.length+(u.t?lh+6:0),bh=pad*2+Math.max(textH,arts.length?asz+14:0)+u.o.length*oh+8,bx=(W_-mw)/2,by=Math.max(64,(H_-bh)/2-8);
 g2.save();P(bx,by,mw,bh,'#08031af4');g2.strokeStyle=u.c||C.pc;g2.lineWidth=2;g2.strokeRect(bx,by,mw,bh);P(bx,by,mw,3,u.c||C.pc);g2.textAlign='left';
 arts.forEach((id,i)=>{const ax=bx+pad+i*(asz+14);P(ax-3,by+pad+(u.t?lh+6:0)-3,asz+6,asz+6,u.c||C.pc);art(id,ax,by+pad+(u.t?lh+6:0),asz)});
 let y=by+pad;const tx0=bx+pad+acol;
 if(u.t){g2.fillStyle=u.c||C.pc;g2.font=MONO(12);g2.fillText(u.t,bx+pad,y+fs);y+=lh+6}
 g2.font=MONO(13);g2.fillStyle=C.pc;ln.forEach(l=>{g2.fillText(l,tx0,y+fs);y+=lh});
 y=by+pad+Math.max(textH,arts.length?asz+14:0)+8;V.uiR=[];
 u.o.forEach((op,i)=>{const sel=i===u.sel;P(bx+pad-6,y,mw-pad*2+12,oh-4,sel?'#2a1456':'#14072e');if(sel)P(bx+pad-6,y,4,oh-4,u.c||C.pc);
  g2.fillStyle=sel?C.pc:C.mu;g2.font=MONO(13);g2.fillText((sel?'\u25B6 ':'   ')+op.l,bx+pad+4,y+oh*.62);V.uiR.push({x:bx+pad-6,y,w:mw-pad*2+12,h:oh-4,i});y+=oh});
 g2.restore()}
function goal(){const z=SVz(),f=F();
 if(!f.met)return 'TALK TO PIP';if(!Object.keys(z.seen).some(k=>ITEMS.some(i=>i.id===k)))return 'LOOK AT A PORTRAIT';
 if(!f.cmp&&!z.own.length)return 'PIN TWO, COMPARE AT THE TABLE';if(!f.fin)return 'DECIDE, THEN RING THE BELL';return 'THE MARKET IS CLOSED. WALK IT AGAIN.'}
function drawHud(p){const z=SVz(),px0=18,py0=coarse?122:18,w2=300;g2.textAlign='left';
 P(px0,py0,w2,64,'#08031ad8');g2.strokeStyle=C.ac;g2.lineWidth=2;g2.strokeRect(px0,py0,w2,64);
 g2.font=MONO(11);g2.fillStyle=C.gd;g2.fillText('PURSE '+fmt(z.bal)+' ZEC (SIM)',px0+10,py0+18);
 g2.fillStyle=C.mu;g2.textAlign='right';g2.fillText('OWNED '+z.own.length+'  [C]',px0+w2-10,py0+18);g2.textAlign='left';
 g2.fillStyle=C.pc;g2.fillText('\u25B6 '+goal(),px0+10,py0+40);g2.fillStyle=C.mu;g2.font=MONO(10);g2.fillText('SIMULATED \u00B7 NO REAL FUNDS OR WALLET',px0+10,py0+57);
 g2.textAlign='center';
 if(V.near&&!V.ui)bubble((coarse?'TAP \u270B  ':'[E]  ')+V.near.l,X(V.near.x),Y((V.near.y||0)+330),C.ok,340*U);
 if(V.bad>0){g2.fillStyle='rgba(255,106,100,'+V.bad*.18+')';g2.fillRect(0,0,W_,H_)}
 if(V.flash>0){g2.fillStyle='rgba(255,233,246,'+V.flash*.3+')';g2.fillRect(0,0,W_,H_)}
 if(!coarse&&!V.ui){g2.font=MONO(11);g2.fillStyle=C.mu;g2.fillText('A / D WALK \u00B7 SPACE JUMP \u00B7 E USE \u00B7 C YOUR COLLECTION',W_/2,H_-14)}
 if(V.mt>0&&V.msg&&!V.ui){g2.font=MONO(13);const mw=Math.min(W_-24,700),ln=wrap(V.msg,mw-28),bh=ln.length*22+22,bx=(W_-mw)/2,by=H_-bh-(coarse?90:38);
  g2.save();g2.globalAlpha=Math.min(1,V.mt*2);P(bx,by,mw,bh,'#08031af2');g2.strokeStyle=C.ok;g2.lineWidth=2;g2.strokeRect(bx,by,mw,bh);g2.fillStyle=C.pc;g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx+14,by+24+i*22));g2.restore()}
 uiDraw();g2.textAlign='center'}

// ======================= wiring =======================
const _fz=fore;fore=function(w,h,gy,p){if(!isZ())return _fz(w,h,gy,p);
 amb(w,h,T,TH.zilkroad,p);const v=g2.createRadialGradient(w/2,h*.46,Math.min(w,h)*.34,w/2,h*.46,Math.max(w,h)*.8);
 v.addColorStop(0,'rgba(8,3,26,0)');v.addColorStop(1,'rgba(8,3,26,.55)');g2.fillStyle=v;g2.fillRect(0,0,w,h)};
const _bgz=bg;bg=function(w,h,gy,p){if(isZ()){frame(w,h,gy);cam=V.cx*U;scene(T)}else _bgz(w,h,gy,p)};
const _avz=avatar;avatar=function(w,h,gy,p){if(isZ()){drawPlayer(p);drawHud(p)}else _avz(w,h,gy,p)};
// Zilkroad declares engine steps, so startWorld builds a guided orb tour. This world is free-roam, so that tour is switched off
// after startWorld builds it; the ending is the Closing Bell, which calls the engine's own finishWorld().
const _stz=startWorld;startWorld=function(i){const me=W[i].id==='zilkroad';if(me)zInit();_stz(i);
 if(me){hs=[];vis=[];fin=0;pan=0;ax=-60;tx=ax;$z('wf').innerHTML=''}};
const _spz=stopWorld;stopWorld=function(){if(V)V.on=0;ctl(0);_spz()};
});
