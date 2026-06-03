�// TAB 1: POS VIEW & LOGIC
// ==========================================================================
function renderPOS(container) {
  container.innerHTML = `
    <div class="pos-layout">
      <!-- Left Panel: Grid & Categories -->
      <div class="pos-catalog">
        <div class="catalog-header">
          <div class="search-bar">
            <svg viewBox="0 0 24 24" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="search-input" type="text" id="catalog-search" placeholder="��0�"หา๬ม�"ู๬�รื��อ�!�ื��ม / ��"ม..." value="${state.searchQuery}">
          </div>
        </div>
        
        <!-- Category Tab Bar -->
        <div class="categories-tabs">
          <button class="category-tab ${state.selectedCategory === 'all' ? 'active' : ''}" data-cat="all">�ั�0�!หม�</button>
          <button class="category-tab ${state.selectedCategory === 'drinks' ? 'active' : ''}" data-cat="drinks">๬�รื��อ�!�ื��ม (Drinks)</button>
          <button class="category-tab ${state.selectedCategory === 'snacks' ? 'active' : ''}" data-cat="snacks">��"ม/๬�a๬กอรี�� (Snacks)</button>
          <button class="category-tab ${state.selectedCategory === 'others' ? 'active' : ''}" data-cat="others">อื���"�  (Others)</button>
        </div>

        <!-- Product Grid -->
        <div class="products-grid" id="pos-products-grid"></div>
      </div>

      <!-- Right Panel: Shopping Cart -->
      <div class="pos-cart">
        <div class="cart-header">
          <div class="cart-title">
            ออร�R๬�อร�R�:ั����ุ�aั�"
            <span class="cart-count">${getCartItemsCount()}</span>
          </div>
          <button class="cart-clear" id="btn-clear-cart">ล�0า�!�"ะกร�0า</button>
        </div>

        <div class="cart-items" id="pos-cart-items"></div>

        <!-- Channel Select (Line Man, Grab, Walk-in) -->
        <div class="cart-channel-section">
          <label class="channel-label">�`��อ�!�า�!รั�aออร�R๬�อร�R</label>
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
              ห�"�0าร�0า�" / อื���"� 
            </button>
          </div>
          <button class="quick-paste-btn" id="btn-quick-paste">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            �a� �ีย�Rออร�R๬�อร�R���ว�"��าก Grab/LINE MAN
          </button>
        </div>

        <!-- Cart Summary & Checkout -->
        <div class="cart-summary">
          ${state.selectedChannel !== 'walkin' ? `
            <input class="order-num-input" type="text" id="order-reference" placeholder="รหัสออร�R๬�อร�R๬�ลิ๬วอรี�� (๬�`���" #4528)" value="${state.orderNumber}">
          ` : ''}
          <div class="summary-row">
            <span>��ำ�"ว�"�ั�0�!หม�</span>
            <span id="summary-qty">${getCartItemsCount()} �`ิ�0�"</span>
          </div>
          <div class="summary-row total">
            <span>ยอ�รวมสุ���ิ</span>
            <span class="total-val">฿<span id="summary-total">${getCartTotal()}</span></span>
          </div>
          <button class="checkout-btn" id="btn-checkout" ${state.cart.length === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            ยื�"ยั�"การสั���!�9ื�0อ &amp; �~ิม�~�R๒�aสั���!�อ�!
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
        <p>�ม���~�aรายการสิ�"��0า�ี��ระ�aุ</p>
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
        ${p.image ? `<img src="${p.image}" class="product-img" alt="${p.name}">` : `<div class="product-placeholder">${p.category === 'drinks' ? '�x��' : '�x��'}</div>`}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <span class="product-price">฿${p.price}</span>
          <span class="product-stock ${isOutOfStock ? 'out' : ''}">${isOutOfStock ? 'หม�' : `�ลั�!: ${p.stock}`}</span>
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
        <p>ยั�!�ม��มีสิ�"��0า๒�"�"ะกร�0า</p>
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
              ${item.notes ? `<span style="color: var(--primary);">��"�0�": ${item.notes}</span>` : ''}
            </div>
          ` : ''}
        </div>
        <div class="cart-item-price-col">
          <div class="cart-item-total">฿${itemTotal}</div>
        </div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-item-notes-btn" data-index="${index}">แก�0����"�0�"</button>
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
          alert(`�ม��สามาร�๬�~ิ��ม��ำ�"ว�"���0 สิ�"��0า๒�"�ลั�!มี��ำกั� (${product.stock} �`ิ�0�")`);
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
      const newNote = prompt('๬�~ิ��ม�ำแ�"ะ�"ำ�~ิ๬ศษ/��"�0�"สำหรั�aรายการ�"ี�0:', state.cart[idx].notes || '');
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

  if (qtyEl) qtyEl.textContent = `${count} �`ิ�0�"`;
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
          รา�า�~ื�0�"ฐา�": ฿${product.price}
        </div>

        ${isDrink ? `
          <!-- Sweetness Levels -->
          <div class="modifier-group">
            <div class="modifier-label">ระ�ั�a�วามหวา�"</div>
            <div class="modifier-options" id="options-sweetness">
              <button class="modifier-btn" data-val="หวา�"�:ก�"ิ (100%)">100%</button>
              <button class="modifier-btn" data-val="หวา�"�"�0อย (50%)">50%</button>
              <button class="modifier-btn" data-val="หวา�"�"�0อยมาก (25%)">25%</button>
              <button class="modifier-btn" data-val="�ม��หวา�"๬ลย (0%)">0%</button>
              <button class="modifier-btn" data-val="หวา�"มาก (120%)">120%</button>
            </div>
          </div>

          <!-- Toppings -->
          <div class="modifier-group">
            <div class="modifier-label">��!อ�:�:ิ�0�!๬�~ิ��ม๬�"ิม</div>
            <div class="modifier-options" id="options-toppings">
              <button class="modifier-btn selected" data-val="" data-price="0">�ม��รั�a��!อ�:�:ิ�0�!</button>
              <button class="modifier-btn" data-val="๬�~ิ��ม����มุก (+10฿)" data-price="10">����มุก (+฿10)</button>
              <button class="modifier-btn" data-val="๬�~ิ��ม�~ุ��ิ�0�!�"ม (+15฿)" data-price="15">�~ุ��ิ�0�!�"ม (+฿15)</button>
              <button class="modifier-btn" data-val="๬�~ิ��ม�aุกวุ�0�" (+10฿)" data-price="10">�aุกวุ�0�" (+฿10)</button>
              <button class="modifier-btn" data-val="๬�~ิ��มวิ�:�รีม (+15฿)" data-price="15">วิ�:�รีม (+฿15)</button>
            </div>
          </div>
        ` : `
          <!-- Option for snacks: Heat / Warm up -->
          <div class="modifier-group">
            <div class="modifier-label">�aริการอุ���"ร�0อ�"</div>
            <div class="modifier-options" id="options-warm">
              <button class="modifier-btn selected" data-val="">�ม���"�0อ�!อุ���"</button>
              <button class="modifier-btn" data-val="อุ���"ร�0อ�"">อุ���"ร�0อ�"๒ห�0ร�0อ�"�~ร�0อม�า�"</button>
            </div>
          </div>
        `}

        <div class="form-group" style="margin-top: 15px;">
          <label class="form-label" style="font-size: 13px;">�ำ�อ๬�~ิ��ม๬�"ิม�ึ�!ร�0า�"��0า (��"�0�")</label>
          <input class="form-input" type="text" id="modal-notes" placeholder="๬�`���" แยก�"�0ำแ��!�!, หวา�"��รรม�`า�"ิ...">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" id="modal-cancel-btn">ยก๬ลิก</button>
        <button class="btn-primary" id="modal-add-btn">๒ส���"ะกร�0า (฿${product.price})</button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('modal-close-btn').addEventListener('click', closeModifierModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModifierModal);

  let selectedSweetness = isDrink ? 'หวา�"�:ก�"ิ (100%)' : '';
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
        document.getElementById('modal-add-btn').textContent = `๒ส���"ะกร�0า (฿${product.price + toppingPrice})`;
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
        alert(`�ม��สามาร�๬�~ิ��ม��ำ�"ว�"���0 สิ�"��0า๒�"�ลั�!มี��ำกั� (${product.stock} �`ิ�0�")`);
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
        <h3 class="modal-title">�ีย�Rออร�R๬�อร�R���ว�"��0วยการวา�!��0อ�วาม</h3>
        <button class="modal-close" id="paste-modal-close-btn">&times;</button>
      </div>
      <div class="modal-body paste-modal-body">
        <p class="paste-help-text">
          �ั�ลอกรายละ๬อีย��ำสั���!�9ื�0อ��ากแอ�: LINE MAN หรือ Grab แล�0ววา�!ล�!๒�"�`��อ�!�"ี�0 ระ�a�a��ะวิ๬�ราะห�Rหา�`ื��อ๬ม�"ู ��ำ�"ว�" �วามหวา�" และ��!อ�:�:ิ�0�! ๬�~ื��อแอ�ล�!�aิล๒ห�0�ั�"�ี��ย�ม���"�0อ�!�ีย�Rแยก�`ิ�0�"
        </p>
        <textarea class="paste-textarea" id="paste-textarea-input" placeholder="�"ัวอย��า�!��0อ�วาม:
LINE MAN ออร�R๬�อร�R #4821
2x �`า�"ม��"�0หวั�"�aั�a๬�aิ�0ล (Bubble Milk Tea) (หวา�"�"�0อย (50%), ๬�~ิ��ม����มุก)
1x �aราว�"ี���าร�Rก�`�!อก�กแล�" (Dark Chocolate Brownie) (อุ���"ร�0อ�")"></textarea>
        <div class="paste-help-text">
          <strong>�ุ�สม�aั�"ิการ�"รว����ั�a:</strong>
          <ul>
            <li>๬�:รีย�a๬�ีย�a�ำและ��0�"หา๬ม�"ู๒�"ร�0า�" (รอ�!รั�aภาษา��ย และภาษาอั�!กฤษ)</li>
            <li>�"รว����ั�a��ำ�"ว�" ๬�`���" 1x, x2 หรือ 1 �`ิ�0�"</li>
            <li>�"รว����ั�a�วามหวา�" (0%, 25%, 50%, 100%, 120%) และการอุ���"ร�0อ�"</li>
            <li>�"รว����ั�aรหัสออร�R๬�อร�R��ากหัว��0อ (๬�`���" #4821)</li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" id="paste-modal-cancel-btn">ยก๬ลิก</button>
        <button class="btn-primary" id="paste-modal-import-btn">�"ำ๬��0า�"ะกร�0าสิ�"��0า</button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('paste-modal-close-btn').addEventListener('click', closePasteModal);
  document.getElementById('paste-modal-cancel-btn').addEventListener('click', closePasteModal);
  
  document.getElementById('paste-modal-import-btn').addEventListener('click', () => {
    const text = document.getElementById('paste-textarea-input').value;
    if (!text.trim()) {
      alert('กรุ�ากรอก��0อ�วามสรุ�:ออร�R๬�อร�R');
      return;
    }
    
    const parsed = parsePastedOrder(text);
    if (parsed.items.length === 0) {
      alert('วิ๬�ราะห�R�ม��สำ๬ร�!��: �ม���~�aราย�`ื��อสิ�"��0า๒�"��0อ�วาม�ี���"ร�!กั�a๬ม�"ู�อ�!ร�0า�"��0า กรุ�า�"รว��๬�`�!��"ัวสะก��`ื��อ๬ม�"ู๒ห�0�"ร�!กั�"');
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
  if (lowerText.includes('line man') || lowerText.includes('lineman') || lowerText.includes('�ล�"�Rแม�"')) {
    result.channel = 'lineman';
  } else if (lowerText.includes('grab') || lowerText.includes('แกร�!�a')) {
    result.channel = 'grab';
  }

  // Detect reference number
  const refMatch = text.match(/#([a-zA-Z0-9-]+)/) || text.match(/ออร�R๬�อร�R\s*#?([0-9]+)/i);
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
      const qtyMatch = cleanLine.match(/(\d+)\s*x/) || cleanLine.match(/x\s*(\d+)/) || cleanLine.match(/(\d+)\s*(�`ิ�0�"|แก�0ว|อั�")/);
      if (qtyMatch) {
        qty = parseInt(qtyMatch[1]);
      } else {
        const startNumber = cleanLine.match(/^\s*(\d+)\s+/);
        if (startNumber) {
          qty = parseInt(startNumber[1]);
        }
      }

      let sweetness = matchedProduct.category === 'drinks' ? 'หวา�"�:ก�"ิ (100%)' : '';
      if (matchedProduct.category === 'drinks') {
        if (cleanLine.includes('50%') || cleanLine.includes('หวา�"�"�0อย') || cleanLine.includes('หวา�" 50%')) {
          sweetness = 'หวา�"�"�0อย (50%)';
        } else if (cleanLine.includes('25%') || cleanLine.includes('หวา�"�"�0อยมาก') || cleanLine.includes('หวา�" 25%')) {
          sweetness = 'หวา�"�"�0อยมาก (25%)';
        } else if (cleanLine.includes('0%') || cleanLine.includes('�ม��หวา�"') || cleanLine.includes('หวา�" 0%')) {
          sweetness = '�ม��หวา�"๬ลย (0%)';
        } else if (cleanLine.includes('120%') || cleanLine.includes('หวา�"มาก') || cleanLine.includes('หวา�" 120%')) {
          sweetness = 'หวา�"มาก (120%)';
        }
      }

      let topping = '';
      let toppingPrice = 0;
      if (matchedProduct.category === 'drinks') {
        if (cleanLine.includes('����มุก')) {
          topping = '๬�~ิ��ม����มุก (+10฿)';
          toppingPrice = 10;
        } else if (cleanLine.includes('�~ุ��ิ�0�!')) {
          topping = '๬�~ิ��ม�~ุ��ิ�0�!�"ม (+15฿)';
          toppingPrice = 15;
        } else if (cleanLine.includes('�aุก') || cleanLine.includes('วุ�0�"')) {
          topping = '๬�~ิ��ม�aุกวุ�0�" (+10฿)';
          toppingPrice = 10;
        } else if (cleanLine.includes('วิ�:�รีม') || cleanLine.includes('วิ�:')) {
          topping = '๬�~ิ��มวิ�:�รีม (+15฿)';
          toppingPrice = 15;
        }
      } else {
        if (cleanLine.includes('อุ���"') || cleanLine.includes('ร�0อ�"')) {
          topping = 'อุ���"ร�0อ�"';
        }
      }

      let notes = '';
      const parenthesesMatch = line.match(/[\(\[\{](.+?)[\)\]\}]/g);
      if (parenthesesMatch) {
        const collected = parenthesesMatch.map(m => m.slice(1, -1)).filter(n => {
          const l = n.toLowerCase();
          return !l.includes('หวา�"') && !l.includes('%') && !l.includes('����มุก') && !l.includes('�~ุ��ิ�0�!') && !l.includes('�aุก') && !l.includes('วิ�:') && !l.includes('อุ���"') && !l.includes('ร�0อ�"');
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
      alert(`สิ�"��0า "${item.product.name}" มี��ำ�"ว�"สิ�"��0า�ม���~อ๒�"ส�"�!อก (มี๬หลือ๬�~ีย�! ${item.product.stock} �`ิ�0�")`);
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
      options: mods + (item.notes ? ` (��"�0�": ${item.notes})` : '')
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

  let channelLabel = 'ห�"�0าร�0า�" / อื���"� ';
  if (state.selectedChannel === 'lineman') channelLabel = 'LINE MAN';
  if (state.selectedChannel === 'grab') channelLabel = 'Grab';

  printArea.innerHTML = `
    <div class="receipt-container">
      <div class="receipt-header">
        <div class="receipt-title">${state.shopProfile.name}</div>
        <div class="receipt-subtitle">${state.shopProfile.address}</div>
        <div class="receipt-subtitle">��ร. ${state.shopProfile.phone}</div>
        <div class="receipt-channel-badge">${channelLabel} ${newOrder.reference}</div>
      </div>
      
      <div class="receipt-metadata">
        <div><strong>�aิล๬ล��ี��:</strong> ${newOrder.id.toUpperCase()}</div>
        <div><strong>วั�"�ี��สั���!:</strong> ${thaiDate}</div>
        <div><strong>�Sู�0�ำรายการ:</strong> ${state.user.username}</div>
      </div>
      
      <table class="receipt-items-table">
        <thead>
          <tr>
            <th>รายการ</th>
            <th style="width: 15%; text-align: center;">��ำ�"ว�"</th>
            <th class="price-col" style="width: 25%;">ยอ�รวม</th>
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
              <td class="price-col">฿${item.price * item.qty}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="receipt-summary">
        <div class="receipt-summary-row">
          <span>��ำ�"ว�"�ั�0�!หม�</span>
          <span>${getCartItemsCount()} �`ิ�0�"</span>
        </div>
        <div class="receipt-summary-row total">
          <span>ยอ�รวม�ั�0�!สิ�0�"</span>
          <span>฿${newOrder.total}</span>
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
