let cart = JSON.parse(localStorage.getItem(“cart”)) || [];

document.addEventListener(“DOMContentLoaded”, function () { updateCartUI(); });

function saveCart() { localStorage.setItem(“cart”, JSON.stringify(cart)); updateCartUI(); }

window.addToCart = function(name, price) {

let cleanPrice = price.toString().replace(/[^\d,.]/g, ‘’).replace(’,’, ‘.’); let numericPrice = parseFloat(cleanPrice) || 0;

cart.push({ name: name, price: numericPrice });

saveCart();

showAddedAnimation(name);

if (typeof gtag === “function”) { gtag(‘event’,‘add_to_cart’,{ currency:‘TRY’, value:numericPrice, items:[{item_name:name,price:numericPrice}] }); } };

function showAddedAnimation(productName){

let notif = document.createElement(“div”); notif.innerText = productName + “ sepete eklendi”;

notif.style.position=“fixed”; notif.style.bottom=“160px”; notif.style.left=“50%”; notif.style.transform=“translateX(-50%)”; notif.style.background=”#0B1F3B”; notif.style.color=“white”; notif.style.padding=“10px 18px”; notif.style.borderRadius=“30px”; notif.style.fontSize=“14px”; notif.style.zIndex=“9999”; notif.style.boxShadow=“0 6px 20px rgba(0,0,0,0.3)”; notif.style.opacity=“0”; notif.style.transition=“all .4s”;

document.body.appendChild(notif);

setTimeout(()=>{ notif.style.opacity=“1”; notif.style.bottom=“180px”; },50);

setTimeout(()=>{ notif.style.opacity=“0”; },2000);

setTimeout(()=>{ notif.remove(); },2400);

}

window.updateCartUI = function () {

const cartBar=document.getElementById(“cart-bar”); const cartCount=document.getElementById(“cart-count”); const cartTotalText=document.getElementById(“cart-total-text”);

if(!cartBar) return;

if(cart.length>0){

cartBar.style.display=“flex”;

cartCount.innerText=cart.length;

let total=cart.reduce((sum,item)=>sum+item.price,0);

cartTotalText.innerText=“Toplam: “+total.toFixed(2).replace(’.’,’,’)+” ₺”;

}else{

cartBar.style.display=“none”;

}

};

window.clearCart=function(){

if(confirm(“Sepetteki tüm ürünler temizlensin mi?”)){

cart=[]; localStorage.removeItem(“cart”); saveCart();

}

};

window.sendToWhatsApp=function(){

if(cart.length===0){

alert(“Sepetiniz boş!”); return;

}

let message=”📦 ÜSTÜNER GIDA SİPARİŞİ%0A%0A”;

let total=0;

cart.forEach((item,index)=>{

message+=””+(index+1)+”. “+item.name+” (”+item.price.toFixed(2).replace(’.’,’,’)+” ₺)%0A”;

total+=item.price;

});

message+=”%0ATOPLAM: “+total.toFixed(2).replace(’.’,’,’)+” ₺”;

const phone=“905444465503”;

const url=“https://api.whatsapp.com/send?phone=”+phone+”&text=”+message;

window.open(url,”_blank”);

};