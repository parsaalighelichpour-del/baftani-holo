/* Shared product reviews and ratings for Baftani Holo */
(() => {
  const db = window.supabase?.createClient(
    "https://hqeuajaaxdgbelnbebfg.supabase.co",
    "sb_publishable_C0u8yhHSMUTbiUOzFJjicA_zJ1A0nlW"
  );
  if (!db) { console.error("Supabase reviews connection unavailable"); return; }

  if (window.HeloServer) {
    window.HeloServer.getReviews = async (productId) => {
      const { data, error } = await db.from("product_reviews")
        .select("id,product_id,customer_name,review_text,rating,created_at")
        .eq("product_id", String(productId)).order("created_at", { ascending: false }).limit(300);
      if (error) throw error;
      return data || [];
    };
    window.HeloServer.saveReview = async ({ productId, name, text, rating }) => {
      const row = {
        product_id: String(productId),
        customer_name: String(name || "مهمان").trim().slice(0, 80),
        review_text: text ? String(text).trim().slice(0, 1000) : null,
        rating: rating == null ? null : Number(rating)
      };
      const { data, error } = await db.from("product_reviews").insert(row).select("id").single();
      if (error) { console.error("Review save failed:", error.message); return false; }
      return !!data;
    };
  }

  window.renderComments = async function (id) {
    const box = document.getElementById("commentsList");
    if (!box) return;
    box.innerHTML = '<div class="muted">در حال دریافت نظرها از پایگاه داده…</div>';
    try {
      const reviews = await window.HeloServer.getReviews(id);
      const comments = reviews.filter(r => r.review_text);
      box.innerHTML = comments.length ? comments.map(r =>
        '<div class="comment-box"><div class="comment-name">👤 ' +
        esc(r.customer_name) + '</div><div>' + esc(r.review_text) +
        '</div><div class="muted">' + (r.created_at ? new Date(r.created_at).toLocaleDateString('fa-IR') : '') +
        '</div></div>').join('') :
        '<div class="empty">هنوز نظری ثبت نشده؛ اولین نفر باش! 💙</div>';
    } catch (e) {
      console.error(e);
      box.innerHTML = '<div class="notice">نظرها فعلاً بارگذاری نشدند؛ اتصال را بررسی کن.</div>';
    }
  };

  window.addComment = async function () {
    const p = currentProduct;
    if (!p) return;
    const name = document.getElementById("commentName").value.trim();
    const text = document.getElementById("commentText").value.trim();
    if (!name || !text) { alert("نام و متن نظر را وارد کن."); return; }
    try {
      const ok = await window.HeloServer.saveReview({ productId: p.id, name, text, rating: null });
      if (!ok) throw new Error("ذخیره نظر ناموفق بود");
      document.getElementById("commentName").value = "";
      document.getElementById("commentText").value = "";
      await window.renderComments(p.id);
      alert("نظر در پایگاه داده ثبت شد 💙");
    } catch (e) { console.error(e); alert("ثبت نظر ناموفق بود؛ چند لحظه بعد دوباره تلاش کن."); }
  };

  window.renderRating = async function (id) {
    const box = document.getElementById("ratingBox");
    if (!box) return;
    box.innerHTML = '<div class="muted">در حال محاسبه امتیازها…</div>';
    try {
      const reviews = await window.HeloServer.getReviews(id);
      const ratings = reviews.map(r => Number(r.rating)).filter(n => Number.isFinite(n) && n >= 1 && n <= 5);
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      box.innerHTML = '<strong>⭐ امتیاز محصول: ' + (ratings.length ? avg.toFixed(1) : 'هنوز ثبت نشده') +
        ' از ۵ (' + ratings.length + ' امتیاز)</strong><div>' +
        [1,2,3,4,5].map(n => '<button class="star ' + (n <= Math.round(avg) ? 'selected' : '') +
          '" aria-label="امتیاز ' + n + '" onclick="rateProduct(\'' + String(id) + '\',' + n + ')">★</button>').join('') + '</div>';
    } catch (e) { console.error(e); box.innerHTML = '<div class="notice">امتیازها فعلاً بارگذاری نشدند.</div>'; }
  };

  window.rateProduct = async function (id, n) {
    const user = JSON.parse(localStorage.getItem("heloUser") || "null");
    try {
      const ok = await window.HeloServer.saveReview({ productId: id, name: user?.name || "مهمان", rating: n, text: null });
      if (!ok) throw new Error("ذخیره امتیاز ناموفق بود");
      await window.renderRating(id);
      alert("امتیازت در پایگاه داده ثبت شد ⭐");
    } catch (e) { console.error(e); alert("ثبت امتیاز ناموفق بود؛ دوباره تلاش کن."); }
  };
})();