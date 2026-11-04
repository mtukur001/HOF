(function(){
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
const url=window.HOF_SUPABASE_URL,key=window.HOF_SUPABASE_PUBLISHABLE_KEY;
const all=document.getElementById('product-grid'),fresh=document.getElementById('new-arrivals-grid');
function msg(el,t){if(el)el.innerHTML='<p class="status">'+t+'</p>'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function render(el,items){if(!el)return;if(!items.length){msg(el,'No products available yet. Please check back soon.');return}
el.innerHTML=items.map(p=>{let src=Array.isArray(p.images)?p.images[0]:p.image;return '<article class="product-card">'+(src?'<img loading="lazy" src="'+esc(src)+'" alt="'+esc(p.name)+'">':'')+'<div class="product-info"><h3>'+esc(p.name)+'</h3><p>₦'+Number(p.price||0).toLocaleString('en-NG')+' / '+esc(p.unit||'yard')+'</p><a href="https://wa.me/2348087674813?text='+encodeURIComponent('Hello HOF, I am interested in '+p.name)+'">Enquire on WhatsApp</a></div></article>'}).join('')}
if(!url||!key||url.includes('PASTE_')||key.includes('PASTE_')){msg(all,'Catalogue connection will be activated during setup.');msg(fresh,'New arrivals will appear after setup.');return}
if(!window.supabase){msg(all,'Catalogue connection could not load.');return}
const db=window.supabase.createClient(url,key);
db.from('products').select('*').eq('is_available',true).order('created_at',{ascending:false}).then(({data,error})=>{if(error)throw error;render(all,data||[]);render(fresh,(data||[]).filter(p=>p.is_new_arrival===true))}).catch(e=>{console.error(e);msg(all,'Please contact HOF on WhatsApp for our current collection.');msg(fresh,'New arrivals are temporarily unavailable.')});
})();