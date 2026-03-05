// cart.js

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", function () {
  updateCartUI();
});

// Sepeti kaydet ve UI güncelle
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// Ürün ekleme
window.addToCart = function(name, price) {
  let cleanPrice = price.toString().replace(/[^\d,.]/g, '').replace(',', '.');
  let numericPrice = parseFloat(cleanPrice) || 0;

  cart.push({ name: name, price: numericPrice });
  saveCart();
  showAddedAnimation(name);

  if (typeof gtag === "function") {
    gtag('event','add_to_cart',{
      currency:'TRY',
      value:numericPrice,
      items:[{item_name:name,price:numericPrice}]
    });
  }
};

// Ürün eklenince animasyon
function showAddedAnimation(productName){
  let notif = document.createElement("div");
  notif.innerText = productName + " sepete eklendi";
  notif.style.position="fixed";
  notif.style.bottom="40px";
  notif.style.right="40px";
  notif.style.background="#0B1F3B";
  notif.style.color="white";
  notif.style.padding="10px 18px";
  notif.style.borderRadius="30px";
  notif.style.fontSize="14px";
  notif.style.zIndex="9999";
  notif.style.boxShadow="0 6px 20px rgba(0,0,0,0.3)";
  notif.style.opacity="0";
  notif.style.transition="all .4s";
  document.body.appendChild(notif);

  setTimeout(()=>{notif.style.opacity="1";},50);
  setTimeout(()=>{notif.style.opacity="0";},2000);
  setTimeout(()=>{notif.remove();},2400);
}

// Sepeti UI’da göster
window.updateCartUI = function () {
  const cartContainer=document.getElementById("cart-container");
  if(!cartContainer) return;

  cartContainer.innerHTML = "";

  if(cart.length>0){
    let total=cart.reduce((sum,item)=>sum+item.price,0);

    cart.forEach((item,index)=>{
      const div=document.createElement("div");
      div.className="cart-item";
      div.style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px";
      div.innerHTML=`
        <span>${item.name} - ${item.price.toFixed(2).replace('.',',')} ₺</span>
        <button onclick="removeFromCart(${index})"
          style="margin-left:10px;background:red;color:white;border:none;border-radius:5px;cursor:pointer">
          ❌
        </button>
      `;
      cartContainer.appendChild(div);
    });

    const totalText=document.createElement("div");
    totalText.style="margin-top:10px;font-weight:bold;color:#0B1F3B";
    totalText.innerText="Toplam: "+total.toFixed(2).replace('.',',')+" ₺";
    cartContainer.appendChild(totalText);

    const sendBtn=document.createElement("button");
    sendBtn.innerText="WhatsApp’tan Gönder";
    sendBtn.style="margin-top:15px;padding:10px 20px;background:#25D366;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;width:100%";
    sendBtn.onclick=sendToWhatsApp;
    cartContainer.appendChild(sendBtn);

    const clearBtn=document.createElement("button");
    clearBtn.innerText="Sepeti Temizle";
    clearBtn.style="margin-top:10px;padding:8px 15px;background:#C9A227;color:#0B1F3B;border:none;border-radius:8px;cursor:pointer;font-weight:bold;width:100%";
    clearBtn.onclick=clearCart;
    cartContainer.appendChild(clearBtn);

  } else {
    cartContainer.innerHTML="<p>Sepetiniz boş</p>";
  }
};

// Ürün silme
window.removeFromCart=function(index){
  cart.splice(index,1);
  saveCart();
};

// Sepeti temizleme
window.clearCart=function(){
  if(confirm("Sepetteki tüm ürünler temizlensin mi?")){
    cart=[];
    localStorage.removeItem("cart");
    saveCart();
  }
};

// WhatsApp’a gönderme
window.sendToWhatsApp=function(){
  if(cart.length===0){
    alert("Sepetiniz boş!");
    return;
  }

  let message="*📦 ÜSTÜNER GIDA SİPARİŞİ*%0A%0A";
  let total=0;

  cart.forEach((item,index)=>{
    message+="*"+(index+1)+".* "+item.name+" ("+item.price.toFixed(2).replace('.',',')+" ₺)%0A";
    total+=item.price;
  });

  message+="%0A*TOPLAM: "+total.toFixed(2).replace('.',',')+" ₺*";

  const phone="905444465503"; // kendi numaran
  const url="https://api.whatsapp.com/send?phone="+phone+"&text="+message;
  window.open(url,"_blank");
};

// Sepet panelini aç/kapat
window.toggleCart = function(){
  const panel=document.getElementById("cart-panel");
  if(panel.style.right==="0px"){
    panel.style.right="-400px";
  }else{
    panel.style.right="0px";
    updateCartUI();
  }
};
