// TAB 1: POS VIEW & LOGIC
// ==========================================================================
function renderPOS(container) {
  container.innerHTML = `
    <div class="pos-layout">
      <!-- Left Panel: Grid & Categories -->
      <div class="pos-catalog">
        <div class="catalog-header">
          <div class="search-bar">
            <svg viewBox="0 0 24 24" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="search-input" type="text" id="catalog-search" placeholder="à¸„à¹‰à¸™à¸«à¸²à¹€à¸¡à¸™à¸¹à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸”à¸·à¹ˆà¸¡ / à¸‚à¸™à¸¡..." value="${state.searchQuery}">
          </div>
        </div>
        
        <!-- Category Tab Bar -->
        <div class="categories-tabs">
          <button class="category-tab ${state.selectedCategory === 'all' ? 'active' : ''}" data-cat="all">à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”</button>
          <button class="category-tab ${state.selectedCategory === 'drinks' ? 'active' : ''}" data-cat="drinks">à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸”à¸·à¹ˆà¸¡ (Drinks)</button>
          <button class="category-tab ${state.selectedCategory === 'snacks' ? 'active' : ''}" data-cat="snacks">à¸‚à¸™à¸¡/à¹€à¸šà¹€à¸à¸­à¸£à¸µà¹ˆ (Snacks)</button>
          <button class="category-tab ${state.selectedCategory === 'others' ? 'active' : ''}" data-cat="others">à¸­à¸·à¹ˆà¸™à¹† (Others)</button>
        </div>

        <!-- Product Grid -->
        <div class="products-grid" id="pos-products-grid"></div>
      </div>

      <!-- Right Panel: Shopping Cart -->
      <div class="pos-cart">
        <div class="cart-header">
          <div class="cart-title">
            à¸­à¸­à¸£à¹Œà¹€à¸”à¸­à¸£à¹Œà¸›à¸±à¸ˆà¸ˆà¸¸à¸šà¸±à¸™
            <span class="cart-count">${getCartItemsCount()}</span>
          </div>
          <button class="cart-clear" id="btn-clear-cart">à¸¥à¹‰à¸²à¸‡à¸•à¸°à¸à¸£à¹‰à¸²</button>
        </div>

        <div class="cart-items" id="pos-cart-items"></div>

        <!-- Channel Select (Line Man, Grab, Walk-in) -->
        <div class="cart-channel-section">
          <label class="channel-label">à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡à¸£à¸±à¸šà¸­à¸­à¸£à¹Œà¹€à¸”à¸­à¸£à¹Œ</label>
          <div class="channel-buttons">
            <button class="channel-btn lineman ${state.selectedChannel === 'lineman' ? 'selected' : ''}" data-channel="lineman">
              <div class="channel-icon">LM</div>
              LINE MAN
            </button>
            <button class="channel-btn grab ${state.selectedChannel === 'grab' ? 'selected' : ''}" data-channel="grab">
              <div class="channel-icon">G</div>
              Grab
            </button>
            <button class="channel-btn walkin ${state.selectedChannel === 'walkin' ? 'selected' : ''}" data-channel="walkin">
              <div class="channel-icon">W</div>
              à¸«à¸™à¹‰à¸²à¸£à¹‰à¸²à¸™ / à¸­à¸·à¹ˆà¸™à¹†
            </button>
          </div>
          <button class="quick-paste-btn" id="btn-quick-paste">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            âš¡ à¸„à¸µà¸¢à¹Œà¸­à¸­à¸£à¹Œà¹€à¸”à¸­à¸£à¹Œà¸”à¹ˆà¸§à¸™à¸ˆà¸²à¸ Grab/LINE MAN
          </button>
        </div>

        <!-- Cart Summary & Checkout -->
        <div class="cart-summary">
          ${state.selectedChannel !== 'walkin' ? `
            <input class="order-num-input" type="text" id="order-reference" placeholder="à¸£à¸«à¸±à¸ªà¸­à¸­à¸£à¹Œà¹€à¸”à¸­à¸£à¹Œà¹€à¸”à¸¥à¸´à¹€à¸§à¸­à¸£à¸µà¹ˆ (à¹€à¸Šà¹ˆà¸™ #4528)" value="${state.orderNumber}">
          ` : ''}
          <div class="summary-row">
            <span>à¸ˆà¸³à¸™à¸§à¸™à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”</span>
            <span id="summary-qty">${getCartItemsCount()} à¸Šà¸´à¹‰à¸™</span>
          </div>
          <div class="summary-row total">
            <span>à¸¢à¸­à¸”à¸£à¸§à¸¡à¸ªà¸¸à¸—à¸˜à¸´</span>
            <span class="total-val">à¸¿<span id="summary-total">${getCartTotal()}</span></span>
          </div>
          <button class="checkout-btn" id="btn-checkout" ${state.cart.length === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            à¸¢à¸·à¸™à¸¢à¸±à¸™à¸à¸²à¸£à¸ªà¸±à¹ˆà¸‡à¸‹à¸·à¹‰à¸­ &amp; à¸žà¸´à¸¡à¸žà¹Œà¹ƒà¸šà¸ªà¸±à¹ˆà¸‡à¸‚à¸­à¸‡
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modifier Modal Container -->
    <div class="modal-overlay hidden" id="modifier-modal"></div>
    <!-- Paste Modal Container -->
    <div class="modal-overlay hidden" id="paste-modal"></div>
  `;

  // Attach POS Event Listeners
  const searchInput = document.getElementById('catalog-search');
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    filterAndRenderProducts();
  });

  // Category switching
  const catTabs = document.querySelectorAll('.category-tab');
  catTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      catTabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      state.selectedCategory = e.target.dataset.cat;
      filterAndRenderProducts();
    });
  });

  // Cart Channel switching
  const channelBtns = document.querySelectorAll('.channel-btn');
  channelBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      channelBtns.forEach(b => b.classList.remove('selected'));
      const targetBtn = e.target.closest('.channel-btn');
      targetBtn.classList.add('selected');
      state.selectedChannel = targetBtn.dataset.channel;
      state.orderNumber = ''; // Reset order ref on switch
      renderPOS(container); // Re-render to show/hide order ref input field
    });
  });

  // Order Reference updates
  const refInput = document.getElementById('order-reference');
  if (refInput) {
    refInput.addEventListener('input', (e) => {
      state.orderNumber = e.target.value;
    });
  }

  // Clear cart
  document.getElementById('btn-clear-cart').addEventListener('click', () => {
    state.cart = [];
    state.orderNumber = '';
    renderPOS(container);
  });

  // Checkout
  document.getElementById('btn-checkout').addEventListener('click', () => {
    handleCheckout();
  });

  // Open Quick Paste Modal
  document.getElementById('btn-quick-paste').addEventListener('click', openPasteModal);

  // Initial Product rendering
  filterAndRenderProducts();
  renderCart();
}

