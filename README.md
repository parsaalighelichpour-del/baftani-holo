<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فروشگاه بافتنی هلو 🍑</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Tahoma, Arial, sans-serif;
      background: #fff7f1;
      color: #333;
    }

    header {
      background: linear-gradient(135deg, #ff9a9e, #fad0c4);
      padding: 35px 20px;
      text-align: center;
      color: white;
    }

    header h1 {
      margin: 0;
      font-size: 32px;
    }

    header p {
      font-size: 17px;
      margin-top: 12px;
    }

    .container {
      max-width: 1100px;
      margin: auto;
      padding: 25px 15px;
    }

    .title {
      text-align: center;
      margin-bottom: 25px;
      color: #d85c70;
    }

    .products {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 18px;
    }

    .product {
      background: white;
      border-radius: 18px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 5px 18px rgba(0,0,0,0.08);
      transition: 0.2s;
    }

    .product:hover {
      transform: translateY(-4px);
    }

    .emoji {
      font-size: 55px;
      margin-bottom: 10px;
    }

    .product h3 {
      margin: 8px 0;
      color: #555;
    }

    .price {
      color: #e85d75;
      font-weight: bold;
      font-size: 18px;
      margin: 12px 0;
    }

    button {
      border: none;
      background: #e85d75;
      color: white;
      padding: 11px 20px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 15px;
    }

    button:hover {
      background: #d94761;
    }

    #cart {
      background: white;
      margin-top: 35px;
      padding: 22px;
      border-radius: 18px;
      box-shadow: 0 5px 18px rgba(0,0,0,0.08);
    }

    #cart h2 {
      color: #d85c70;
      margin-top: 0;
    }

    #cartItems {
      line-height: 2;
    }

    .order {
      margin-top: 20px;
      text-align: center;
    }

    .order input,
    .order textarea {
      width: 100%;
      padding: 12px;
      margin: 7px 0;
      border: 1px solid #ddd;
      border-radius: 10px;
      font-family: inherit;
    }

    .order textarea {
      height: 90px;
      resize: vertical;
    }

    footer {
      margin-top: 40px;
      background: #333;
      color: white;
      text-align: center;
      padding: 22px;
    }

    .empty {
      color: #888;
    }
  </style>
</head>

<body>

<header>
  <h1>🍑 فروشگاه بافتنی هلو 🍑</h1>
  <p>آموزش اختصاصی بافتنی و محصولات دست‌ساز با عشق ❤️</p>
</header>

<div class="container">

  <h2 class="title">🧶 محصولات ما</h2>

  <div class="products">

    <div class="product">
      <div class="emoji">🥭</div>
      <h3>جاکلیدی انبه</h3>
      <div class="price">۶۰٬۰۰۰ تومان</div>
      <button onclick="addToCart('جاکلیدی انبه', 60000)">افزودن به سبد</button>
    </div>

    <div class="product">
      <div class="emoji">🍊</div>
      <h3>جاکلیدی نارنگی</h3>
      <div class="price">۶۰٬۰۰۰ تومان</div>
      <button onclick="addToCart('جاکلیدی نارنگی', 60000)">افزودن به سبد</button>
    </div>

    <div class="product">
      <div class="emoji">🐰</div>
      <h3>جاکلیدی خرگوش</h3>
      <div class="price">۱۲۰٬۰۰۰ تومان</div>
      <button onclick="addToCart('جاکلیدی خرگوش', 120000)">افزودن به سبد</button>
    </div>

    <div class="product">
      <div class="emoji">🐢</div>
      <h3>جاکلیدی لاک‌پشت</h3>
      <div class="price">۱۲۰٬۰۰۰ تومان</div>
      <button onclick="addToCart('جاکلیدی لاک‌پشت', 120000)">افزودن به سبد</button>
    </div>

    <div class="product">
      <div class="emoji">🧺</div>
      <h3>جاکلیدی سبد</h3>
      <div class="price">۶۰٬۰۰۰ تومان</div>
      <button onclick="addToCart('جاکلیدی سبد', 60000)">افزودن به سبد</button>
    </div>

    <div class="product">
      <div class="emoji">🐸</div>
      <h3>جاکلیدی قورباغه</h3>
      <div class="price">۱۲۰٬۰۰۰ تومان</div>
      <button onclick="addToCart('جاکلیدی قورباغه', 120000)">افزودن به سبد</button>
    </div>

    <div class="product">
      <div class="emoji">💖</div>
      <h3>دستبند بافتنی</h3>
      <div class="price">۲۹٬۰۰۰ تومان</div>
      <button onclick="addToCart('دستبند بافتنی', 29000)">افزودن به سبد</button>
    </div>

    <div class="product">
      <div class="emoji">🧽</div>
      <h3>لیف بافتنی</h3>
      <div class="price">۳۹٬۰۰۰ تومان</div>
      <button onclick="addToCart('لیف بافتنی', 39000)">افزودن به سبد</button>
    </div>

    <div class="product">
      <div class="emoji">🧶</div>
      <h3>محصول بافتنی معمولی</h3>
      <div class="price">۴۵٬۰۰۰ تومان</div>
      <button onclick="addToCart('محصول بافتنی معمولی', 45000)">افزودن به سبد</button>
    </div>

  </div>

  <div id="cart">
    <h2>🛒 سبد خرید</h2>

    <div id="cartItems">
      <p class="empty">سبد خرید خالی است.</p>
    </div>

    <h3 id="total">م
