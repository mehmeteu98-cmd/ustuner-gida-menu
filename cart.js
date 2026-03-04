let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Sayfa yüklenince sepeti kontrol et
document.addEventListener("DOMContentLoaded", function() {
    updateCartUI();
});

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

function addToCart(name, price) {
    // Fiyatı sayıya dönüştür
    let cleanPrice = price.toString().replace(/[^\d,.]/g, '').replace(',', '.');
    let numericPrice = parseFloat(cleanPrice) || 0;
    
    cart.push({ name: name, price: numericPrice });
    saveCart();

    if (typeof gtag === "function") {
        gtag('event', 'add_to_cart', { currency: 'TRY', value: numericPrice, items: [{ item_name: name, price: numericPrice }] });
    }
}

function updateCartUI() {
    const cartBar = document.getElementById('cart-bar');
    const cartCount = document.getElementById('cart-count');
    const cartTotalText = document.getElementById('cart-total-text');

    if (!cartBar) return;

    if (cart.length > 0) {
        cartBar.style.display = 'flex';
        cartCount.innerText = cart.length;
        let total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalText.innerText = `Toplam: ${total.toFixed(2).replace('.', ',')} ₺`;
    } else {
        cartBar.style.display = 'none';
    }
}

// SEPETİ TEMİZLEME FONKSİYONU
function clearCart() {
    if (confirm("Sepetteki tüm ürünler temizlensin mi?")) {
        cart = [];
        saveCart();
    }
}

function sendToWhatsApp() {
    if (cart.length === 0) {
        alert("Sepetiniz boş!");
        return;
    }

    let message = "*📦 ÜSTÜNER GIDA SİPARİŞİ*%0A%0A";
    let total = 0;
    cart.forEach((item, index) => {
        message += `*${index + 1}.* ${item.name} (${item.price.toFixed(2).replace('.', ',')} ₺)%0A`;
        total += item.price;
    });

    message += `%0A*TOPLAM: ${total.toFixed(2).replace('.', ',')} ₺*`;
    const phone = "905444465503";
    const url = "https://api.whatsapp.com/send?phone=" + phone + "&text=" + message;
    
    window.open(url, '_blank');
}