function filterAndRenderProducts() {
  const grid = document.getElementById('pos-products-grid');
  if (!grid) return;

  grid.innerHTML = '';
  
  const query = state.searchQuery.toLowerCase();
  
  const filtered = state.products.filter(p => {
    const matchesCat = state.selectedCategory === 'all' || p.category === state.selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);">
        <p>à¹„à¸¡à¹ˆà¸žà¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸ªà¸´à¸™à¸„à¹‰à¸²à¸—à¸µà¹ˆà¸£à¸°à¸šà¸¸</p>
      </div>
    `;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('button');
    card.className = 'product-card';
    card.type = 'button';
    
    const isOutOfStock = p.stock <= 0;
    
    card.innerHTML = `
      <div class="product-img-container">
        ${p.image ? `<img src="${p.image}" class="product-img" alt="${p.name}">` : `<div class="product-placeholder">${p.category === 'drinks' ? 'ðŸ¥¤' : 'ðŸ°'}</div>`}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <span class="product-price">à¸¿${p.price}</span>
          <span class="product-stock ${isOutOfStock ? 'out' : ''}">${isOutOfStock ? 'à¸«à¸¡à¸”' : `à¸„à¸¥à¸±à¸‡: ${p.stock}`}</span>
        </div>
      </div>
    `;

    if (isOutOfStock) {
      card.style.opacity = '0.6';
      card.style.cursor = 'not-allowed';
    } else {
      card.addEventListener('click', () => {
        openModifierModal(p);
      });
    }

    grid.appendChild(card);
  });
}

function renderCart() {
  const cartContainer = document.getElementById('pos-cart-items');
  if (!cartContainer) return;

  cartContainer.innerHTML = '';

  if (state.cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸™à¸•à¸°à¸à¸£à¹‰à¸²</p>
      </div>
    `;
    return;
  }

  state.cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    
    const optionsText = [item.sweetness, item.topping].filter(Boolean).join(', ');
    const itemTotal = (item.product.price + item.toppingPrice) * item.qty;

    div.innerHTML = `
      <div class="cart-item-main">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.product.name}</div>
          ${optionsText || item.notes ? `
            <div class="cart-item-options">
              ${optionsText ? `<span>${optionsText}</span>` : ''}
              ${item.notes ? `<span style="color: var(--primary);">à¹‚à¸™à¹‰à¸•: ${item.notes}</span>` : ''}
            </div>
          ` : ''}
        </div>
        <div class="cart-item-price-col">
          <div class="cart-item-total">à¸¿${itemTotal}</div>
        </div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-item-notes-btn" data-index="${index}">à¹à¸à¹‰à¹„à¸‚à¹‚à¸™à¹‰à¸•</button>
        <div class="cart-quantity-selector">
          <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
        </div>
      </div>
    `;

    cartContainer.appendChild(div);
  });

  // Attach Cart quantity button events
  cartContainer.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index);
      const action = e.target.dataset.action;
      if (action === 'increase') {
        const product = state.cart[idx].product;
        if (state.cart[idx].qty < product.stock) {
          state.cart[idx].qty += 1;
        } else {
          alert(`à¹„à¸¡à¹ˆà¸ªà¸²à¸¡à¸²à¸£à¸–à¹€à¸žà¸´à¹ˆà¸¡à¸ˆà¸³à¸™à¸§à¸™à¹„à¸”à¹‰ à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸™à¸„à¸¥à¸±à¸‡à¸¡à¸µà¸ˆà¸³à¸à¸±à¸” (${product.stock} à¸Šà¸´à¹‰à¸™)`);
        }
      } else {
        state.cart[idx].qty -= 1;
        if (state.cart[idx].qty <= 0) {
          state.cart.splice(idx, 1);
        }
      }
      updateCartSummary();
      renderCart();
    });
  });

  // Edit notes event
  cartContainer.querySelectorAll('.cart-item-notes-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index);
      const newNote = prompt('à¹€à¸žà¸´à¹ˆà¸¡à¸„à¸³à¹à¸™à¸°à¸™à¸³à¸žà¸´à¹€à¸¨à¸©/à¹‚à¸™à¹‰à¸•à¸ªà¸³à¸«à¸£à¸±à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸™à¸µà¹‰:', state.cart[idx].notes || '');
      if (newNote !== null) {
        state.cart[idx].notes = newNote.trim();
        renderCart();
      }
    });
  });
}

