/* ========================================
   KUAFÖRMARKETİ — SEPET SİSTEMİ (cart.js)
   Tüm sayfalarda ortak kullanılır.
   Tarayıcının localStorage'ında saklanır,
   sunucu/backend gerektirmez.
   ======================================== */

const CART_KEY = "kuaformarketi_sepet";

function getCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }catch(e){
    return [];
  }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id, name, price, qty){
  qty = qty || 1;
  let cart = getCart();
  const existing = cart.find(item => item.id === id);
  if(existing){
    existing.qty += qty;
  }else{
    cart.push({ id, name, price, qty });
  }
  saveCart(cart);
  showCartToast(name);
}

function removeFromCart(id){
  let cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  if(typeof renderCartPage === "function") renderCartPage();
}

function updateCartQty(id, qty){
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if(item){
    item.qty = Math.max(1, qty);
  }
  saveCart(cart);
  if(typeof renderCartPage === "function") renderCartPage();
}

function getCartCount(){
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal(){
  return getCart().reduce((sum, item) => sum + (parsePrice(item.price) * item.qty), 0);
}

function parsePrice(priceStr){
  // "₺1.250,00" gibi metinden sayı çıkarır
  const cleaned = String(priceStr).replace(/[₺\s.]/g,"").replace(",",".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function formatPrice(num){
  return "₺" + num.toLocaleString("tr-TR", {minimumFractionDigits:2, maximumFractionDigits:2});
}

function updateCartBadge(){
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = getCartCount();
  });
}

function showCartToast(name){
  let toast = document.getElementById("cartToast");
  if(!toast){
    toast = document.createElement("div");
    toast.id = "cartToast";
    toast.style.cssText = "position:fixed;bottom:24px;right:24px;background:#132a4c;color:#fff;padding:14px 20px;border-radius:8px;font-size:13.5px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.2);z-index:999;opacity:0;transition:opacity .25s, transform .25s;transform:translateY(10px);max-width:280px;";
    document.body.appendChild(toast);
  }
  toast.textContent = "✓ " + name + " sepete eklendi";
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 2200);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
