(function(){
var WA=‘https://wa.me/2348087674813?text=’;
function wa(msg){return WA+encodeURIComponent(msg)}
/* any image that fails to load is hidden; its dark frame stays in place /
document.addEventListener(‘error’,function(e){if(e.target&&e.target.tagName===‘IMG’)e.target.classList.add(‘img-fail’)},true);
/ WhatsApp message with product name and price (price only when one is set) */
function orderMsg(i){return ‘Hello HOF, I would like to order ‘+i.n+(i.p?’ (’+i.p+(i.u?’ per ‘+i.u:’’)+’)’:’’)+’. Please confirm availability.’}
function esc(s){return String(s).replace(/[&<>”]/g,function(c){return {’&’:’&’,’<’:’<’,’>’:’>’,’”’:’"’}[c]})}

var IMG_DIR=‘products/fabrics/’;

var fabrics=[
{n:‘Mr. Fendi’,p:‘₦4,500’,u:‘yard’,c:‘Fabrics’,img:[
‘0a33cbdc-2e1d-4f6e-98c4-937ec276c8d0.jpeg’,
‘0f46adae-d82d-431b-80cf-df8c51d07349.jpeg’,
‘5ff9bded-a8c2-4994-949f-f8ca4b3e3103.jpeg’,
‘7a1a054a-dbf3-4189-9f14-1d8a3c83522e.jpeg’,
‘8b2ce98a-7a5e-4287-93ad-e06d45d6c3c3.jpeg’,
‘926bcce8-1117-4bad-93c8-a79f7606686c.jpeg’,
‘b8a8bf51-7c44-499b-9f5e-e794bb70b10c.jpeg’
]},
{n:‘Phanta Plus’,p:‘₦5,500’,u:‘yard’,c:‘Fabrics’,img:[
‘01b7bc6d-68d8-4915-a795-59bc6dbd6c66.jpeg’,
‘0cd51af6-0040-4923-b224-3fb02b8a4510.jpeg’,
‘533d7f2d-d9f8-470e-bd49-024f6d1b5ce1.jpeg’,
‘b5b62d5f-b4a8-4c7b-a263-e81de439e01c.jpeg’,
‘ced7fb43-5989-4d37-adac-9d50d785678f.jpeg’,
‘d1900077-1abe-4701-a4be-1d6a4fed6764.jpeg’,
‘f08b7fb2-a416-45eb-9e5b-e4f72908db9a.jpeg’,
‘f5803ace-4ca9-4e26-9480-0bbcc2c1ce03.jpeg’,
‘f7e5b68a-eab2-4c27-b99c-4ac33fa8f6dc.jpeg’,
‘fbe3da1f-60e4-4417-bf53-c4dcf4461f99.jpeg’,
‘ffc2e686-1408-46d7-b744-ae3934819a99.jpeg’
]},
{n:‘Supreme Longhua’,p:‘₦3,700’,u:‘yard’,c:‘Fabrics’},
{n:‘Wagambari’,p:‘₦30,000’,u:‘5-yard set’,d:‘Traditional men's fabric, supplied as a 5-yard set.’,c:‘Wagambari’},
{n:‘Excelsior’,p:‘₦3,800’,u:‘yard’,c:‘Fabrics’},
{n:‘Goods Will’,p:‘₦3,800’,u:‘yard’,c:‘Fabrics’},
{n:‘Casacada by Mhood’,p:‘₦4,500’,u:‘yard’,c:‘Fabrics’},
{n:‘Oliva’,p:‘₦4,000’,u:‘yard’,c:‘Fabrics’},
{n:‘Trevita’,p:‘₦4,000’,u:‘yard’,c:‘Fabrics’},
{n:‘Turkish Wool’,p:‘₦11,500’,u:‘yard’,d:‘Wool fabric for refined tailoring.’,c:‘Fabrics’},
{n:‘Yak Wool’,p:‘₦13,500’,u:‘yard’,d:‘Wool fabric from our premium range.’,c:‘Fabrics’},
{n:‘VIP Ultimate’,p:‘₦7,000’,u:‘yard’,d:‘A premium selection for distinguished dressing.’,c:‘Fabrics’}
];

var caps=[
{n:‘Zeeta’,p:‘₦6,000’,d:‘Wholesale price; please confirm current availability.’,c:‘Men's Caps’},
{n:‘Eleganza’,p:‘₦9,000’,d:‘Wholesale price; please confirm current availability.’,c:‘Men's Caps’},
{n:‘Dara’,p:‘₦36,000’,d:‘Wholesale price; please confirm current availability.’,c:‘Men's Caps’},
{n:‘Zanna’,p:‘₦18,000’,d:‘Wholesale price; please confirm current availability.’,c:‘Men's Caps’},
{n:‘Tangaran’,p:‘₦40,000’,d:‘Wholesale price; please confirm current availability.’,c:‘Men's Caps’},
{n:‘Kindai Miyamar Borno’,p:‘₦35,000’,d:‘Wholesale price; please confirm current availability.’,c:‘Men's Caps’}
];

var arrivals=[];
var pats=[‘twill’,‘stripe’,‘rib’,‘basket’,‘herring’,‘dot’];
var registry={},uid=0;

function imgSrc(f){return f.indexOf(’/’)>-1?f:IMG_DIR+f}

function makeCard(item){
var id=‘p’+(uid++);
registry[id]=item;
var pat=pats[uid%pats.length];
var price=item.p
? ‘’+esc(item.p)+’’+(item.u?’ / ‘+esc(item.u)+’’:’’)
: ‘Price on request’;
var msg=orderMsg(item);
var photos=(item.img||[]).filter(Boolean);
var photoBadge=photos.length>1?’’+photos.length+’ photos’:’’;
var thumbStrip=photos.length>1?’’+photos.slice(1,5).map(function(f,i){return ‘’}).join(’’)+(photos.length>5?’+’+(photos.length-5)+’’:’’)+’’:’’;
return ‘’
+’’
+’’+(photos[0]?’’:’’)+photoBadge+’’
+’’+esc(item.n)+’’
+(item.d?’’+esc(item.d)+’’:’’)
+price
+’’+(item.tag?esc(item.tag):‘Confirm availability on WhatsApp’)+’’
+’’+thumbStrip
+’Order on WhatsApp’
+’’;
}

function fillGrid(id,list){
var el=document.getElementById(id);
if(el)el.innerHTML=list.map(makeCard).join(’’);
}

fillGrid(‘capGrid’,caps);
fillGrid(‘arrivalGrid’,arrivals);

/* –– Fabric catalogue: search + category filter –– */
var cats=[‘All’,‘Fabrics’,‘Wagambari’];
var chipsEl=document.getElementById(‘fabricChips’);

if(chipsEl){
chipsEl.innerHTML=cats.map(function(c,i){
return ‘’+esc(c)+’’;
}).join(’’);
}

var activeCat=‘All’,query=’’;

function renderFabrics(){
var list=fabrics.filter(function(f){
var matchCat=activeCat===‘All’||f.c===activeCat;
var hay=(f.n+’ ‘+(f.d||’’)+’ ‘+f.c).toLowerCase();
var matchQuery=!query||hay.indexOf(query)>-1;
return matchCat&&matchQuery;
});
var grid=document.getElementById(‘fabricGrid’),empty=document.getElementById(‘fabricEmpty’);
if(grid)grid.innerHTML=list.map(makeCard).join(’’);
if(empty)empty.hidden=list.length>0;
}

renderFabrics();

if(chipsEl)chipsEl.addEventListener(‘click’,function(e){
var b=e.target.closest(’.chip’);
if(!b)return;
chipsEl.querySelectorAll(’.chip’).forEach(function(c){c.setAttribute(‘aria-pressed’,‘false’)});
b.setAttribute(‘aria-pressed’,‘true’);
activeCat=b.getAttribute(‘data-cat’);
renderFabrics();
});

var searchInput=document.getElementById(‘fabricSearch’);

if(searchInput)searchInput.addEventListener(‘input’,function(){
query=searchInput.value.trim().toLowerCase();
renderFabrics();
});

/* –– Shop by category –– */
var catMaster=[
{label:‘Fabrics’,key:‘Fabrics’,target:‘fabrics’},
{label:‘Lace’,key:‘Lace’,target:‘fabrics’},
{label:‘Voil’,key:‘Voil’,target:‘fabrics’},
{label:‘Atiku’,key:‘Atiku’,target:‘fabrics’},
{label:‘Swiss’,key:‘Swiss’,target:‘fabrics’},
{label:‘Getzner’,key:‘Getzner’,target:‘fabrics’},
{label:‘Shadda’,key:‘Shadda’,target:‘fabrics’},
{label:‘Wagambari’,key:‘Wagambari’,target:‘fabrics’},
{label:‘Men's Caps’,key:‘Men's Caps’,target:‘caps’}
];

var sbcEl=document.getElementById(‘sbcIndex’);

function renderCategoryIndex(){
if(!sbcEl)return;
sbcEl.innerHTML=catMaster.map(function(cat){
var count=cat.target===‘caps’?caps.length:fabrics.filter(function(f){return f.c.toLowerCase()===cat.key.toLowerCase()}).length;
var countLabel=count>0?(count+(count===1?’ piece’:’ pieces’)):‘Ask on WhatsApp’;
return ‘’
+’’+esc(cat.label)+’’
+’’+esc(countLabel)+’→’
+’’;
}).join(’’);
}

renderCategoryIndex();

if(sbcEl){
sbcEl.addEventListener(‘click’,function(e){
var row=e.target.closest(’.sbc-row’);
if(!row)return;
var key=row.getAttribute(‘data-key’),target=row.getAttribute(‘data-target’);
if(target===‘caps’){
document.getElementById(‘caps’).scrollIntoView({behavior:‘smooth’,block:‘start’});
return;
}
if(!fabrics.some(function(f){return f.c.toLowerCase()===key.toLowerCase()})){
window.open(wa(‘Hello HOF, I would like to see your ‘+key+’ collection. Please send me available options and prices.’),’_blank’,‘noopener,noreferrer’);
return;
}
activeCat=key;
query=’’;
if(searchInput)searchInput.value=’’;
renderFabrics();
if(chipsEl)chipsEl.querySelectorAll(’.chip’).forEach(function(c){
c.setAttribute(‘aria-pressed’,c.getAttribute(‘data-cat’)===key?‘true’:‘false’);
});
document.getElementById(‘fabrics’).scrollIntoView({behavior:‘smooth’,block:‘start’});
});
}

/* –– Product detail view –– */
var backdrop=document.getElementById(‘modalBackdrop’),lastFocus=null;
var gal=null,reduceMotion=window.matchMedia(’(prefers-reduced-motion:reduce)’);
var closeBtn=’×’;

function patternSwatch(){
var pat=pats[Math.floor(Math.random()*pats.length)];
return ‘’;
}

function galSync(){
if(!gal)return;
var c=gal.track.children.length,w=gal.track.clientWidth;
if(!c||!w)return;
var i=Math.max(0,Math.min(c-1,Math.round(gal.track.scrollLeft/w)));
gal.i=i;
if(gal.count)gal.count.textContent=(i+1)+’ / ’+c;
[].forEach.call(gal.thumbs.children,function(b,k){
b.setAttribute(‘aria-current’,k===i?‘true’:‘false’);
if(k===i)gal.thumbs.scrollTo({left:b.offsetLeft-(gal.thumbs.clientWidth-b.offsetWidth)/2,behavior:reduceMotion.matches?‘auto’:‘smooth’});
});
}

function galStep(d){
if(!gal)return;
galGo((gal.pend!=null?gal.pend:gal.i)+d);
}

function galGo(n){
if(!gal)return;
var c=gal.track.children.length;
if(c<2)return;
n=(n+c)%c;
gal.pend=n;clearTimeout(gal.pt);gal.pt=setTimeout(function(){if(gal)gal.pend=null},700);
gal.track.scrollTo({left:n*gal.track.clientWidth,behavior:reduceMotion.matches?‘auto’:‘smooth’});
}

function galRefresh(){
var c=gal.track.children.length,multi=c>1;
[].forEach.call(gal.thumbs.children,function(b,k){b.setAttribute(‘data-i’,k);b.setAttribute(‘aria-label’,‘Show photo ‘+(k+1))});
gal.thumbs.hidden=!multi;
[].forEach.call(document.querySelectorAll(’#modalSwatch .gal-nav,#modalSwatch .gal-count’),function(el){el.hidden=!multi});
galSync();
}

function buildGallery(item){
var sw=document.getElementById(‘modalSwatch’),th=document.getElementById(‘modalThumbs’);
gal=null;
if(!sw)return;
if(th){th.hidden=true;th.innerHTML=’’;}
var files=(item.img||[]).filter(Boolean);
if(!files.length){sw.innerHTML=patternSwatch()+closeBtn;return}
var slides=’’,thumbs=’’;
files.forEach(function(f,i){
var src=esc(imgSrc(f)),alt=esc(item.n+’ — HOF Home of Fabric, photo ‘+(i+1));
slides+=’<img src=”’+src+’” alt=”’+alt+’” decoding=“async” draggable=“false”’+(i?’ loading=“lazy”’:’’)+’>’;
thumbs+=’’;
});
sw.innerHTML=’’
+’’+slides+’’
+’‹’
+’›’
+’’+closeBtn;
if(!th){sw.innerHTML=patternSwatch()+closeBtn;return;}
th.innerHTML=thumbs;
gal={track:sw.querySelector(’.gal-track’),count:sw.querySelector(’.gal-count’),thumbs:th,i:0};
var ticking=false;
gal.track.addEventListener(‘scroll’,function(){if(!ticking){ticking=true;requestAnimationFrame(function(){ticking=false;galSync()})}},{passive:true});
var pairs=[].map.call(gal.track.children,function(s,k){return {s:s,t:th.children[k]}});
pairs.forEach(function(p){
function drop(){
if(p.gone||!gal)return;
p.gone=true;p.s.remove();p.t.remove();
if(!gal.track.children.length){
gal=null;th.hidden=true;th.innerHTML=’’;
sw.innerHTML=patternSwatch()+closeBtn;
document.getElementById(‘modalClose’).focus();
return;
}
galRefresh();
}
p.s.firstChild.addEventListener(‘error’,drop);
p.t.firstChild.addEventListener(‘error’,drop);
});
galRefresh();
}

document.addEventListener(‘click’,function(e){
if(!gal)return;
var t=e.target.closest(’.gal-prev,.gal-next,.thumb’);
if(!t)return;
if(t.classList.contains(‘thumb’))galGo(+t.getAttribute(‘data-i’));
else galStep(t.classList.contains(‘gal-next’)?1:-1);
});

document.addEventListener(‘keydown’,function(e){
if(!gal||!backdrop.classList.contains(‘open’))return;
if(e.key===‘ArrowRight’){e.preventDefault();galStep(1)}
else if(e.key===‘ArrowLeft’){e.preventDefault();galStep(-1)}
});

function openModal(item){
if(!item)return;
lastFocus=document.activeElement;
document.getElementById(‘modalTitle’).textContent=item.n;
document.getElementById(‘modalPrice’).innerHTML=item.p
? ‘’+esc(item.p)+’’+(item.u?’/ ‘+esc(item.u)+’’:’’)
: ‘Price on request’;
document.getElementById(‘modalDesc’).textContent=item.d||‘Premium selection from HOF — Home of Fabric.’;
document.getElementById(‘modalAvail’).textContent=(item.u?‘Unit: ‘+item.u+’   ·   ‘:’’)+‘Availability confirmed on WhatsApp’;
try{buildGallery(item)}catch(err){document.getElementById(‘modalSwatch’).innerHTML=patternSwatch()+closeBtn;var thumbsEl=document.getElementById(‘modalThumbs’);if(thumbsEl)thumbsEl.hidden=true}
document.getElementById(‘modalOrder’).href=wa(orderMsg(item));
backdrop.classList.add(‘open’);
backdrop.setAttribute(‘aria-hidden’,‘false’);
document.body.style.overflow=‘hidden’;
document.getElementById(‘modalClose’).focus();
}

function closeModal(){
backdrop.classList.remove(‘open’);
backdrop.setAttribute(‘aria-hidden’,‘true’);
document.body.style.overflow=’’;
if(lastFocus&&lastFocus.focus)lastFocus.focus();
}

document.addEventListener(‘click’,function(e){
var thumb=e.target.closest(’.pc-thumb[data-id]’);
if(thumb){
openModal(registry[thumb.getAttribute(‘data-id’)]);
var photoIndex=Number(thumb.getAttribute(‘data-photo’))||0;
if(photoIndex)requestAnimationFrame(function(){if(gal)galGo(photoIndex)});
return;
}
var trig=e.target.closest(’.pc-trigger’);
if(trig){openModal(registry[trig.getAttribute(‘data-id’)]);return}
if(e.target===backdrop||e.target.closest(’#modalClose’))closeModal();
});

document.addEventListener(‘keydown’,function(e){
if(!backdrop.classList.contains(‘open’))return;
if(e.key===‘Escape’){closeModal();return}
if(e.key===‘Tab’){
var focusable=backdrop.querySelectorAll(‘button,a[href]’);
if(!focusable.length)return;
var first=focusable[0],last=focusable[focusable.length-1];
if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
}
});

/* –– Mobile menu –– */
var burger=document.querySelector(’.burger’),nav=document.getElementById(‘menu’);
var mainEl=document.getElementById(‘main’),footerEl=document.querySelector(’.footer’);

function setMenu(open){
if(!nav||!burger)return;
nav.classList.toggle(‘open’,open);
burger.setAttribute(‘aria-expanded’,open);
burger.setAttribute(‘aria-label’,open?‘Close menu’:‘Open menu’);
document.body.style.overflow=open?‘hidden’:’’;
[mainEl,footerEl].forEach(function(el){
if(!el)return;
if(open)el.setAttribute(‘inert’,’’);else el.removeAttribute(‘inert’);
});
}

if(burger&&nav){
burger.addEventListener(‘click’,function(){setMenu(!nav.classList.contains(‘open’))});
nav.addEventListener(‘click’,function(e){if(e.target.closest(‘a’))setMenu(false)});
document.addEventListener(‘keydown’,function(e){if(e.key===‘Escape’)setMenu(false)});
var desktopMQ=window.matchMedia(’(min-width:960px)’);
if(desktopMQ.addEventListener)desktopMQ.addEventListener(‘change’,function(){setMenu(false)});
else if(desktopMQ.addListener)desktopMQ.addListener(function(){setMenu(false)});
}

/* –– Scroll reveal –– */
function observeReveal(){
var items=document.querySelectorAll(’.rv’);
if(‘IntersectionObserver’ in window){
var io=new IntersectionObserver(function(es){
es.forEach(function(e){if(e.isIntersecting){e.target.classList.add(‘in’);io.unobserve(e.target)}});
},{threshold:.12,rootMargin:‘0px 0px -6% 0px’});
items.forEach(function(el){io.observe(el)});
}else{items.forEach(function(el){el.classList.add(‘in’)})}
}

observeReveal();

/* –– Floating WhatsApp button –– /
var fab=document.getElementById(‘fab’),ticking=false;
function onScroll(){
ticking=false;
if(fab)fab.classList.toggle(‘show’,window.scrollY>window.innerHeight.8);
}
window.addEventListener(‘scroll’,function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();

/* –– Supabase connection: public catalogue –– */
function loadExternalScript(src){
return new Promise(function(resolve,reject){
var script=document.createElement(‘script’);
script.src=src;
script.onload=resolve;
script.onerror=function(){reject(new Error(’Could not load ’+src))};
document.head.appendChild(script);
});
}

async function loadHOFProducts(){
try{
if(!window.supabase){
await loadExternalScript(‘https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2’);
}

  if(!window.HOF_SUPABASE_URL||!window.HOF_SUPABASE_PUBLISHABLE_KEY){
    await loadExternalScript('./config.js');
  }
  if(!window.supabase||!window.HOF_SUPABASE_URL||!window.HOF_SUPABASE_PUBLISHABLE_KEY){
    throw new Error('Supabase configuration is missing.');
  }
  var client=window.supabase.createClient(
    window.HOF_SUPABASE_URL,
    window.HOF_SUPABASE_PUBLISHABLE_KEY
  );
  var result=await client
    .from('products')
    .select('*')
    .eq('is_available',true)
    .order('created_at',{ascending:false});
  if(result.error)throw result.error;
  var products=result.data||[];
  function formatPrice(value){
    if(value===null||value===undefined||value==='')return '';
    var valueText=String(value);
    return valueText.indexOf('₦')===0?valueText:'₦'+valueText;
  }
  var mapped=products.map(function(p){
    return {
      n:p.name||'',
      p:formatPrice(p.price),
      u:p.unit||'',
      c:p.category||'Fabrics',
      d:p.description||'',
      img:Array.isArray(p.images)?p.images:[],
      tag:p.is_new_arrival?'New arrival':''
    };
  });
  var capCategories=['caps',"men's caps",'accessories'];
  caps=mapped.filter(function(p){
    return capCategories.indexOf(p.c.toLowerCase())!==-1;
  });
  fabrics=mapped.filter(function(p){
    return capCategories.indexOf(p.c.toLowerCase())===-1;
  });
  arrivals=mapped.filter(function(p){
    return p.tag==='New arrival';
  });
  var dynamicCategories=['All'].concat(
    Array.from(new Set(fabrics.map(function(p){return p.c})))
  );
  if(chipsEl){
    chipsEl.innerHTML=dynamicCategories.map(function(c,i){
      return '<button type="button" class="chip" data-cat="'+esc(c)+'" aria-pressed="'+(i===0?'true':'false')+'">'+esc(c)+'</button>';
    }).join('');
    activeCat='All';
  }
  refreshPublicCatalogue();
}catch(error){
  console.error('HOF catalogue could not load from Supabase. Showing saved catalogue instead:',error);
}

}

function refreshPublicCatalogue(){
uid=0;
registry={};
fillGrid(‘capGrid’,caps);
fillGrid(‘arrivalGrid’,arrivals);
renderFabrics();
renderCategoryIndex();
observeReveal();
}

loadHOFProducts();

})();