function updateCartSummary() {
  const qtyEl = document.getElementById('summary-qty');
  const totalEl = document.getElementById('summary-total');
  const checkoutBtn = document.getElementById('btn-checkout');
  
  const count = getCartItemsCount();
  const total = getCartTotal();

  if (qtyEl) qtyEl.textContent = `${count} à¸Šà¸´à¹‰à¸™`;
  if (totalEl) totalEl.textContent = total;
  
  if (checkoutBtn) {
    if (count === 0) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = '0.5';
      checkoutBtn.style.cursor = 'not-allowed';
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.cursor = 'pointer';
    }
  }
}

function getCartItemsCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + ((item.product.price + item.toppingPrice) * item.qty), 0);
}

// Modifier Modal Operations
function openModifierModal(product) {
  const modal = document.getElementById('modifier-modal');
  if (!modal) return;

  state.activeModifierItem = product;
  
  const isDrink = product.category === 'drinks';

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">${product.name}</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <div style="font-size: 15px; color: var(--text-secondary); margin-bottom: 20px;">
          à¸£à¸²à¸„à¸²à¸žà¸·à¹‰à¸™à¸à¸²à¸™: à¸¿${product.price}
        </div>

        ${isDrink ? `
          <!-- Sweetness Levels -->
          <div class="modifier-group">
            <div class="modifier-label">à¸£à¸°à¸”à¸±à¸šà¸„à¸§à¸²à¸¡à¸«à¸§à¸²à¸™</div>
            <div class="modifier-options" id="options-sweetness">
              <button class="modifier-btn" data-val="à¸«à¸§à¸²à¸™à¸›à¸à¸•à¸´ (100%)">100%</button>
              <button class="modifier-btn" data-val="à¸«à¸§à¸²à¸™à¸™à¹‰à¸­à¸¢ (50%)">50%</button>
              <button class="modifier-btn" data-val="à¸«à¸§à¸²à¸™à¸™à¹‰à¸­à¸¢à¸¡à¸²à¸ (25%)">25%</button>
              <button class="modifier-btn" data-val="à¹„à¸¡à¹ˆà¸«à¸§à¸²à¸™à¹€à¸¥à¸¢ (0%)">0%</button>
              <button class="modifier-btn" data-val="à¸«à¸§à¸²à¸™à¸¡à¸²à¸ (120%)">120%</button>
            </div>
          </div>

          <!-- Toppings -->
          <div class="modifier-group">
            <div class="modifier-label">à¸—à¹‡à¸­à¸›à¸›à¸´à¹‰à¸‡à¹€à¸žà¸´à¹ˆà¸¡à¹€à¸•à¸´à¸¡</div>
            <div class="modifier-options" id="options-toppings">
              <button class="modifier-btn selected" data-val="" data-price="0">à¹„à¸¡à¹ˆà¸£à¸±à¸šà¸—à¹‡à¸­à¸›à¸›à¸´à¹‰à¸‡</button>
              <button class="modifier-btn" data-val="à¹€à¸žà¸´à¹ˆà¸¡à¹„à¸‚à¹ˆà¸¡à¸¸à¸ (+10à¸¿)" data-price="10">à¹„à¸‚à¹ˆà¸¡à¸¸à¸ (+à¸¿10)</button>
              <button class="modifier-btn" data-val="à¹€à¸žà¸´à¹ˆà¸¡à¸žà¸¸à¸”à¸”à¸´à¹‰à¸‡à¸™à¸¡ (+15à¸¿)" data-price="15">à¸žà¸¸à¸”à¸”à¸´à¹‰à¸‡à¸™à¸¡ (+à¸¿15)</button>
              <button class="modifier-btn" data-val="à¹€à¸žà¸´à¹ˆà¸¡à¸šà¸¸à¸à¸§à¸¸à¹‰à¸™ (+10à¸¿)" data-price="10">à¸šà¸¸à¸à¸§à¸¸à¹‰à¸™ (+à¸¿10)</button>
              <button class="modifier-btn" data-val="à¹€à¸žà¸´à¹ˆà¸¡à¸§à¸´à¸›à¸„à¸£à¸µà¸¡ (+15à¸¿)" data-price="15">à¸§à¸´à¸›à¸„à¸£à¸µà¸¡ (+à¸¿15)</button>
            </div>
          </div>
        ` : `
          <!-- Option for snacks: Heat / Warm up -->
          <div class="modifier-group">
            <div class="modifier-label">à¸šà¸£à¸´à¸à¸²à¸£à¸­à¸¸à¹ˆà¸™à¸£à¹‰à¸­à¸™</div>
            <div class="modifier-options" id="options-warm">
              <button class="modifier-btn selected" data-val="">à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸­à¸¸à¹ˆà¸™</button>
              <button class="modifier-btn" data-val="à¸­à¸¸à¹ˆà¸™à¸£à¹‰à¸­à¸™">à¸­à¸¸à¹ˆà¸™à¸£à¹‰à¸­à¸™à¹ƒà¸«à¹‰à¸£à¹‰à¸­à¸™à¸žà¸£à¹‰à¸­à¸¡à¸—à¸²à¸™</button>
            </div>
          </div>
        `}

        <div class="form-group" style="margin-top: 15px;">
          <label class="form-label" style="font-size: 13px;">à¸„à¸³à¸‚à¸­à¹€à¸žà¸´à¹ˆà¸¡à¹€à¸•à¸´à¸¡à¸–à¸¶à¸‡à¸£à¹‰à¸²à¸™à¸„à¹‰à¸² (à¹‚à¸™à¹‰à¸•)</label>
          <input class="form-input" type="text" id="modal-notes" placeholder="à¹€à¸Šà¹ˆà¸™ à¹à¸¢à¸à¸™à¹‰à¸³à¹à¸‚à¹‡à¸‡, à¸«à¸§à¸²à¸™à¸˜à¸£à¸£à¸¡à¸Šà¸²à¸•à¸´...">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" id="modal-cancel-btn">à¸¢à¸à¹€à¸¥à¸´à¸</button>
        <button class="btn-primary" id="modal-add-btn">à¹ƒà¸ªà¹ˆà¸•à¸°à¸à¸£à¹‰à¸² (à¸¿${product.price})</button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('modal-close-btn').addEventListener('click', closeModifierModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModifierModal);

  let selectedSweetness = isDrink ? 'à¸«à¸§à¸²à¸™à¸›à¸à¸•à¸´ (100%)' : '';
  let selectedTopping = '';
  let toppingPrice = 0;
  let selectedWarm = '';
  
  if (isDrink) {
    const sweetBtns = document.querySelectorAll('#options-sweetness .modifier-btn');
    sweetBtns.forEach(btn => {
      if (btn.dataset.val === selectedSweetness) btn.classList.add('selected');
      btn.addEventListener('click', (e) => {
        sweetBtns.forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedSweetness = e.target.dataset.val;
      });
    });

    const toppingBtns = document.querySelectorAll('#options-toppings .modifier-btn');
    toppingBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        toppingBtns.forEach(b => b.classList.remove('selected'));
        const targetBtn = e.target.closest('.modifier-btn');
        targetBtn.classList.add('selected');
        selectedTopping = targetBtn.dataset.val;
        toppingPrice = parseInt(targetBtn.dataset.price);
        document.getElementById('modal-add-btn').textContent = `à¹ƒà¸ªà¹ˆà¸•à¸°à¸à¸£à¹‰à¸² (à¸¿${product.price + toppingPrice})`;
      });
    });
  } else {
    const warmBtns = document.querySelectorAll('#options-warm .modifier-btn');
    warmBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        warmBtns.forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedWarm = e.target.dataset.val;
      });
    });
  }

  // Add to cart submit
  document.getElementById('modal-add-btn').addEventListener('click', () => {
    const notesInput = document.getElementById('modal-notes').value.trim();
    
    const cartItem = {
      product: product,
      qty: 1,
      sweetness: selectedSweetness,
      topping: selectedTopping || selectedWarm,
      notes: notesInput,
      toppingPrice: toppingPrice
    };

    const existingIndex = state.cart.findIndex(item => 
      item.product.id === cartItem.product.id && 
      item.sweetness === cartItem.sweetness && 
      item.topping === cartItem.topping && 
      item.notes === cartItem.notes
    );

    if (existingIndex > -1) {
      const targetItem = state.cart[existingIndex];
      if (targetItem.qty + 1 <= product.stock) {
        targetItem.qty += 1;
      } else {
        alert(`à¹„à¸¡à¹ˆà¸ªà¸²à¸¡à¸²à¸£à¸–à¹€à¸žà¸´à¹ˆà¸¡à¸ˆà¸³à¸™à¸§à¸™à¹„à¸”à¹‰ à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸™à¸„à¸¥à¸±à¸‡à¸¡à¸µà¸ˆà¸³à¸à¸±à¸” (${product.stock} à¸Šà¸´à¹‰à¸™)`);
      }
    } else {
      state.cart.push(cartItem);
    }

    closeModifierModal();
    renderCart();
    updateCartSummary();
  });
}

