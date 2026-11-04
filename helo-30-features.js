(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const read = (k,d=[]) => { try { const v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; } catch (_) { return d; } };
  const persist = (k,v) => { const raw=String(v);localStorage.setItem(k,raw);if(window.HeloServer?.saveCustomerPreference){let value=raw;try{value=JSON.parse(raw)}catch(_){}window.HeloServer.saveCustomerPreference(k,value).catch(e=>console.warn('همگام‌سازی قابلیت هلو انجام نشد:',e.message));} };
  const write = (k,v) => persist(k,JSON.stringify(v));
  const clean = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fa = n => Number(n||0).toLocaleString('fa-IR');
  const user = () => read('heloUser',null);
  const list = () => (typeof products!=='undefined'&&Array.isArray(products)?products:[]).filter(p=>p.active!==false);
  const key = 'helo30_';
  let compare = read(key+'compare',[]);
  let recent = read(key+'recent',[]);
  let flashEnd = Number(localStorage.getItem(key+'flashEnd')||0);
  const rewardCodes = () => ({});
  const show = (title,body) => {
    let m=$('helo30ActionModal');
    if(!m){m=document.createElement('div');m.id='helo30ActionModal';m.className='modal';m.innerHTML='<div class="modal-content"><button class="close" onclick="closeModal(\'helo30ActionModal\')">×</button><h2 id="helo30ActionTitle"></h2><div id="helo30ActionBody"></div></div>';document.body.appendChild(m);}
    $('helo30ActionTitle').textContent=title;$('helo30ActionBody').innerHTML=body;m.style.display='block';
  };
  const points = () => window.HeloServer?.customerProfile ? Number(window.HeloServer.customerProfile.points||0) : Number(localStorage.getItem('heloClubPoints_'+(String(user()?.phone||'guest').replace(/\D/g,'').slice(-11)||'guest'))||0);
  const addPoints = n => { if(window.HeloServer?.customerProfile){console.warn('امتیاز فقط از مأموریت‌های امن سرور ثبت می‌شود.');return;} const k='heloClubPoints_'+(String(user()?.phone||'guest').replace(/\D/g,'').slice(-11)||'guest');persist(k,String(points()+n));if(typeof updateClubUI==='function')updateClubUI(); };
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
    ['🎁','هدیه‌های مشخص','دیدن امتیازهای ثابت و مأموریت‌ها','window.helo30Wheel()'],
    ['🪙','امتیاز روزانه','دریافت امتیاز ثابت روزانه','window.helo30Coins()'],
    ['🪙','بازی سکه هلو','مأموریت روزانه کسب امتیاز','window.helo30Coins()'],
    ['🏅','سطح مشتری','مشاهده سطح بر اساس امتیاز باشگاه','window.helo30Level()'],
    ['🎯','چالش هفتگی','انجام چالش و گرفتن امتیاز','window.helo30Weekly()'],
    ['🎂','تولد مشتری','ثبت تاریخ تولد و یادآوری روی همین دستگاه','window.helo30Birthday()'],
    ['🏆','نشان‌های افتخار','دیدن نشان‌های فعالیت فروشگاه','window.helo30Badges()'],
    ['⭐','امتیاز محصولات','ثبت امتیاز از صفحه هر محصول','window.helo30Ratings()'],
    ['💬','نظر مشتریان','دیدن و ثبت نظر در صفحه محصول','window.helo30Reviews()'],
    ['🖼️','گالری محصولات','دیدن تصاویر محصولات فروشگاه','window.helo30Gallery()'],
    ['💡','پیشنهاد هوشمند','پیشنهاد بر اساس علاقه‌مندی‌ها','window.helo30Recommend()'],
    ['🔔','خبر محصول جدید','فعال‌سازی اعلان در این دستگاه','window.helo30NewAlerts()'],
    ['⏳','تایمر تخفیف','دیدن زمان باقی‌مانده جشنواره فعال','window.helo30SaleTimer()'],
    ['📦','موجود شد خبرم کن','ذخیره درخواست برای محصول ناموجود','window.helo30StockAlert()'],
    ['📊','آمار فروش','گزارش سفارش‌های حساب واردشده','window.helo30Stats()'],
    ['👑','باشگاه مشتریان','باز کردن باشگاه امتیاز هلو','window.openHeloWorld()'],
    ['🔥','پرفروش‌ترین‌ها','محصولات پرتکرار در سفارش‌های حساب','window.helo30BestSellers()'],
    ['🧶','سفارش اختصاصی','ثبت درخواست مدل و رنگ دلخواه','window.openCustomOrder()'],
    ['🎀','بسته‌بندی هدیه','انتخاب بسته‌بندی رایگان در سبد خرید','window.helo30GiftWrap()'],
    ['📦','پیگیری سفارش','پیگیری وضعیت سفارش‌های ثبت‌شده','window.openTracking()'],
    ['⚡','حراج فلش','ساخت تایمر نمایشی ۶۰ دقیقه‌ای','window.helo30Flash()'],
    ['💎','VIP هلو','مشاهده وضعیت مشتری ویژه بر اساس امتیاز','window.helo30VIP()']
  ];
  window.openHeloFeatures=()=>{show('✨ امکانات فروشگاه هلو','<p class="helo30-note">۳۰ قابلیت فروشگاه در یک‌جا 🍑</p><div class="helo30-grid">'+features.map((f,i)=>'<button class="helo30-feature" onclick="'+f[3]+'"><span>'+f[0]+'</span><strong>'+fa(i+1)+'. '+f[1]+'</strong><small>'+f[2]+'</small></button>').join('')+'</div><p class="helo30-note">سبد، علاقه‌مندی‌ها، امتیازها، سفارش‌های جدید، نظرها و تنظیمات ذخیره‌شده برای حساب واردشده با پایگاه داده همگام می‌شوند؛ اعلان‌ها و بعضی ابزارهای نمایشی وابسته به همین دستگاه‌اند.</p>');};
  window.helo30Wishlist=()=>{const fav=read('heloFavorites',[]),ps=fav.map(productById).filter(Boolean);show('❤️ علاقه‌مندی‌های من',ps.length?ps.map(p=>card(p,action('مشاهده','openProduct('+JSON.stringify(p.id)+')','btn secondary'))).join(''):'<p>هنوز محصولی ذخیره نکردی. روی قلب محصولات بزن ❤️</p>');};
  window.helo30Compare=()=>{const ps=list();show('⚖️ مقایسه محصولات','<p>حداکثر ۳ محصول انتخاب کن.</p><div class="helo30-picks">'+ps.map(p=>'<label><input type="checkbox" class="helo30-compare-check" value="'+clean(p.id)+'" '+(compare.includes(String(p.id))?'checked':'')+'> '+clean(p.name)+'</label>').join('')+'</div>'+action('مقایسه انتخاب‌ها','window.helo30ShowCompare()'));};
  window.helo30ShowCompare=()=>{compare=[...document.querySelectorAll('.helo30-compare-check:checked')].map(x=>x.value).slice(0,3);write(key+'compare',compare);if(compare.length<2){alert('حداقل دو محصول انتخاب کن.');return;}const ps=compare.map(productById).filter(Boolean);show('نتیجه مقایسه','<div class="helo30-compare-grid">'+ps.map(p=>'<div><strong>'+clean(p.name)+'</strong><p>قیمت: '+price(p)+'</p><p>دسته: '+clean(p.category||'—')+'</p><p>'+clean(p.description||'توضیحی ثبت نشده')+'</p></div>').join('')+'</div>');};
  window.helo30QuickBuy=()=>{const ps=list();show('⚡ خرید سریع','<p>محصول را انتخاب کن تا به سبد خرید اضافه شود.</p>'+ps.map(p=>card(p,action('افزودن','addToCart('+JSON.stringify(p.id)+');closeModal(\'helo30ActionModal\');openCart()'))).join(''));};
  window.helo30SmartCart=()=>{const inCart=read('heloCart',[]).map(x=>String(x.id));const ps=list().filter(p=>!inCart.includes(String(p.id))).slice(0,8);show('🛒 پیشنهاد کنار سبد','<p>شاید این محصولات را هم دوست داشته باشی:</p>'+(ps.length?ps.map(p=>card(p,action('افزودن','addToCart('+JSON.stringify(p.id)+')'))).join(''):'<p>همه محصولات در سبدت هستند!</p>'));};
  window.helo30History=async()=>{try{const os=window.HeloServer?.customerProfile?await window.HeloServer.getMyOrders():orderList();show('🧾 تاریخچه خرید',os.length?os.map(o=>'<div class="helo30-item"><div><strong>'+clean(o.order_code||o.id||'سفارش')+'</strong><small>'+clean(o.created_at||o.date||'')+' · '+fa(o.total)+' تومان</small></div></div>').join(''):'<p>سفارشی برای این حساب پیدا نشد.</p>');}catch(e){show('🧾 تاریخچه خرید','<p>برای مشاهده تاریخچه، وارد حساب مشتری شو.</p>')}};
  window.helo30Coupon=()=>{show('🎟️ کدهای تخفیف فعال','<div class="helo30-prize">HELO10</div><p>۱۰٪ تخفیف با کد ثابت HELO10</p><div class="helo30-prize">HELO20</div><p>۲۰٪ تخفیف با کد ثابت HELO20؛ کدهای ساختگی و غیرقابل‌استفاده نمایش داده نمی‌شوند.</p>');};
  window.helo30Recent=()=>{const ps=recent.map(productById).filter(Boolean);show('👀 اخیراً مشاهده‌شده‌ها',ps.length?ps.map(p=>card(p,action('باز کردن','openProduct('+JSON.stringify(p.id)+')','btn secondary'))).join(''):'<p>هنوز محصولی باز نکردی.</p>');};
  window.helo30Wheel=()=>{show('🎁 هدیه‌های مشخص','<p>هلو جایزه شانسی ندارد؛ امتیازها فقط از مأموریت‌های مشخص و یکسان برای همه دریافت می‌شوند.</p>'+action('مأموریت روزانه','window.helo30Coins()')+' '+action('چالش هفتگی','window.helo30Weekly()','btn secondary'));};
  window.helo30Spin=window.helo30Wheel;
  window.helo30Mystery=window.helo30Wheel;
  window.helo30Coins=()=>{show('🪙 امتیاز روزانه','<p>با ورود به حساب مشتری، روزی ۲ امتیاز ثابت دریافت کن.</p>'+action('دریافت ۲ امتیاز','window.helo30CollectCoins()'));};
  window.helo30CollectCoins=async()=>{try{if(!window.HeloServer?.customerProfile){alert('برای ذخیره امتیاز در همه دستگاه‌ها، اول وارد حساب شو.');return;}const r=await window.HeloServer.claimCustomerMission('daily');if(!r.claimed){alert('امتیاز روزانه را قبلاً دریافت کرده‌ای.');return;}if(typeof updateClubUI==='function')updateClubUI();show('🪙 آفرین!','<p>۲ امتیاز در حساب هلو ذخیره شد.</p>');}catch(e){alert(e.message||'دریافت امتیاز انجام نشد.')}};
  window.helo30Level=()=>{const n=points(),lv=n>=100?'طلایی 🥇':n>=50?'نقره‌ای 🥈':n>=20?'برنزی 🥉':'تازه‌وارد 🍑';show('🏅 سطح مشتری','<div class="helo30-prize">'+lv+'</div><p>امتیاز فعلی: '+fa(n)+'</p><p>امتیاز حساب واردشده در پایگاه داده ذخیره و همگام می‌شود.</p>');};
  window.helo30Weekly=()=>{const p=window.HeloServer?.customerProfile,week=p?.weekly_mission_week,now=new Date(),monday=new Date(now);monday.setDate(now.getDate()-((now.getDay()+6)%7));monday.setHours(0,0,0,0);const done=week&&new Date(week+'T00:00:00')>=monday;show('🎯 چالش هفتگی',done?'<p>۵ امتیاز این هفته را دریافت کرده‌ای.</p>':'<p>چالش هفتگی شفاف: ۵ امتیاز ثابت، هفته‌ای یک‌بار.</p>'+action('دریافت ۵ امتیاز','window.helo30ClaimWeekly()'));};
  window.helo30ClaimWeekly=async()=>{try{if(!window.HeloServer?.customerProfile){alert('برای ثبت امتیاز هفتگی در پایگاه داده، اول وارد حساب شو.');return;}const r=await window.HeloServer.claimCustomerMission('weekly');if(r.claimed){if(typeof updateClubUI==='function')updateClubUI();show('🎯 چالش کامل شد','<p>۵ امتیاز در حساب هلو ذخیره شد!</p>');}else show('🎯 چالش هفتگی','<p>۵ امتیاز این هفته را قبلاً دریافت کرده‌ای.</p>');}catch(e){alert(e.message||'ثبت چالش انجام نشد.')}};
  window.helo30Birthday=()=>{const old=localStorage.getItem(key+'birthday')||'';const d=prompt('تاریخ تولد را وارد کن (مثلاً ۱۳۸۹/۰۵/۱۲):',old);if(d===null)return;persist(key+'birthday',d.trim());alert(window.HeloServer?.customerProfile?'🎂 تاریخ تولد در حساب هلو همگام شد.':'🎂 تاریخ تولد روی همین دستگاه ذخیره شد؛ برای همگام‌سازی وارد حساب شو.');};
  window.helo30Badges=async()=>{const n=points(),orders=window.HeloServer?.customerProfile?await window.HeloServer.getMyOrders():orderList(),favs=read('heloFavorites',[]).length,b=[];if(favs)b.push('❤️ سلیقه‌شناس');if(orders.length)b.push('🛍️ اولین خرید');if(n>=10)b.push('⭐ جمع‌کننده امتیاز');if(n>=50)b.push('🥈 دوست نقره‌ای');if(n>=100)b.push('🥇 طرفدار طلایی');show('🏆 نشان‌های افتخار',b.length?b.map(x=>'<div class="helo30-item"><strong>'+x+'</strong></div>').join(''):'<p>با فعالیت در فروشگاه نشان‌های اولت را بگیر!</p>');};
  window.helo30Ratings=()=>{const ps=list();show('⭐ امتیاز محصولات','<p>برای امتیاز دادن، صفحه محصول را باز کن.</p>'+ps.slice(0,12).map(p=>card(p,action('امتیاز دادن','openProduct('+JSON.stringify(p.id)+')','btn secondary'))).join(''));};
  window.helo30Reviews=()=>{const ps=list();show('💬 نظر مشتریان','<p>نظرها در صفحه هر محصول قرار دارند.</p>'+ps.slice(0,12).map(p=>card(p,action('دیدن نظرها','openProduct('+JSON.stringify(p.id)+')','btn secondary'))).join(''));};
  window.helo30Gallery=()=>{const ps=list().filter(p=>p.images&&p.images.length||p.image).slice(0,12);show('🖼️ گالری محصولات',ps.length?'<div class="helo30-gallery">'+ps.map(p=>'<button onclick="openProduct('+JSON.stringify(p.id)+')"><img src="'+clean((p.images&&p.images[0])||p.image)+'" alt=""><strong>'+clean(p.name)+'</strong></button>').join('')+'</div>':'<p>هنوز تصویری برای گالری محصولات موجود نیست.</p>');};
  window.helo30Recommend=()=>{const fav=read('heloFavorites',[]).map(productById).filter(Boolean),cats=[...new Set(fav.map(p=>p.category))],ps=list().filter(p=>!fav.some(f=>String(f.id)===String(p.id))&&(!cats.length||cats.includes(p.category))).slice(0,8);show('💡 پیشنهاد هلو',ps.length?ps.map(p=>card(p,action('مشاهده','openProduct('+JSON.stringify(p.id)+')','btn secondary'))).join(''):'<p>برای پیشنهاد بهتر، چند محصول را به علاقه‌مندی‌ها اضافه کن.</p>');};
  window.helo30NewAlerts=async()=>{if(!('Notification'in window)){alert('مرورگر این دستگاه اعلان را پشتیبانی نمی‌کند.');return;}if(Notification.permission==='granted'){persist(key+'newAlerts','1');new Notification('بافتنی هلو',{body:'یادآوری محصولات جدید در این مرورگر فعال شد.'});return;}const p=await Notification.requestPermission();if(p==='granted'){persist(key+'newAlerts','1');new Notification('بافتنی هلو',{body:'اعلان آزمایشی فعال شد.'});}else alert('اجازه اعلان داده نشد.');};
  window.helo30SaleTimer=()=>{const end=Date.parse('2026-11-13T17:32:00+03:30'),left=end-Date.now();show('⏳ تایمر جشنواره',left>0?'<div class="helo30-prize">'+Math.floor(left/86400000)+' روز</div><p>تا پایان زمان اعلام‌شده جشنواره هالووین باقی مانده است.</p>':'<p>زمان اعلام‌شده جشنواره هالووین به پایان رسیده است.</p>');};
  window.helo30StockAlert=()=>{const ps=list().filter(p=>p.stock_enabled&&Number(p.stock)<=0);show('📦 موجود شد خبرم کن',ps.length?ps.map(p=>card(p,action('ثبت درخواست','window.helo30RequestStock('+JSON.stringify(p.id)+')','btn secondary'))).join(''):'<p>در حال حاضر محصول ناموجودی ثبت نشده.</p>');};
  window.helo30RequestStock=id=>{const p=productById(id),u=user();if(!u){alert('برای ثبت درخواست، ابتدا وارد حساب شو.');return;}const a=read(key+'stockRequests',[]);if(!a.some(x=>String(x.id)===String(id)&&x.phone===u.phone)){a.push({id,phone:u.phone,date:Date.now()});write(key+'stockRequests',a);}alert(window.HeloServer?.customerProfile?'درخواست در حساب هلو ذخیره و همگام شد؛ اعلان خودکار هنگام شارژ هنوز فعال نیست.':'درخواست روی همین دستگاه ذخیره شد؛ برای همگام‌سازی وارد حساب شو. اعلان خودکار هنگام شارژ هنوز فعال نیست.');};
  window.helo30Stats=async()=>{try{const os=window.HeloServer?.customerProfile?await window.HeloServer.getMyOrders():orderList(),sum=os.reduce((a,o)=>a+Number(o.total||0),0);show('📊 آمار سفارش‌های حساب','<div class="helo30-compare-grid"><div><strong>'+fa(os.length)+'</strong><p>تعداد سفارش</p></div><div><strong>'+fa(sum)+' تومان</strong><p>مجموع مبلغ سفارش‌ها</p></div></div>');}catch(e){show('📊 آمار سفارش‌ها','<p>برای دیدن آمار، وارد حساب مشتری شو.</p>')}};
  window.helo30BestSellers=async()=>{try{const os=window.HeloServer?.customerProfile?await window.HeloServer.getMyOrders():orderList(),counts={};os.forEach(o=>(o.items||[]).forEach(i=>{counts[i.id]=(counts[i.id]||0)+Number(i.qty||1);}));const ps=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([id,n])=>({p:productById(id),n})).filter(x=>x.p);show('🔥 پرفروش‌های سفارش‌های تو',ps.length?ps.map(x=>card(x.p,'<strong>'+fa(x.n)+' عدد</strong>')).join(''):'<p>هنوز سفارش تکمیل‌شده‌ای برای نمایش وجود ندارد.</p>');}catch(e){show('🔥 پرفروش‌ها','<p>برای مشاهده، وارد حساب مشتری شو.</p>')}};
  window.helo30GiftWrap=()=>{closeModal('helo30ActionModal');if(typeof openCart==='function')openCart();const c=$('heloGiftWrap');if(c)c.checked=true;};
  window.helo30Raffle=()=>{if(typeof window.openTracking==='function')window.openTracking();};
  window.helo30Flash=()=>{if(flashEnd<Date.now()){flashEnd=Date.now()+60*60*1000;persist(key+'flashEnd',String(flashEnd));}const mins=Math.max(0,Math.ceil((flashEnd-Date.now())/60000));show('⚡ حراج فلش','<div class="helo30-prize">'+fa(mins)+' دقیقه</div><p>تایمر نمایشی ۶۰ دقیقه‌ای؛ قیمت محصولات تا زمان تعریف تخفیف از سوی مدیر تغییر نمی‌کند.</p>');};
  window.helo30VIP=()=>{const n=points(),vip=n>=100;show('💎 VIP هلو',vip?'<div class="helo30-prize">عضو VIP هستی! 👑</div><p>امتیاز: '+fa(n)+'</p>':'<div class="helo30-prize">'+fa(n)+' / ۱۰۰</div><p>برای رسیدن به سطح VIP امتیاز بیشتری جمع کن.</p>');};
  const originalApply=window.applyDiscount;
  if(typeof originalApply==='function')window.applyDiscount=function(){const field=$('discountCode'),code=field?.value.trim().toUpperCase(),c=rewardCodes()[code];if(c&&c.expires>Date.now()){appliedDiscount=c.discount;appliedCode=code;alert('🎉 کد جایزه '+c.discount+'٪ اعمال شد!');if(typeof renderCart==='function')renderCart();return;}return originalApply.apply(this,arguments);};
  const originalOpen=window.openProduct;
  if(typeof originalOpen==='function')window.openProduct=function(id){recent=[String(id),...recent.filter(x=>String(x)!==String(id))].slice(0,12);write(key+'recent',recent);return originalOpen.apply(this,arguments);};
  document.addEventListener('DOMContentLoaded',()=>{addNav();});
  addNav();
})();