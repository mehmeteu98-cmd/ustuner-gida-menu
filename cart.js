let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart(){
localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price){
cart.push({name:name, price:price});
saveCart();

if(typeof gtag === "function"){
gtag('event','add_to_cart',{
currency:'TRY',
value:price,
items:[{item_name:name, price:price}]
});
}

alert(name + " sepete eklendi");
}

function sendToWhatsApp(){
if(cart.length===0){
alert("Sepet boş");
return;
}

let message="Merhaba, yeni sipariş:%0A%0A";
let total=0;

cart.forEach((item,index)=>{
message += (index+1)+". "+item.name+" - "+item.price+"₺%0A";
total += parseFloat(item.price.toString().replace(",", "."));
});

message += "%0AToplam: "+total+"₺";

let phone="905444465503";
let url="https://wa.me/"+phone+"?text="+message;

window.open(url,"_blank");

cart=[];
saveCart();
}
