let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Sayfa yüklendiğinde sepeti kontrol et
updateCartUI();

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

function addToCart(name, price) {
    // Fiyatı sayıya çevir (Virgülü noktaya çevirerek)
    let numericPrice = parseFloat(price.toString().replace(",", "."));
    
    cart.push({ name: name, price: numericPrice });
    saveCart();

    if (typeof gtag === "function") {
        gtag('event', 'add_to_cart', {
            currency: 'TRY',
            value: numericPrice,
            items: [{ item_name: name, price: numericPrice }]
        });
    }
    // Alert yerine artık aşağıda bar görünecek
}

function updateCartUI() {
    const cartBar = document.getElementById('cart-bar');
    const cartCount = document.getElementById('cart-count');
    const cartTotalText = document.getElementById('cart-total-text');

    if (cart.length > 0) {
        cartBar.style.display = 'flex';
        cartCount.innerText = cart.length;
        
        let total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalText.innerText = `Toplam: ${total.toFixed(2)} ₺`;
    } else {
        cartBar.style.display = 'none';
    }
}

function sendToWhatsApp() {
    if (cart.length === 0) {
        alert("Sepetiniz boş!");
        return;
    }

    let message = "*Yeni Sipariş (Üstüner Gıda)*%0A%0A";
    let total = 0;

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.price} ₺%0A`;
        total += item.price;
    });

    message += `%0A*Toplam Tutar: ${total.toFixed(2)} ₺*`;

    let phone = "905444465503";
    let url = "https://wa.me/" + phone + "?text=" + message;

    window.open(url, "_blank");

    // Sipariş gönderildikten sonra sepeti temizle
    cart = [];
    saveCart();
}
