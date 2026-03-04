let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Sayfa ilk açıldığında barı kontrol et
updateCartUI();

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

function addToCart(name, price) {
    // Fiyatın içindeki "₺" işaretini ve boşlukları temizleyip sayıya çeviriyoruz
    let cleanPrice = price.toString().replace("₺", "").replace(".", "").replace(",", ".").trim();
    let numericPrice = parseFloat(cleanPrice);
    
    cart.push({ name: name, price: numericPrice });
    saveCart();

    // Google Analytics Etkinliği
    if (typeof gtag === "function") {
        gtag('event', 'add_to_cart', {
            currency: 'TRY',
            value: numericPrice,
            items: [{ item_name: name, price: numericPrice }]
        });
    }
}

function updateCartUI() {
    const cartBar = document.getElementById('cart-bar');
    const cartCount = document.getElementById('cart-count');
    const cartTotalText = document.getElementById('cart-total-text');

    if (cart.length > 0) {
        cartBar.style.display = 'flex';
        cartCount.innerText = cart.length;
        
        // Toplam fiyatı hesapla
        let total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalText.innerText = `Toplam: ${total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`;
    } else {
        cartBar.style.display = 'none';
    }
}

function sendToWhatsApp() {
    if (cart.length === 0) {
        alert("Sepetiniz boş!");
        return;
    }

    let message = "*📦 ÜSTÜNER GIDA YENİ SİPARİŞ*%0A";
    message += "---------------------------------%0A";
    
    let total = 0;
    cart.forEach((item, index) => {
        message += `*${index + 1}.* ${item.name} - ${item.price.toFixed(2)} ₺%0A`;
        total += item.price;
    });

    message += "---------------------------------%0A";
    message += `*TOPLAM TUTAR: ${total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺*%0A`;
    message += "---------------------------------%0A";
    message += "_Lütfen siparişi onaylayınız._";

    let phone = "905444465503";
    let url = `https://wa.me/${phone}?text=${message}`;

    window.open(url, "_blank");

    // Sipariş sonrası sepeti temizle
    if(confirm("Sipariş WhatsApp'a aktarıldı. Sepetinizi temizlemek ister misiniz?")) {
        cart = [];
        saveCart();
    }
}
