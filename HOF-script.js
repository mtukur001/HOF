(function(){
  var WA='https://wa.me/2348087674813?text=';
  function wa(msg){return WA+encodeURIComponent(msg)}
  /* any image that fails to load is hidden; its dark frame stays in place */
  document.addEventListener('error',function(e){if(e.target&&e.target.tagName==='IMG')e.target.classList.add('img-fail')},true);
  /* WhatsApp message with product name and price (price only when one is set) */
  function orderMsg(i){return 'Hello HOF, I would like to order '+i.n+(i.p?' ('+i.p+(i.u?' per '+i.u:'')+')':'')+'. Please confirm availability.'}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  /* ---- Content: edit here ----
     PHOTOS: add  img:['file-1.jpeg','file-2.jpeg']  to any fabric or cap.
     A bare filename is read from IMG_DIR below (products/fabrics/); a path with a
     slash, e.g. 'products/caps/zeeta-1.jpg', is used exactly as written.
     The first file is shown first. Items without img keep the fabric pattern. */
  var IMG_DIR='products/fabrics/';
  var fabrics=[
    {n:'Mr. Fendi',p:'₦4,500',u:'yard',c:'Fabrics',img:[
      '0a33cbdc-2e1d-4f6e-98c4-937ec276c8d0.jpeg',
      '0f46adae-d82d-431b-80cf-df8c51d07349.jpeg',
      '5ff9bded-a8c2-4994-949f-f8ca4b3e3103.jpeg',
      '7a1a054a-dbf3-4189-9f14-1d8a3c83522e.jpeg',
      '8b2ce98a-7a5e-4287-93ad-e06d45d6c3c3.jpeg',
      '926bcce8-1117-4bad-93c8-a79f7606686c.jpeg',
      'b8a8bf51-7c44-499b-9f5e-e794bb70b10c.jpeg'
    ]},
    {n:'Phanta Plus',p:'₦5,500',u:'yard',c:'Fabrics',img:[
      '01b7bc6d-68d8-4915-a795-59bc6dbd6c66.jpeg',
      '0cd51af6-0040-4923-b224-3fb02b8a4510.jpeg',
      '533d7f2d-d9f8-470e-bd49-024f6d1b5ce1.jpeg',
      'b5b62d5f-b4a8-4c7b-a263-e81de439e01c.jpeg',
      'ced7fb43-5989-4d37-adac-9d50d785678f.jpeg',
      'd1900077-1abe-4701-a4be-1d6a4fed6764.jpeg',
      'f08b7fb2-a416-45eb-9e5b-e4f72908db9a.jpeg',
      'f5803ace-4ca9-4e26-9480-0bbcc2c1ce03.jpeg',
      'f7e5b68a-eab2-4c27-b99c-4ac33fa8f6dc.jpeg',
      'fbe3da1f-60e4-4417-bf53-c4dcf4461f99.jpeg',
      'ffc2e686-1408-46d7-b744-ae3934819a99.jpeg'
    ]},
    {n:'Supreme Longhua',p:'₦3,700',u:'yard',c:'Fabrics'},
    {n:'Wagambari',p:'₦30,000',u:'5-yard set',d:'Traditional men\'s fabric, supplied as a 5-yard set.',c:'Wagambari'},
    {n:'Excelsior',p:'₦3,800',u:'yard',c:'Fabrics'},
    {n:'Goods Will',p:'₦3,800',u:'yard',c:'Fabrics'},
    {n:'Casacada by Mhood',p:'₦4,500',u:'yard',c:'Fabrics'},
    {n:'Oliva',p:'₦4,000',u:'yard',c:'Fabrics'},
    {n:'Trevita',p:'₦4,000',u:'yard',c:'Fabrics'},
    {n:'Turkish Wool',p:'₦11,500',u:'yard',d:'Wool fabric for refined tailoring.',c:'Fabrics'},
    {n:'Yak Wool',p:'₦13,500',u:'yard',d:'Wool fabric from our premium range.',c:'Fabrics'},
    {n:'VIP Ultimate',p:'₦7,000',u:'yard',d:'A premium selection for distinguished dressing.',c:'Fabrics'}
  ];
  /* Previously supplied HOF wholesale prices; confirm before publishing if any have changed. */
  var caps=[
    {n:'Zeeta',p:'₦6,000',d:'Wholesale price; please confirm current availability.',c:'Men\'s Caps'},
    {n:'Eleganza',p:'₦9,000',d:'Wholesale price; please confirm current availability.',c:'Men\'s Caps'},
    {n:'Dara',p:'₦36,000',d:'Wholesale price; please confirm current availability.',c:'Men\'s Caps'},
    {n:'Zanna',p:'₦18,000',d:'Wholesale price; please confirm current availability.',c:'Men\'s Caps'},
    {n:'Tangaran',p:'₦40,000',d:'Wholesale price; please confirm current availability.',c:'Men\'s Caps'},
    {n:'Kindai Miyamar Borno',p:'₦35,000',d:'Wholesale price; please confirm current availability.',c:'Men\'s Caps'}
  ];
  /* New arrivals: leave empty until you confirm what is new.
     Example: {n:'Oliva',tag:'Just in',p:'₦4,000',u:'yard',c:'Premium Fabrics'} — tag: 'New arrival' | 'Just in' | 'Limited stock' */
  var arrivals=[];
  var pats=['twill','stripe','rib','basket','herring','dot'];
  var registry={},uid=0;
  function makeCard(item){
    var id='p'+(uid++);
    registry[id]=item;
    var pat=pats[uid%pats.length];
    var price=item.p
      ? '<span class="price">'+esc(item.p)+'</span>'+(item.u?'<span class="unit"> / '+esc(item.u)+'</span>':'')
      : '<span class="ask">Price on request</span>';
    var msg=orderMsg(item);
    return '<div class="pc rv" style="--d:'+((uid%8)*35)+'ms">'
      +'<button type="button" class="pc-trigger" data-id="'+id+'" aria-label="View details: '+esc(item.n)+'">'
      +'<span class="sw"><svg aria-hidden="true" focusable="false"><rect width="100%" height="100%" fill="url(#p-'+pat+')"/></svg>'+(item.img&&item.img[0]?'<img src="'+esc(imgSrc(item.img[0]))+'" alt="" loading="lazy" decoding="async">':'')+'</span>'
      +'<span class="pc-body"><span class="pc-name">'+esc(item.n)+'</span>'
      +(item.d?'<span class="pc-desc">'+esc(item.d)+'</span>':'')
      +price
      +'<span class="avail">'+(item.tag?esc(item.tag):'Confirm availability on WhatsApp')+'</span></span>'
      +'</button>'
      +'<a class="order" href="'+wa(msg)+'" target="_blank" rel="noopener noreferrer" aria-label="Order on WhatsApp: '+esc(item.n)+'">Order on WhatsApp</a>'
      +'</div>';
  }
  function fillGrid(id,list){
    var el=document.getElementById(id);
    if(el)el.innerHTML=list.map(makeCard).join('');
  }
  fillGrid('capGrid',caps);
  fillGrid('arrivalGrid',arrivals);
  /* ---- Fabric catalogue: search + category filter ---- */
  /* Only categories with tagged products appear as filters; other categories open WhatsApp from the index. */
  var cats=['All','Fabrics','Wagambari'];
  var chipsEl=document.getElementById('fabricChips');
  if(chipsEl){
    chipsEl.innerHTML=cats.map(function(c,i){
      return '<button type="button" class="chip" data-cat="'+esc(c)+'" aria-pressed="'+(i===0?'true':'false')+'">'+esc(c)+'</button>';
    }).join('');
  }
  var activeCat='All',query='';
  function renderFabrics(){
    var list=fabrics.filter(function(f){
      var matchCat=activeCat==='All'||f.c===activeCat;
      var hay=(f.n+' '+(f.d||'')+' '+f.c).toLowerCase();
      var matchQuery=!query||hay.indexOf(query)>-1;
      return matchCat&&matchQuery;
    });
    var grid=document.getElementById('fabricGrid'),empty=document.getElementById('fabricEmpty');
    if(grid)grid.innerHTML=list.map(makeCard).join('');
    if(empty)empty.hidden=list.length>0;
  }
  renderFabrics();
  if(chipsEl)chipsEl.addEventListener('click',function(e){
    var b=e.target.closest('.chip');
    if(!b)return;
    chipsEl.querySelectorAll('.chip').forEach(function(c){c.setAttribute('aria-pressed','false')});
    b.setAttribute('aria-pressed','true');
    activeCat=b.getAttribute('data-cat');
    renderFabrics();
  });
  var searchInput=document.getElementById('fabricSearch');
  if(searchInput)searchInput.addEventListener('input',function(){
    query=searchInput.value.trim().toLowerCase();
    renderFabrics();
  });
  /* ---- Shop by category (editorial index) ---- */
  var catMaster=[
    {label:'Fabrics',key:'Fabrics',target:'fabrics'},
    {label:'Lace',key:'Lace',target:'fabrics'},
    {label:'Voil',key:'Voil',target:'fabrics'},
    {label:'Atiku',key:'Atiku',target:'fabrics'},
    {label:'Swiss',key:'Swiss',target:'fabrics'},
    {label:'Getzner',key:'Getzner',target:'fabrics'},
    {label:'Shadda',key:'Shadda',target:'fabrics'},
    {label:'Wagambari',key:'Wagambari',target:'fabrics'},
    {label:'Men\'s Caps',key:'Men\'s Caps',target:'caps'}
  ];
  var sbcEl=document.getElementById('sbcIndex');
  if(sbcEl){
    sbcEl.innerHTML=catMaster.map(function(cat){
      var count=cat.target==='caps'?caps.length:fabrics.filter(function(f){return f.c===cat.key}).length;
      var countLabel=count>0?(count+(count===1?' piece':' pieces')):'Ask on WhatsApp';
      return '<button type="button" class="sbc-row" data-key="'+esc(cat.key)+'" data-target="'+cat.target+'">'
        +'<span class="sbc-name">'+esc(cat.label)+'</span>'
        +'<span class="sbc-meta"><span class="sbc-count">'+esc(countLabel)+'</span><span class="sbc-arrow" aria-hidden="true">&rarr;</span></span>'
        +'</button>';
    }).join('');
    sbcEl.addEventListener('click',function(e){
      var row=e.target.closest('.sbc-row');
      if(!row)return;
      var key=row.getAttribute('data-key'),target=row.getAttribute('data-target');
      if(target==='caps'){
        document.getElementById('caps').scrollIntoView({behavior:'smooth',block:'start'});
        return;
      }
      if(!fabrics.some(function(f){return f.c===key})){
        window.open(wa('Hello HOF, I would like to see your '+key+' collection. Please send me available options and prices.'),'_blank','noopener,noreferrer');
        return;
      }
      activeCat=key;
      query='';
      if(searchInput)searchInput.value='';
      renderFabrics();
      if(chipsEl)chipsEl.querySelectorAll('.chip').forEach(function(c){
        c.setAttribute('aria-pressed',c.getAttribute('data-cat')===key?'true':'false');
      });
      document.getElementById('fabrics').scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
  /* ---- Product detail view ---- */
  var backdrop=document.getElementById('modalBackdrop'),lastFocus=null;
  /* ---- Product image gallery (inside the detail view) ---- */
  var gal=null,reduceMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
  var closeBtn='<button type="button" class="modal-close" id="modalClose" aria-label="Close">&times;</button>';
  function imgSrc(f){return f.indexOf('/')>-1?f:IMG_DIR+f}
  function patternSwatch(){
    var pat=pats[Math.floor(Math.random()*pats.length)];
    return '<svg aria-hidden="true" focusable="false"><rect width="100%" height="100%" fill="url(#p-'+pat+')"/></svg>';
  }
  function galSync(){
    if(!gal)return;
    var c=gal.track.children.length,w=gal.track.clientWidth;
    if(!c||!w)return;
    var i=Math.max(0,Math.min(c-1,Math.round(gal.track.scrollLeft/w)));
    gal.i=i;
    if(gal.count)gal.count.textContent=(i+1)+' / '+c;
    [].forEach.call(gal.thumbs.children,function(b,k){
      b.setAttribute('aria-current',k===i?'true':'false');
      if(k===i)gal.thumbs.scrollTo({left:b.offsetLeft-(gal.thumbs.clientWidth-b.offsetWidth)/2,behavior:reduceMotion.matches?'auto':'smooth'});
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
    gal.track.scrollTo({left:n*gal.track.clientWidth,behavior:reduceMotion.matches?'auto':'smooth'});
  }
  function galRefresh(){
    var c=gal.track.children.length,multi=c>1;
    [].forEach.call(gal.thumbs.children,function(b,k){b.setAttribute('data-i',k);b.setAttribute('aria-label','Show photo '+(k+1))});
    gal.thumbs.hidden=!multi;
    [].forEach.call(document.querySelectorAll('#modalSwatch .gal-nav,#modalSwatch .gal-count'),function(el){el.hidden=!multi});
    galSync();
  }
  function buildGallery(item){
    var sw=document.getElementById('modalSwatch'),th=document.getElementById('modalThumbs');
    gal=null;
    if(!sw)return;
    if(th){th.hidden=true;th.innerHTML='';}
    var files=(item.img||[]).filter(Boolean);
    if(!files.length){sw.innerHTML=patternSwatch()+closeBtn;return}
    var slides='',thumbs='';
    files.forEach(function(f,i){
      var src=esc(imgSrc(f)),alt=esc(item.n+' — HOF Home of Fabric, photo '+(i+1));
      slides+='<div class="gal-slide"><img src="'+src+'" alt="'+alt+'" decoding="async" draggable="false"'+(i?' loading="lazy"':'')+'></div>';
      thumbs+='<button type="button" class="thumb" data-i="'+i+'" aria-label="Show photo '+(i+1)+'"><img src="'+src+'" alt="" decoding="async" loading="lazy" draggable="false"></button>';
    });
    sw.innerHTML='<div class="gal" role="group" aria-roledescription="carousel" aria-label="'+esc(item.n)+' photos">'
      +'<div class="gal-track">'+slides+'</div>'
      +'<button type="button" class="gal-nav gal-prev" aria-label="Previous photo">&#8249;</button>'
      +'<button type="button" class="gal-nav gal-next" aria-label="Next photo">&#8250;</button>'
      +'<span class="gal-count" aria-live="polite"></span></div>'+closeBtn;
    if(!th){sw.innerHTML=patternSwatch()+closeBtn;return;}
    th.innerHTML=thumbs;
    gal={track:sw.querySelector('.gal-track'),count:sw.querySelector('.gal-count'),thumbs:th,i:0};
    var ticking=false;
    gal.track.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(function(){ticking=false;galSync()})}},{passive:true});
    /* a photo that fails to load is dropped; if none load, the fabric pattern is shown */
    var pairs=[].map.call(gal.track.children,function(s,k){return {s:s,t:th.children[k]}});
    pairs.forEach(function(p){
      function drop(){
        if(p.gone||!gal)return;
        p.gone=true;p.s.remove();p.t.remove();
        if(!gal.track.children.length){
          gal=null;th.hidden=true;th.innerHTML='';
          sw.innerHTML=patternSwatch()+closeBtn;
          document.getElementById('modalClose').focus();
          return;
        }
        galRefresh();
      }
      p.s.firstChild.addEventListener('error',drop);
      p.t.firstChild.addEventListener('error',drop);
    });
    galRefresh();
  }
  document.addEventListener('click',function(e){
    if(!gal)return;
    var t=e.target.closest('.gal-prev,.gal-next,.thumb');
    if(!t)return;
    if(t.classList.contains('thumb'))galGo(+t.getAttribute('data-i'));
    else galStep(t.classList.contains('gal-next')?1:-1);
  });
  document.addEventListener('keydown',function(e){
    if(!gal||!backdrop.classList.contains('open'))return;
    if(e.key==='ArrowRight'){e.preventDefault();galStep(1)}
    else if(e.key==='ArrowLeft'){e.preventDefault();galStep(-1)}
  });
  function openModal(item){
    if(!item)return;
    lastFocus=document.activeElement;
    document.getElementById('modalTitle').textContent=item.n;
    document.getElementById('modalPrice').innerHTML=item.p
      ? '<span class="price">'+esc(item.p)+'</span>'+(item.u?'<span class="unit">/ '+esc(item.u)+'</span>':'')
      : '<span class="ask">Price on request</span>';
    document.getElementById('modalDesc').textContent=item.d||'Premium selection from HOF — Home of Fabric.';
    document.getElementById('modalAvail').textContent=(item.u?'Unit: '+item.u+'   ·   ':'')+'Availability confirmed on WhatsApp';
    try{buildGallery(item)}catch(err){document.getElementById('modalSwatch').innerHTML=patternSwatch()+closeBtn;var thumbsEl=document.getElementById('modalThumbs');if(thumbsEl)thumbsEl.hidden=true}
    var msg=orderMsg(item);
    document.getElementById('modalOrder').href=wa(msg);
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    document.getElementById('modalClose').focus();
  }
  function closeModal(){
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }
  document.addEventListener('click',function(e){
    var trig=e.target.closest('.pc-trigger');
    if(trig){openModal(registry[trig.getAttribute('data-id')]);return}
    if(e.target===backdrop||e.target.closest('#modalClose'))closeModal();
  });
  document.addEventListener('keydown',function(e){
    if(!backdrop.classList.contains('open'))return;
    if(e.key==='Escape'){closeModal();return}
    if(e.key==='Tab'){
      var focusable=backdrop.querySelectorAll('button,a[href]');
      if(!focusable.length)return;
      var first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
  /* ---- Mobile menu ---- */
  var burger=document.querySelector('.burger'),nav=document.getElementById('menu');
  var mainEl=document.getElementById('main'),footerEl=document.querySelector('.footer');
  function setMenu(open){
    nav.classList.toggle('open',open);
    burger.setAttribute('aria-expanded',open);
    burger.setAttribute('aria-label',open?'Close menu':'Open menu');
    document.body.style.overflow=open?'hidden':'';
    [mainEl,footerEl].forEach(function(el){
      if(!el)return;
      if(open)el.setAttribute('inert','');else el.removeAttribute('inert');
    });
  }
  burger.addEventListener('click',function(){setMenu(!nav.classList.contains('open'))});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
  var desktopMQ=window.matchMedia('(min-width:960px)');
  if(desktopMQ.addEventListener)desktopMQ.addEventListener('change',function(){setMenu(false)});
  else if(desktopMQ.addListener)desktopMQ.addListener(function(){setMenu(false)});
  /* ---- Scroll reveal ---- */
  var items=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    items.forEach(function(el){io.observe(el)});
  }else{items.forEach(function(el){el.classList.add('in')})}
  /* ---- Floating WhatsApp button ---- */
  var fab=document.getElementById('fab'),ticking=false;
  function onScroll(){
    ticking=false;
    if(fab)fab.classList.toggle('show',window.scrollY>window.innerHeight*.8);
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
  onScroll();

  /* ---- Live catalogue: Supabase (admin-managed products) ----
     The original catalogue above remains as a fallback if the database is unavailable. */
  async function loadLiveCatalogue(){
    try{
      if(!window.supabase || !window.HOF_SUPABASE_URL || !window.HOF_SUPABASE_PUBLISHABLE_KEY) return;
      var db=window.supabase.createClient(window.HOF_SUPABASE_URL,window.HOF_SUPABASE_PUBLISHABLE_KEY);
      var result=await db.from('products').select('*').eq('is_available',true).order('created_at',{ascending:false});
      if(result.error) throw result.error;
      var rows=Array.isArray(result.data)?result.data:[];
      if(!rows.length) return;
      function priceText(value){
        if(value===null||value===undefined||value==='') return '';
        if(typeof value==='number'||/^\d+(\.\d+)?$/.test(String(value).trim())){
          return '₦'+Number(value).toLocaleString('en-NG',{maximumFractionDigits:2});
        }
        return String(value);
      }
      var live=rows.map(function(row){
        var category=String(row.category||'Fabrics').trim()||'Fabrics';
        var images=Array.isArray(row.images)?row.images.filter(function(x){return typeof x==='string'&&x.trim()}):[];
        return {n:String(row.name||'HOF Product'),p:priceText(row.price),u:String(row.unit||''),c:category,d:String(row.description||''),img:images,tag:row.is_new_arrival?'New arrival':'',_new:row.is_new_arrival===true};
      });
      function isCap(item){var c=item.c.toLowerCase();return c.indexOf('cap')!==-1||c.indexOf('accessor')!==-1;}
      fabrics=live.filter(function(item){return !isCap(item)});
      caps=live.filter(isCap);
      arrivals=live.filter(function(item){return item._new;});
      /* Rebuild filter chips from the categories actually present in the admin catalogue. */
      var liveCats=[];
      fabrics.forEach(function(item){if(liveCats.indexOf(item.c)===-1)liveCats.push(item.c)});
      cats=['All'].concat(liveCats);
      if(chipsEl){
        chipsEl.innerHTML=cats.map(function(c,i){return '<button type="button" class="chip" data-cat="'+esc(c)+'" aria-pressed="'+(i===0?'true':'false')+'">'+esc(c)+'</button>'}).join('');
      }
      activeCat='All';query='';
      if(searchInput)searchInput.value='';
      fillGrid('capGrid',caps);
      fillGrid('arrivalGrid',arrivals);
      renderFabrics();
      /* Refresh the category index and preserve its existing delegated click handler. */
      var dynamicCats=[
        {label:'Fabrics',key:'Fabrics',target:'fabrics'},
        {label:'Lace',key:'Lace',target:'fabrics'},
        {label:'Voil',key:'Voil',target:'fabrics'},
        {label:'Atiku',key:'Atiku',target:'fabrics'},
        {label:'Swiss',key:'Swiss',target:'fabrics'},
        {label:'Getzner',key:'Getzner',target:'fabrics'},
        {label:'Shadda',key:'Shadda',target:'fabrics'},
        {label:'Wagambari',key:'Wagambari',target:'fabrics'},
        {label:"Men's Caps",key:"Men's Caps",target:'caps'}
      ];
      liveCats.forEach(function(category){
        if(!dynamicCats.some(function(c){return c.key.toLowerCase()===category.toLowerCase()}))
          dynamicCats.push({label:category,key:category,target:'fabrics'});
      });
      if(caps.length&&!dynamicCats.some(function(c){return c.target==='caps'}))
        dynamicCats.push({label:'Caps',key:'Caps',target:'caps'});
      catMaster=dynamicCats;
      if(sbcEl){
        sbcEl.innerHTML=catMaster.map(function(cat){
          var count=cat.target==='caps'?caps.length:fabrics.filter(function(f){return f.c===cat.key}).length;
          var label=count>0?(count+(count===1?' piece':' pieces')):'Ask on WhatsApp';
          return '<button type="button" class="sbc-row" data-key="'+esc(cat.key)+'" data-target="'+cat.target+'"><span class="sbc-name">'+esc(cat.label)+'</span><span class="sbc-meta"><span class="sbc-count">'+esc(label)+'</span><span class="sbc-arrow" aria-hidden="true">&rarr;</span></span></button>';
        }).join('');
      }
    }catch(error){
      console.error('HOF live catalogue could not load. Showing the saved catalogue instead.',error);
    }
  }
  loadLiveCatalogue();
})();