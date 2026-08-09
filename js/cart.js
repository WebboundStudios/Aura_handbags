/* ==========================================================================
   AURA HANDBAGS - E-Commerce Shopping Cart System
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'aura_handbags_cart';

  // Helper to parse price string like "₹3,490" to number (3490)
  function parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    const numeric = priceStr.toString().replace(/[^0-9]/g, '');
    return parseInt(numeric, 10) || 0;
  }

  // Helper to format number back to ₹ currency format
  function formatCurrency(num) {
    return '₹' + num.toLocaleString('en-IN');
  }

  // 1. Get Cart from LocalStorage
  window.getCart = function () {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read cart from localStorage', e);
      return [];
    }
  };

  // 2. Save Cart to LocalStorage and update UI
  window.saveCart = function (cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
    window.updateCartBadge();
    window.renderCartDrawer();
  };

  // 3. Add item to cart
  window.addToCart = function (product) {
    if (!product || !product.id) return;

    const cart = window.getCart();
    const numericPrice = parsePrice(product.price);
    const colorName = product.color || 'Standard';

    // Check if same item + same color is already in cart
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.color === colorName
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += product.quantity || 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title || 'Luxury Handbag',
        price: product.price || '₹3,490',
        numericPrice: numericPrice,
        color: colorName,
        image: product.image || 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=400&q=80',
        quantity: product.quantity || 1
      });
    }

    window.saveCart(cart);
    window.toggleCartDrawer(true);
    window.showToast(`Added "${product.title} (${colorName})" to your bag!`);
  };

  // 4. Update item quantity
  window.updateCartQuantity = function (index, delta) {
    const cart = window.getCart();
    if (cart[index]) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      window.saveCart(cart);
    }
  };

  // 5. Remove item from cart
  window.removeFromCart = function (index) {
    const cart = window.getCart();
    if (cart[index]) {
      const removedItem = cart[index];
      cart.splice(index, 1);
      window.saveCart(cart);
      window.showToast(`Removed "${removedItem.title}" from your bag`);
    }
  };

  // 6. Clear entire cart
  window.clearCart = function () {
    window.saveCart([]);
  };

  // 7. Update Cart Badge Count
  window.updateCartBadge = function () {
    const cart = window.getCart();
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count-badge').forEach((badge) => {
      badge.textContent = totalCount;
      if (totalCount > 0) {
        badge.classList.add('has-items');
      } else {
        badge.classList.remove('has-items');
      }
    });
  };

  // 8. Toggle Cart Drawer Open/Closed
  window.toggleCartDrawer = function (openState) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (!drawer || !overlay) return;

    if (openState === undefined) {
      openState = !drawer.classList.contains('active');
    }

    if (openState) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      window.renderCartDrawer();
    } else {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // 9. Render Cart Drawer Contents
  window.renderCartDrawer = function () {
    const itemsContainer = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const emptyNotice = document.getElementById('cart-empty-notice');
    const footerActions = document.getElementById('cart-footer-actions');

    if (!itemsContainer) return;

    const cart = window.getCart();

    if (cart.length === 0) {
      itemsContainer.innerHTML = '';
      if (emptyNotice) emptyNotice.style.display = 'flex';
      if (footerActions) footerActions.style.display = 'none';
      if (subtotalEl) subtotalEl.textContent = '₹0';
      return;
    }

    if (emptyNotice) emptyNotice.style.display = 'none';
    if (footerActions) footerActions.style.display = 'block';

    let totalSum = 0;

    itemsContainer.innerHTML = cart.map((item, idx) => {
      const itemTotal = item.numericPrice * item.quantity;
      totalSum += itemTotal;

      return `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.title}">
          </div>
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-meta">Color: <span>${item.color}</span></div>
            <div class="cart-item-price">${item.price}</div>
            
            <div class="cart-item-actions">
              <div class="cart-qty-stepper">
                <button type="button" onclick="window.updateCartQuantity(${idx}, -1)" aria-label="Decrease quantity">-</button>
                <span>${item.quantity}</span>
                <button type="button" onclick="window.updateCartQuantity(${idx}, 1)" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="cart-remove-btn" onclick="window.removeFromCart(${idx})" aria-label="Remove item">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (subtotalEl) {
      subtotalEl.textContent = formatCurrency(totalSum);
    }
  };

  // 10. Simple Toast Notification
  window.showToast = function (msg) {
    let toast = document.getElementById('aura-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'aura-toast';
      toast.className = 'aura-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // 11. Checkout Modal / Action
  window.checkoutCart = function () {
    const cart = window.getCart();
    if (cart.length === 0) return;

    const totalCount = cart.reduce((s, i) => s + i.quantity, 0);
    const totalSum = cart.reduce((s, i) => s + (i.numericPrice * i.quantity), 0);

    const itemsSummary = cart.map(i => `• ${i.title} (${i.color}) x${i.quantity} — ${formatCurrency(i.numericPrice * i.quantity)}`).join('\n');
    
    // Show order success modal
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
      document.getElementById('checkout-summary-text').textContent = itemsSummary;
      document.getElementById('checkout-total-price').textContent = formatCurrency(totalSum);
      checkoutModal.classList.add('active');
      window.toggleCartDrawer(false);
      window.clearCart();
    } else {
      alert(`Order Placed Successfully!\n\n${itemsSummary}\n\nTotal: ${formatCurrency(totalSum)}\n\nThank you for shopping with AURA!`);
      window.clearCart();
      window.toggleCartDrawer(false);
    }
  };

  // Initialize event listeners on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.updateCartBadge();

    // Attach click listeners to open cart drawer buttons
    document.querySelectorAll('.cart-drawer-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.toggleCartDrawer(true);
      });
    });

    // Close button & overlay clicks
    const closeBtn = document.getElementById('cart-drawer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => window.toggleCartDrawer(false));
    }

    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => window.toggleCartDrawer(false));
    }
  });
})();