function closeModifierModal() {
  const modal = document.getElementById('modifier-modal');
  if (modal) modal.classList.add('hidden');
  state.activeModifierItem = null;
}

// ==========================================================================
// DELIVERY ORDER QUICK PASTE PARSER HELPER
// ==========================================================================
function openPasteModal() {
  const modal = document.getElementById('paste-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">à¸„à¸µà¸¢à¹Œà¸­à¸­à¸£à¹Œà¹€à¸”à¸­à¸£à¹Œà¸”à¹ˆà¸§à¸™à¸”à¹‰à¸§à¸¢à¸à¸²à¸£à¸§à¸²à¸‡à¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡</h3>
        <button class="modal-close" id="paste-modal-close-btn">&times;</button>
      </div>
      <div class="modal-body paste-modal-body">
        <p class="paste-help-text">
          à¸„à¸±à¸”à¸¥à¸­à¸à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸„à¸³à¸ªà¸±à¹ˆà¸‡à¸‹à¸·à¹‰à¸­à¸ˆà¸²à¸à¹à¸­à¸› LINE MAN à¸«à¸£à¸·à¸­ Grab à¹à¸¥à¹‰à¸§à¸§à¸²à¸‡à¸¥à¸‡à¹ƒà¸™à¸Šà¹ˆà¸­à¸‡à¸™à¸µà¹‰ à¸£à¸°à¸šà¸šà¸ˆà¸°à¸§à¸´à¹€à¸„à¸£à¸²à¸°à¸«à¹Œà¸«à¸²à¸Šà¸·à¹ˆà¸­à¹€à¸¡à¸™à¸¹ à¸ˆà¸³à¸™à¸§à¸™ à¸„à¸§à¸²à¸¡à¸«à¸§à¸²à¸™ à¹à¸¥à¸°à¸—à¹‡à¸­à¸›à¸›à¸´à¹‰à¸‡ à¹€à¸žà¸·à¹ˆà¸­à¹à¸­à¸”à¸¥à¸‡à¸šà¸´à¸¥à¹ƒà¸«à¹‰à¸—à¸±à¸™à¸—à¸µà¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸„à¸µà¸¢à¹Œà¹à¸¢à¸à¸Šà¸´à¹‰à¸™
        </p>
        <textarea class="paste-textarea" id="paste-textarea-input" placeholder="à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡à¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡:
LINE MAN à¸­à¸­à¸£à¹Œà¹€à¸”à¸­à¸£à¹Œ #4821
2x à¸Šà¸²à¸™à¸¡à¹„à¸•à¹‰à¸«à¸§à¸±à¸™à¸šà¸±à¸šà¹€à¸šà¸´à¹‰à¸¥ (Bubble Milk Tea) (à¸«à¸§à¸²à¸™à¸™à¹‰à¸­à¸¢ (50%), à¹€à¸žà¸´à¹ˆà¸¡à¹„à¸‚à¹ˆà¸¡à¸¸à¸)
1x à¸šà¸£à¸²à¸§à¸™à¸µà¹ˆà¸”à¸²à¸£à¹Œà¸à¸Šà¹‡à¸­à¸à¹‚à¸à¹à¸¥à¸• (Dark Chocolate Brownie) (à¸­à¸¸à¹ˆà¸™à¸£à¹‰à¸­à¸™)"></textarea>
        <div class="paste-help-text">
          <strong>à¸„à¸¸à¸“à¸ªà¸¡à¸šà¸±à¸•à¸´à¸à¸²à¸£à¸•à¸£à¸§à¸ˆà¸ˆà¸±à¸š:</strong>
          <ul>
            <li>à¹€à¸›à¸£à¸µà¸¢à¸šà¹€à¸—à¸µà¸¢à¸šà¸„à¸³à¹à¸¥à¸°à¸„à¹‰à¸™à¸«à¸²à¹€à¸¡à¸™à¸¹à¹ƒà¸™à¸£à¹‰à¸²à¸™ (à¸£à¸­à¸‡à¸£à¸±à¸šà¸ à¸²à¸©à¸²à¹„à¸—à¸¢ à¹à¸¥à¸°à¸ à¸²à¸©à¸²à¸­à¸±à¸‡à¸à¸¤à¸©)</li>
            <li>à¸•à¸£à¸§à¸ˆà¸ˆà¸±à¸šà¸ˆà¸³à¸™à¸§à¸™ à¹€à¸Šà¹ˆà¸™ 1x, x2 à¸«à¸£à¸·à¸­ 1 à¸Šà¸´à¹‰à¸™</li>
            <li>à¸•à¸£à¸§à¸ˆà¸ˆà¸±à¸šà¸„à¸§à¸²à¸¡à¸«à¸§à¸²à¸™ (0%, 25%, 50%, 100%, 120%) à¹à¸¥à¸°à¸à¸²à¸£à¸­à¸¸à¹ˆà¸™à¸£à¹‰à¸­à¸™</li>
            <li>à¸•à¸£à¸§à¸ˆà¸ˆà¸±à¸šà¸£à¸«à¸±à¸ªà¸­à¸­à¸£à¹Œà¹€à¸”à¸­à¸£à¹Œà¸ˆà¸²à¸à¸«à¸±à¸§à¸‚à¹‰à¸­ (à¹€à¸Šà¹ˆà¸™ #4821)</li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" id="paste-modal-cancel-btn">à¸¢à¸à¹€à¸¥à¸´à¸</button>
        <button class="btn-primary" id="paste-modal-import-btn">à¸™à¸³à¹€à¸‚à¹‰à¸²à¸•à¸°à¸à¸£à¹‰à¸²à¸ªà¸´à¸™à¸„à¹‰à¸²</button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('paste-modal-close-btn').addEventListener('click', closePasteModal);
  document.getElementById('paste-modal-cancel-btn').addEventListener('click', closePasteModal);
  
  document.getElementById('paste-modal-import-btn').addEventListener('click', () => {
    const text = document.getElementById('paste-textarea-input').value;
    if (!text.trim()) {
      alert('à¸à¸£à¸¸à¸“à¸²à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡à¸ªà¸£à¸¸à¸›à¸­à¸­à¸£à¹Œà¹€à¸”à¸­à¸£à¹Œ');
      return;
    }
    
    const parsed = parsePastedOrder(text);
    if (parsed.items.length === 0) {
      alert('à¸§à¸´à¹€à¸„à¸£à¸²à¸°à¸«à¹Œà¹„à¸¡à¹ˆà¸ªà¸³à¹€à¸£à¹‡à¸ˆ: à¹„à¸¡à¹ˆà¸žà¸šà¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸™à¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡à¸—à¸µà¹ˆà¸•à¸£à¸‡à¸à¸±à¸šà¹€à¸¡à¸™à¸¹à¸‚à¸­à¸‡à¸£à¹‰à¸²à¸™à¸„à¹‰à¸² à¸à¸£à¸¸à¸“à¸²à¸•à¸£à¸§à¸ˆà¹€à¸Šà¹‡à¸„à¸•à¸±à¸§à¸ªà¸°à¸à¸”à¸Šà¸·à¹ˆà¸­à¹€à¸¡à¸™à¸¹à¹ƒà¸«à¹‰à¸•à¸£à¸‡à¸à¸±à¸™');
      return;
    }

    // Populate cart
    parsed.items.forEach(parsedItem => {
      const existingIdx = state.cart.findIndex(item => 
        item.product.id === parsedItem.product.id && 
        item.sweetness === parsedItem.sweetness && 
        item.topping === parsedItem.topping && 
        item.notes === parsedItem.notes
      );

      if (existingIdx > -1) {
        state.cart[existingIdx].qty += parsedItem.qty;
      } else {
        state.cart.push(parsedItem);
      }
    });

    // Populate metadata
    state.selectedChannel = parsed.channel;
    state.orderNumber = parsed.reference;

    closePasteModal();
    
    const wrapper = document.getElementById('main-content-wrapper');
    renderPOS(wrapper);
  });
}

function closePasteModal() {
  const modal = document.getElementById('paste-modal');
  if (modal) modal.classList.add('hidden');
}

function parsePastedOrder(text) {
  const result = {
    items: [],
    reference: '',
    channel: 'walkin'
  };

  const lowerText = text.toLowerCase();
  
  // Detect channel
  if (lowerText.includes('line man') || lowerText.includes('lineman') || lowerText.includes('à¹„à¸¥à¸™à¹Œà¹à¸¡à¸™')) {
    result.channel = 'lineman';
  } else if (lowerText.includes('grab') || lowerText.includes('à¹à¸à¸£à¹‡à¸š')) {
    result.channel = 'grab';
  }

  // Detect reference number
  const refMatch = text.match(/#([a-zA-Z0-9-]+)/) || text.match(/à¸­à¸­à¸£à¹Œà¹€à¸”à¸­à¸£à¹Œ\s*#?([0-9]+)/i);
  if (refMatch) {
    result.reference = '#' + refMatch[1];
  }

  const lines = text.split('\n');
  lines.forEach(line => {
    if (!line.trim()) return;
    const cleanLine = line.toLowerCase();

    let matchedProduct = null;
    let maxMatchLen = 0;

    state.products.forEach(p => {
      const parts = [p.name.toLowerCase()];
      const bracketIndex = p.name.indexOf('(');
      if (bracketIndex > -1) {
        const thaiPart = p.name.substring(0, bracketIndex).trim().toLowerCase();
        const engPart = p.name.substring(bracketIndex + 1, p.name.length - 1).trim().toLowerCase();
        if (thaiPart.length > 2) parts.push(thaiPart);
        if (engPart.length > 2) parts.push(engPart);
      }

      parts.forEach(part => {
        if (cleanLine.includes(part) && part.length > maxMatchLen) {
          matchedProduct = p;
          maxMatchLen = part.length;
        }
      });
    });

    if (matchedProduct) {
      let qty = 1;
      const qtyMatch = cleanLine.match(/(\d+)\s*x/) || cleanLine.match(/x\s*(\d+)/) || cleanLine.match(/(\d+)\s*(à¸Šà¸´à¹‰à¸™|à¹à¸à¹‰à¸§|à¸­à¸±à¸™)/);
      if (qtyMatch) {
        qty = parseInt(qtyMatch[1]);
      } else {
        const startNumber = cleanLine.match(/^\s*(\d+)\s+/);
        if (startNumber) {
          qty = parseInt(startNumber[1]);
        }
      }

      let sweetness = matchedProduct.category === 'drinks' ? 'à¸«à¸§à¸²à¸™à¸›à¸à¸•à¸´ (100%)' : '';
      if (matchedProduct.category === 'drinks') {
        if (cleanLine.includes('50%') || cleanLine.includes('à¸«à¸§à¸²à¸™à¸™à¹‰à¸­à¸¢') || cleanLine.includes('à¸«à¸§à¸²à¸™ 50%')) {
          sweetness = 'à¸«à¸§à¸²à¸™à¸™à¹‰à¸­à¸¢ (50%)';
        } else if (cleanLine.includes('25%') || cleanLine.includes('à¸«à¸§à¸²à¸™à¸™à¹‰à¸­à¸¢à¸¡à¸²à¸') || cleanLine.includes('à¸«à¸§à¸²à¸™ 25%')) {
          sweetness = 'à¸«à¸§à¸²à¸™à¸™à¹‰à¸­à¸¢à¸¡à¸²à¸ (25%)';
        } else if (cleanLine.includes('0%') || cleanLine.includes('à¹„à¸¡à¹ˆà¸«à¸§à¸²à¸™') || cleanLine.includes('à¸«à¸§à¸²à¸™ 0%')) {
          sweetness = 'à¹„à¸¡à¹ˆà¸«à¸§à¸²à¸™à¹€à¸¥à¸¢ (0%)';
        } else if (cleanLine.includes('120%') || cleanLine.includes('à¸«à¸§à¸²à¸™à¸¡à¸²à¸') || cleanLine.includes('à¸«à¸§à¸²à¸™ 120%')) {
          sweetness = 'à¸«à¸§à¸²à¸™à¸¡à¸²à¸ (120%)';
        }
      }

      let topping = '';
      let toppingPrice = 0;
      if (matchedProduct.category === 'drinks') {
        if (cleanLine.includes('à¹„à¸‚à¹ˆà¸¡à¸¸à¸')) {
          topping = 'à¹€à¸žà¸´à¹ˆà¸¡à¹„à¸‚à¹ˆà¸¡à¸¸à¸ (+10à¸¿)';
          toppingPrice = 10;
        } else if (cleanLine.includes('à¸žà¸¸à¸”à¸”à¸´à¹‰à¸‡')) {
          topping = 'à¹€à¸žà¸´à¹ˆà¸¡à¸žà¸¸à¸”à¸”à¸´à¹‰à¸‡à¸™à¸¡ (+15à¸¿)';
          toppingPrice = 15;
        } else if (cleanLine.includes('à¸šà¸¸à¸') || cleanLine.includes('à¸§à¸¸à¹‰à¸™')) {
          topping = 'à¹€à¸žà¸´à¹ˆà¸¡à¸šà¸¸à¸à¸§à¸¸à¹‰à¸™ (+10à¸¿)';
          toppingPrice = 10;
        } else if (cleanLine.includes('à¸§à¸´à¸›à¸„à¸£à¸µà¸¡') || cleanLine.includes('à¸§à¸´à¸›')) {
          topping = 'à¹€à¸žà¸´à¹ˆà¸¡à¸§à¸´à¸›à¸„à¸£à¸µà¸¡ (+15à¸¿)';
          toppingPrice = 15;
        }
      } else {
        if (cleanLine.includes('à¸­à¸¸à¹ˆà¸™') || cleanLine.includes('à¸£à¹‰à¸­à¸™')) {
          topping = 'à¸­à¸¸à¹ˆà¸™à¸£à¹‰à¸­à¸™';
        }
      }

      let notes = '';
      const parenthesesMatch = line.match(/[\(\[\{](.+?)[\)\]\}]/g);
      if (parenthesesMatch) {
        const collected = parenthesesMatch.map(m => m.slice(1, -1)).filter(n => {
          const l = n.toLowerCase();
          return !l.includes('à¸«à¸§à¸²à¸™') && !l.includes('%') && !l.includes('à¹„à¸‚à¹ˆà¸¡à¸¸à¸') && !l.includes('à¸žà¸¸à¸”à¸”à¸´à¹‰à¸‡') && !l.includes('à¸šà¸¸à¸') && !l.includes('à¸§à¸´à¸›') && !l.includes('à¸­à¸¸à¹ˆà¸™') && !l.includes('à¸£à¹‰à¸­à¸™');
        });
        if (collected.length > 0) {
          notes = collected.join(', ');
        }
      }

      result.items.push({
        product: matchedProduct,
        qty: qty,
        sweetness: sweetness,
        topping: topping,
        notes: notes,
        toppingPrice: toppingPrice
      });
    }
  });

  return result;
}

// ==========================================================================
// CHECKOUT EXECUTION (SAVE ORDER & TRIGGER WINDOW.PRINT)
// ==========================================================================
async function handleCheckout() {
  if (state.cart.length === 0) return;

  // Verify stock check
  for (let item of state.cart) {
    if (item.qty > item.product.stock) {
      alert(`à¸ªà¸´à¸™à¸„à¹‰à¸² "${item.product.name}" à¸¡à¸µà¸ˆà¸³à¸™à¸§à¸™à¸ªà¸´à¸™à¸„à¹‰à¸²à¹„à¸¡à¹ˆà¸žà¸­à¹ƒà¸™à¸ªà¸•à¹‡à¸­à¸ (à¸¡à¸µà¹€à¸«à¸¥à¸·à¸­à¹€à¸žà¸µà¸¢à¸‡ ${item.product.stock} à¸Šà¸´à¹‰à¸™)`);
      return;
    }
  }

  let subtotal = 0;
  let totalCost = 0;
  const listItems = state.cart.map(item => {
    const itemTotal = (item.product.price + item.toppingPrice) * item.qty;
    const itemCost = item.product.cost * item.qty;
    subtotal += itemTotal;
    totalCost += itemCost;
    
    const mods = [item.sweetness, item.topping].filter(Boolean).join(', ');
    return {
      name: item.product.name,
      qty: item.qty,
      price: item.product.price + item.toppingPrice,
      cost: item.product.cost,
      options: mods + (item.notes ? ` (à¹‚à¸™à¹‰à¸•: ${item.notes})` : '')
    };
  });

  // Calculate GP Commission
  const gpRate = state.gpRates[state.selectedChannel] || 0;
  const gpAmount = subtotal * (gpRate / 100);
  const netRevenue = subtotal - gpAmount;
  const profit = netRevenue - totalCost;

  const orderId = 'ord-' + Date.now();
  const orderDate = new Date().toISOString();

  const newOrder = {
    id: orderId,
    date: orderDate,
    channel: state.selectedChannel,
    reference: state.orderNumber ? (state.orderNumber.startsWith('#') ? state.orderNumber : '#' + state.orderNumber) : '',
    items: listItems,
    subtotal: subtotal,
    total: subtotal,
    totalCost: totalCost,
    gpRate: gpRate,
    gpAmount: gpAmount,
    netRevenue: netRevenue,
    profit: profit
  };

  // Add order to DB
  await saveDbOrder(newOrder);
  state.orders.unshift(newOrder);

  // Deduct inventory stock
  for (let item of state.cart) {
    const prod = state.products.find(p => p.id === item.product.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.qty);
      await saveDbProduct(prod);
    }
  }

  // Generate Receipt HTML inside print area
  const printArea = document.getElementById('print-area');
  const thaiDate = new Date(orderDate).toLocaleString('th-TH', { 
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  let channelLabel = 'à¸«à¸™à¹‰à¸²à¸£à¹‰à¸²à¸™ / à¸­à¸·à¹ˆà¸™à¹†';
  if (state.selectedChannel === 'lineman') channelLabel = 'LINE MAN';
  if (state.selectedChannel === 'grab') channelLabel = 'Grab';

  printArea.innerHTML = `
    <div class="receipt-container">
      <div class="receipt-header">
        <div class="receipt-title">${state.shopProfile.name}</div>
        <div class="receipt-subtitle">${state.shopProfile.address}</div>
        <div class="receipt-subtitle">à¹‚à¸—à¸£. ${state.shopProfile.phone}</div>
        <div class="receipt-channel-badge">${channelLabel} ${newOrder.reference}</div>
      </div>
      
      <div class="receipt-metadata">
        <div><strong>à¸šà¸´à¸¥à¹€à¸¥à¸‚à¸—à¸µà¹ˆ:</strong> ${newOrder.id.toUpperCase()}</div>
        <div><strong>à¸§à¸±à¸™à¸—à¸µà¹ˆà¸ªà¸±à¹ˆà¸‡:</strong> ${thaiDate}</div>
        <div><strong>à¸œà¸¹à¹‰à¸—à¸³à¸£à¸²à¸¢à¸à¸²à¸£:</strong> ${state.user.username}</div>
      </div>
      
      <table class="receipt-items-table">
        <thead>
          <tr>
            <th>à¸£à¸²à¸¢à¸à¸²à¸£</th>
            <th style="width: 15%; text-align: center;">à¸ˆà¸³à¸™à¸§à¸™</th>
            <th class="price-col" style="width: 25%;">à¸¢à¸­à¸”à¸£à¸§à¸¡</th>
          </tr>
        </thead>
        <tbody>
          ${newOrder.items.map(item => `
            <tr>
              <td>
                <div>${item.name}</div>
                ${item.options ? `<div class="receipt-item-details">${item.options}</div>` : ''}
              </td>
              <td style="text-align: center;">x${item.qty}</td>
              <td class="price-col">à¸¿${item.price * item.qty}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="receipt-summary">
        <div class="receipt-summary-row">
          <span>à¸ˆà¸³à¸™à¸§à¸™à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”</span>
          <span>${getCartItemsCount()} à¸Šà¸´à¹‰à¸™</span>
        </div>
        <div class="receipt-summary-row total">
          <span>à¸¢à¸­à¸”à¸£à¸§à¸¡à¸—à¸±à¹‰à¸‡à¸ªà¸´à¹‰à¸™</span>
          <span>à¸¿${newOrder.total}</span>
        </div>
      </div>
      
      <div class="receipt-footer">
        ${state.shopProfile.receiptFooter.split('\n').map(l => `<p>${l}</p>`).join('')}
      </div>
    </div>
  `;

  // Trigger print dialog
  window.print();

  // Clear shopping cart state and reload POS screen
  state.cart = [];
  state.orderNumber = '';
  
  const wrapper = document.getElementById('main-content-wrapper');
  renderPOS(wrapper);
}

// ==========================================================================

// BOOTSTRAP LOGIC FOR pos
async function init() {
  await initDatabase();
  await loadDatabase();
  loadSession();
  loadAppState();
  initDarkTheme();
  
  if (!state.user) {
    window.location.href = '../index.html';
    return;
  }
  
  renderMainLayout('pos');
  const container = document.getElementById('main-content-wrapper');
  if (container) {
    // Call the specific render function based on the page
    if ('pos' === 'pos') renderPOS(container);
    if ('pos' === 'inventory') renderInventory(container);
    if ('pos' === 'reports') renderReports(container);
    if ('pos' === 'history') renderHistory(container);
    if ('pos' === 'purchasing') renderPurchasing(container);
    if ('pos' === 'settings') renderSettings(container);
  }
}

window.addEventListener('DOMContentLoaded', init);
