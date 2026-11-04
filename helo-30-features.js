(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const read = (k,d=[]) => { try { const v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; } catch (_) { return d; } };
  const write = (k,v) => localStorage.setItem(k,JSON.stringify(v));
  const clean = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fa = n => Number(n||0).toLocaleString('fa-IR');
  const user = () => read('heloUser',null);
  const list = () => (typeof products!=='undefined'&&Array.isArray(products)?products:[]).filter(p=>p.active!==false);
  const key = 'helo30_';
  let compare = read(key+'compare',[]);
  let recent = read(key+'recent',[]);
  let flashEnd = Number(localStorage.getItem(key+'flashEnd')||0);
  const rewardCodes = () => read(key+'coupons',{});
  const saveCoupon = (code,discount) => { const c=rewardCodes(); c[code]={discount,expires:Date.now()+7*86400000}; write(key+'coupons',c); };
  const show = (title,body) => {
    let m=$('helo30ActionModal');
    if(!m){m=document.createElement('div');m.id='helo30ActionModal';m.className='modal';m.innerHTML='<div class="modal-content"><button class="close" onclick="closeModal(\'helo30ActionModal\')">×</button><h2 id="helo30ActionTitle"></h2><div id="helo30ActionBody"></div></div>';document.body.appendChild(m);}
    $('helo30ActionTitle').textContent=title;$('helo30ActionBody').innerHTML=body;m.style.display='block';
  };
  const points = () => Number(localStorage.getItem('heloClubPoints_'+(String(user()?.phone||'guest').replace(/\D/g,'').slice(-11)||'guest'))||0);
  const addPoints = n => { const k='heloClubPoints_'+(String(user()?.phone||'guest').replace(/\D/g,'').slice(-11)||'guest');localStorage.setItem(k,String(points()+n)); if(typeof updateClubUI==='function')updateClubUI(); };
  const productById = id => list().find(p=>String(p.id)===String(id));
  const price = p => fa(p.price)+' تومان';
  const orderList = () => read('heloOrdersLocal',[]);
  const card = (p,extra='') => '<div class="helo30-item"><div><strong>'+clean(p.name)+'</strong><small>'+price(p)+'</small></div>'+extra+'</div>';
  const action = (label,fn,cls='btn') => '<button type="button" class="'+cls+'" onclick="'+fn+'">'+label+'</button>';
  const addNav = () => {
    const nav=document.querySelector('.nav'); if(!nav||$('helo30NavButton'))return;
    const b=document.createElement('button');b.id='helo30NavButton';b.type='button';b.className='nav-btn';b.textContent='✨ امکانات هلو';b.onclick=()=>window.openHeloFeatures();nav.appendChild(b);
  };
  const features = [
    ['❤️','لیست علاقه‌مندی‌ها','ذخیره و دیدن محصولات قلب‌خورده','window.helo30Wishlist()'],
    ['⚖️','مقایسه محصولات','مقایسه قیمت و مشخصات تا ۳ محصول','window.helo30Compare()'],
    ['⚡','خرید سریع','افزودن سریع محصول به سبد خرید','window.helo30QuickBuy()'],
    ['🛒','سبد خرید هوشمند','پیشنهاد محصولات مکمل در کنار خرید','window.helo30SmartCart()'],
    ['🧾','تاریخچه خرید','دیدن سفارش‌های ثبت‌شده روی همین دستگاه','window.helo30History()'],
    ['🎟️','کد تخفیف اختصاصی','ساخت کد جایزه مخصوص همین مرورگر','window.helo30Coupon()'],
    ['🎁','پک هدیه','ساخت پک از چند محصول','window.openGiftPack()'],
    ['👀','اخیراً مشاهده‌شده‌ها','برگشت به محصولاتی که دیدی','window.helo30Recent()'],
    ['🎡','گردونه شانس','شانس دریافت کد جایزه محلی','window.helo30Wheel()'],
    ['🎁','جعبه شانس','باز کردن جایزه روزانه','window.helo30Mystery()'],
    ['🪙','بازی سکه هلو','مأموریت روزانه کسب امتیاز','window.helo30Coins()'],
    ['🏅','سطح مشتری','مشاهده سطح بر اساس امتیاز باشگاه','window.helo30Level()'],
    ['🎯','چالش هفتگی','انجام چالش و گرفتن امتیاز','window.helo30Weekly()'],
    ['🎂','تولد مشتری','ثبت تاریخ تولد و یادآوری روی همین دستگاه','window.helo30Birthday()'],
    ['🏆','نشان‌های افتخار','دیدن نشان‌های فعالیت فروشگاه','window.helo30Badges()'],
    ['⭐','امتیاز محصولات','ثبت امتیاز از صفحه هر محصول','window.helo30Ratings()'],
    ['💬','نظر مشتریان','دیدن و ثبت نظر در صفحه محصول','window.helo30Reviews()'],
    ['🖼️','گالری محصولات','دیدن تصاویر محصولات فروشگاه','window.helo30Gallery()'],
    ['💡','پیشنهاد هوشمند','پیشنهاد بر اساس علاقه‌مندی‌ها','window.helo30Recommend()'],
    ['🔔','خبر محصول جدید','فعال‌سازی یادآوری در همین مرورگر','window.helo30NewAlerts()'],
    ['⏳','تایمر تخفیف','دیدن زمان باقی‌مانده جشنواره فعال','window.helo30SaleTimer()'],
    ['📦','موجود شد خبرم کن','ثبت درخواست محلی برای محصول ناموجود','window.helo30StockAlert()'],
    ['📊','آمار فروش','گزارش سفارش‌های ذخیره‌شده روی همین دستگاه','window.helo30Stats()'],
    ['👑','باشگاه مشتریان','باز کردن باشگاه امتیاز هلو','window.openHeloWorld()'],
    ['🔥','پرفروش‌ترین‌ها','محصولات پرتکرار در سفارش‌های محلی','window.helo30BestSellers()'],
    ['🧶','سفارش اختصاصی','ثبت درخواست مدل و رنگ دلخواه','window.openCustomOrder()'],
    ['🎀','بسته‌بندی هدیه','انتخاب بسته‌بندی رایگان در سبد خرید','window.helo30GiftWrap()'],
    ['🎟️','قرعه‌کشی مشتریان','ثبت نام در قرعه‌کشی آزمایشی محلی','window.helo30Raffle()'],
    ['⚡','حراج فلش','ساخت تایمر نمایشی ۶۰ دقیقه‌ای','window.helo30Flash()'],
    ['💎','VIP هلو','مشاهده وضعیت مشتری ویژه بر اساس امتیاز','window.helo30VIP()']
  ];
  window.openHeloFeatures=()=>{show('✨ امکانات فروشگاه هلو','<p class="helo30-note">۳۰ قابلیت فروشگاه در یک‌جا 🍑</p><div class="helo30-grid">'+features.map((f,i)=>'<button class="helo30-feature" onclick="'+f[3]+'"><span>'+f[0]+'</span><strong>'+fa(i+1)+'. '+f[1]+'</strong><small>'+f[2]+'</small></button>').join('')+'</div><p class="helo30-note">بعضی موارد در این نسخه روی همین مرورگر ذخیره می‌شوند و هنوز اعلان یا همگام‌سازی چنددستگاهی ندارند.</p>');};
  window.helo30Wishlist=()=>{const fav=read('heloFavorites',[]),ps=fav.map(productById).filter(Boolean);show('❤️ علاقه‌مندی‌های من',ps.length?ps.map(p=>card(p,action('مشاهده','openProduct('+JSON.stringify(p.id)+')','btn secondary'))).join(''):'<p>هنوز محصولی ذخیره نکردی. روی قلب محصولات بزن ❤️</p>');};
  window.helo30Compare=()=>{const ps=list();show('⚖️ مقایسه محصولات','<p>حداکثر ۳ محصول انتخاب کن.</p><div class="helo30-picks">'+ps.map(p=>'<label><input type="checkbox" class="helo30-compare-check" value="'+clean(p.id)+'" '+(compare.includes(String(p.id))?'checked':'')+'> '+clean(p.name)+'</label>').join('')+'</div>'+action('مقایسه انتخاب‌ها','window.helo30ShowCompare()'));};
  window.helo30ShowCompare=()=>{compare=[...document.querySelectorAll('.helo30-compare-check:checked')].map(x=>x.value).slice(0,3);write(key+'compare',compare);if(compare.length<2){alert('حداقل دو محصول انتخاب کن.');return;}const ps=compare.map(productById).filter(Boolean);show('نتیجه مقایسه','<div class="helo30-compare-grid">'+ps.map(p=>'<div><strong>'+clean(p.name)+'</strong><p>قیمت: '+price(p)+'</p><p>دسته: '+clean(p.category||'—')+'</p><p>'+clean(p.description||'توضیحی ثبت نشده')+'</p></div>').join('')+'</div>');};
  window.helo30QuickBuy=()=>{const ps=list();show('⚡ خرید سریع','<p>محصول را انتخاب کن تا به سبد خرید اضافه شود.</p>'+ps.map(p=>card(p,action('افزودن','addToCart('+JSON.stringify(p.id)+');closeModal(\'helo30ActionModal\');openCart()'))).join(''));};
  window.helo30SmartCart=()=>{const inCart=read('heloCart',[]).map(x=>String(x.id));const ps=list().filter(p=>!inCart.includes(String(p.id))).slice(0,8);show('🛒 پیشنهاد کنار سبد','<p>شاید این محصولات را هم دوست داشته باشی:</p>'+(ps.length?ps.map(p=>card(p,action('افزودن','addToCart('+JSON.stringify(p.id)+')'))).join(''):'<p>همه محصولات در سبدت هستند!</p>'));};
  window.helo30History=()=>{const os=orderList();show('🧾 تاریخچه خرید',os.length?os.map(o=>'<div class="helo30-item"><div><strong>'+clean(o.order_code||o.id||'سفارش')+'</strong><small>'+clean(o.date||'')+' · '+fa(o.total)+' تومان</small></div></div>').join(''):'<p>سفارشی در تاریخچه این دستگاه پیدا نشد.</p>');};
  window.helo30Coupon=()=>{const code='HELO'+Math.random().toString(36).slice(2,7).toUpperCase();saveCoupon(code,10);show('🎟️ کد اختصاصی تو','<div class="helo30-prize">'+code+'</div><p>کد ۱۰٪ تخفیف؛ تا ۷ روز در همین مرورگر معتبر است.</p><p>کد را در سبد خرید وارد کن.</p>');};
  window.helo30Recent=()=>{const ps=recent.map(productById).filter(Boolean);show('👀 اخیراً مشاهده‌شده‌ها',ps.length?ps.map(p=>card(p,action('باز کردن','openProduct('+JSON.stringify(p.id)+')','btn secondary'))).join(''):'<p>هنوز محصولی باز نکردی.</p>');};
  const grantPrize=(discount=10)=>{const code='HELO'+Math.random().toString(36).slice(2,7).toUpperCase();saveCoupon(code,discount);return code;};
  window.helo30Wheel=()=>{const done=localStorage.getItem(key+'wheelDay')===new Date().toISOString().slice(0,10);show('🎡 گردونه شانس',done?'<p>امروز شانست را امتحان کردی؛ فردا دوباره بیا!</p>':action('چرخاندن گردونه 🎡','window.helo30Spin()'));};
  window.helo30Spin=()=>{if(localStorage.getItem(key+'wheelDay')===new Date().toISOString().slice(0,10)){alert('امروز یک‌بار چرخاندی.');return;}localStorage.setItem(key+'wheelDay',new Date().toISOString().slice(0,10));const n=[5,10,15][Math.floor(Math.random()*3)],code=grantPrize(n);show('🎉 جایزه گردونه','<div class="helo30-prize">'+n+'٪ تخفیف</div><p>کد جایزه: <strong>'+code+'</strong></p><p>تا ۷ روز در همین مرورگر معتبر است.</p>');};
  window.helo30Mystery=()=>{const today=new Date().toISOString().slice(0,10);if(localStorage.getItem(key+'boxDay')===today){show('🎁 جعبه شانس','<p>جعبه امروز را باز کردی؛ فردا دوباره سر بزن!</p>');return;}localStorage.setItem(key+'boxDay',today);const n=Math.random()<.5?3:5;addPoints(n);show('🎁 جایزه جعبه شانس','<div class="helo30-prize">'+fa(n)+' امتیاز</div><p>به امتیازهای باشگاهت اضافه شد.</p>');};
  window.helo30Coins=()=>{const today=new Date().toISOString().slice(0,10),done=localStorage.getItem(key+'coinDay')===today;show('🪙 بازی سکه هلو',done?'<p>امروز سکه‌ات را گرفتی. فردا برگرد!</p>':action('جمع‌آوری ۳ سکه 🍑','window.helo30CollectCoins()'));};
  window.helo30CollectCoins=()=>{const today=new Date().toISOString().slice(0,10);if(localStorage.getItem(key+'coinDay')===today)return;localStorage.setItem(key+'coinDay',today);addPoints(3);show('🪙 آفرین!','<p>۳ امتیاز به باشگاه هلو اضافه شد.</p>');};
  window.helo30Level=()=>{const n=points(),lv=n>=100?'طلایی 🥇':n>=50?'نقره‌ای 🥈':n>=20?'برنزی 🥉':'تازه‌وارد 🍑';show('🏅 سطح مشتری','<div class="helo30-prize">'+lv+'</div><p>امتیاز فعلی: '+fa(n)+'</p><p>امتیازها در همین مرورگر نگهداری می‌شوند.</p>');};
  window.helo30Weekly=()=>{const w=new Date(),week=Math.floor((Date.UTC(w.getFullYear(),w.getMonth(),w.getDate())-Date.UTC(w.getFullYear(),0,1))/604800000),k=key+'weekly_'+w.getFullYear()+'_'+week;show('🎯 چالش هفتگی',localStorage.getItem(k)?'<p>چالش این هفته انجام شده!</p>':'<p>این هفته ۳ محصول را ببین و ۵ امتیاز جایزه بگیر.</p>'+action('ثبت انجام چالش','window.helo30ClaimWeekly()'));};
  window.helo30ClaimWeekly=()=>{const w=new Date(),week=Math.floor((Date.UTC(w.getFullYear(),w.getMonth(),w.getDate())-Date.UTC(w.getFullYear(),0,1))/604800000),k=key+'weekly_'+w.getFullYear()+'_'+week;if(localStorage.getItem(k))return;localStorage.setItem(k,'1');addPoints(5);show('🎯 چالش کامل شد','<p>۵ امتیاز دریافت کردی!</p>');};
  window.helo30Birthday=()=>{const old=localStorage.getItem(key+'birthday')||'';const d=prompt('تاریخ تولد را وارد کن (مثلاً ۱۳۸۹/۰۵/۱۲):',old);if(d===null)return;localStorage.setItem(key+'birthday',d.trim());alert('🎂 تاریخ تولد روی همین دستگاه ذخیره شد.');};
  window.helo30Badges=()=>{const n=points(),orders=orderList().length,favs=read('heloFavorites',[]).length,b=[];if(favs)b.push('❤️ سلیقه‌شناس');if(orders)b.push('🛍️ اولین خرید');if(n>=10)b.push('⭐ جمع‌کننده امتیاز');if(n>=50)b.push('🥈 دوست نقره‌ای');if(n>=100)b.push('🥇 طرفدار طلایی');show('🏆 نشان‌های افتخار',b.length?b.map(x=>'<div class="helo30-item"><strong>'+x+'</strong></div>').join(''):'<p>با فعالیت در فروشگاه نشان‌های اولت را بگیر!</p>');};
  window.helo30Ratings=()=>{const ps=list();show('⭐ امتیاز محصولات','<p>برای امتیاز دادن، صفحه محصول را باز کن.</p>'+ps.slice(0,12).map(p=>card(p,action('امتیاز دادن','openProduct('+JSON.stringify(p.id)+')','btn secondary'))).join(''));};
  window.helo30Reviews=()=>{const ps=list();show('💬 نظر مشتریان','<p>نظرها در صفحه هر محصول قرار دارند.</p>'+ps.slice(0,12).map(p=>card(p,action('دیدن نظرها','openProduct('+JSON.stringify(p.id)+')','btn secondary'))).join(''));};
  window.helo30Gallery=()=>{const ps=list().filter(p=>p.images&&p.images.length||p.image).slice(0,12);show('🖼️ گالری محصولات',ps.length?'<div class="helo30-gallery">'+ps.map(p=>'<button onclick="openProduct('+JSON.stringify(p.id)+')"><img src="'+clean((p.images&&p.images[0])||p.image)+'" alt=""><strong>'+clean(p.name)+'</strong></button>').join('')+'</div>':'<p>هنوز تصویری برای گالری محصولات موجود نیست.</p>');};
  window.helo30Recommend=()=>{const fav=read('heloFavorites',[]).map(productById).filter(Boolean),cats=[...new Set(fav.map(p=>p.category))],ps=list().filter(p=>!fav.some(f=>String(f.id)===String(p.id))&&(!cats.length||cats.includes(p.category))).slice(0,8);show('💡 پیشنهاد هلو',ps.length?ps.map(p=>card(p,action('مشاهده','openProduct('+JSON.stringify(p.id)+')','btn secondary'))).join(''):'<p>برای پیشنهاد بهتر، چند محصول را به علاقه‌مندی‌ها اضافه کن.</p>');};
  window.helo30NewAlerts=async()=>{if(!('Notification'in window)){alert('مرورگر این دستگاه اعلان را پشتیبانی نمی‌کند.');return;}if(Notification.permission==='granted'){localStorage.setItem(key+'newAlerts','1');new Notification('بافتنی هلو',{body:'یادآوری محصولات جدید در این مرورگر فعال شد.'});return;}const p=await Notification.requestPermission();if(p==='granted'){localStorage.setItem(key+'newAlerts','1');new Notification('بافتنی هلو',{body:'اعلان آزمایشی فعال شد.'});}else alert('اجازه اعلان داده نشد.');};
  window.helo30SaleTimer=()=>{const end=Date.parse('2026-11-13T17:32:00+03:30'),left=end-Date.now();show('⏳ تایمر جشنواره',left>0?'<div class="helo30-prize">'+Math.floor(left/86400000)+' روز</div><p>تا پایان زمان اعلام‌شده جشنواره هالووین باقی مانده است.</p>':'<p>زمان اعلام‌شده جشنواره هالووین به پایان رسیده است.</p>');};
  window.helo30StockAlert=()=>{const ps=list().filter(p=>p.stock_enabled&&Number(p.stock)<=0);show('📦 موجود شد خبرم کن',ps.length?ps.map(p=>card(p,action('ثبت درخواست','window.helo30RequestStock('+JSON.stringify(p.id)+')','btn secondary'))).join(''):'<p>در حال حاضر محصول ناموجودی ثبت نشده.</p>');};
  window.helo30RequestStock=id=>{const p=productById(id),u=user();if(!u){alert('برای ثبت درخواست، ابتدا وارد حساب شو.');return;}const a=read(key+'stockRequests',[]);if(!a.some(x=>String(x.id)===String(id)&&x.phone===u.phone)){a.push({id,phone:u.phone,date:Date.now()});write(key+'stockRequests',a);}alert('درخواست روی همین دستگاه ثبت شد؛ هنوز اعلان خودکار هنگام شارژ فعال نیست.');};
  window.helo30Stats=()=>{const os=orderList(),sum=os.reduce((a,o)=>a+Number(o.total||0),0);show('📊 آمار سفارش‌های این دستگاه','<div class="helo30-compare-grid"><div><strong>'+fa(os.length)+'</strong><p>تعداد سفارش</p></div><div><strong>'+fa(sum)+' تومان</strong><p>مجموع مبلغ ثبت‌شده</p></div></div>');};
  window.helo30BestSellers=()=>{const counts={};orderList().forEach(o=>(o.items||[]).forEach(i=>{counts[i.id]=(counts[i.id]||0)+Number(i.qty||1);}));const ps=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([id,n])=>({p:productById(id),n})).filter(x=>x.p);show('🔥 پرفروش‌های ثبت‌شده',ps.length?ps.map(x=>card(x.p,'<strong>'+fa(x.n)+' عدد</strong>')).join(''):'<p>هنوز سفارش ثبت‌شده‌ای برای محاسبه فروش وجود ندارد.</p>');};
  window.helo30GiftWrap=()=>{closeModal('helo30ActionModal');if(typeof openCart==='function')openCart();const c=$('heloGiftWrap');if(c)c.checked=true;};
  window.helo30Raffle=()=>{const u=user();if(!u){alert('برای شرکت در قرعه‌کشی اول وارد حساب شو.');return;}const a=read(key+'raffle',[]);if(a.some(x=>x.phone===u.phone)){show('🎟️ قرعه‌کشی','<p>قبلاً با این حساب در قرعه‌کشی آزمایشی ثبت‌نام کردی.</p>');return;}a.push({phone:u.phone,name:u.name,date:Date.now()});write(key+'raffle',a);show('🎟️ ثبت‌نام قرعه‌کشی','<p>نامت در فهرست محلی این دستگاه ثبت شد. این قرعه‌کشی هنوز عمومی یا متصل به سرور نیست.</p>');};
  window.helo30Flash=()=>{if(flashEnd<Date.now()){flashEnd=Date.now()+60*60*1000;localStorage.setItem(key+'flashEnd',String(flashEnd));}const mins=Math.max(0,Math.ceil((flashEnd-Date.now())/60000));show('⚡ حراج فلش','<div class="helo30-prize">'+fa(mins)+' دقیقه</div><p>تایمر نمایشی ۶۰ دقیقه‌ای؛ قیمت محصولات تا زمان تعریف تخفیف از سوی مدیر تغییر نمی‌کند.</p>');};
  window.helo30VIP=()=>{const n=points(),vip=n>=100;show('💎 VIP هلو',vip?'<div class="helo30-prize">عضو VIP هستی! 👑</div><p>امتیاز: '+fa(n)+'</p>':'<div class="helo30-prize">'+fa(n)+' / ۱۰۰</div><p>برای رسیدن به سطح VIP امتیاز بیشتری جمع کن.</p>');};
  const originalApply=window.applyDiscount;
  if(typeof originalApply==='function')window.applyDiscount=function(){const field=$('discountCode'),code=field?.value.trim().toUpperCase(),c=rewardCodes()[code];if(c&&c.expires>Date.now()){appliedDiscount=c.discount;appliedCode=code;alert('🎉 کد جایزه '+c.discount+'٪ اعمال شد!');if(typeof renderCart==='function')renderCart();return;}return originalApply.apply(this,arguments);};
  const originalOpen=window.openProduct;
  if(typeof originalOpen==='function')window.openProduct=function(id){recent=[String(id),...recent.filter(x=>String(x)!==String(id))].slice(0,12);write(key+'recent',recent);return originalOpen.apply(this,arguments);};
  document.addEventListener('DOMContentLoaded',()=>{addNav();});
  addNav();
})();