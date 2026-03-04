let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Sayfa yüklendiğinde sepetin durumunu kontrol et
document.addEventListener("DOMContentLoaded", function() {
    updateCartUI();
});

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

function addToCart(name, price) {
    // Fiyatın içindeki ₺, nokta veya boşlukları temizleyip sayıya çevirir
    let cleanPrice = price.toString().replace(/[^\d,.]/g, '').replace(',', '.');
    let numericPrice = parseFloat(cleanPrice) || 0;
    
    cart.push({ name: name, price: numericPrice });
    saveCart();

    // Google Analytics olayını tetikle
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

    if (!cartBar) return;

    if (cart.length > 0) {
        cartBar.style.display = 'flex'; // Sepette ürün varsa barı göster
        cartCount.innerText = cart.length;
        
        // Toplam fiyatı hesapla
        let total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalText.innerText = `Toplam: ${total.toFixed(2).replace('.', ',')} ₺`;
    } else {
        cartBar.style.display = 'none'; // Sepet boşsa barı gizle
    }
}

function sendToWhatsApp() {
    if (cart.length === 0) {
        alert("Sepetiniz boş!");
        return;
    }

    let message = "*📦 ÜSTÜNER GIDA - YENİ SİPARİŞ*%0A";
    message += "---------------------------------%0A";
    
    let total = 0;
    // Ürünleri tek tek listeye ekle
    cart.forEach((item, index) => {
        message += `*${index + 1}.* ${item.name} _(${item.price.toFixed(2).replace('.', ',')} ₺)_%0A`;
        total += item.price;
    });

    message += "---------------------------------%0A";
    message += `*TOPLAM TUTAR: ${total.toFixed(2).replace('.', ',')} ₺*%0A`;
    message += "---------------------------------%0A";
    message += "_Siparişim hakkında bilgi almak istiyorum._";

    const phone = "905444465503";
    // WhatsApp API URL'i
    const url = "https://api.whatsapp.com/send?phone=" + phone + "&text=" + message;

    // Tarayıcıda yeni sekme olarak WhatsApp'ı aç
    window.open(url, '_blank');

    // Sipariş gönderildikten sonra sepeti temizlemek istersen:
    if(confirm("Sipariş listesi WhatsApp'a aktarıldı. Sepeti temizlemek ister misiniz?")) {
        cart = [];
        saveCart();
    }
}
