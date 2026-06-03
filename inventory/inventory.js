// TAB 2: INVENTORY & COSTING VIEW
// ==========================================================================
function renderInventory(container) {
  state.editingProductId = null;
  
  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">à¸£à¸°à¸šà¸šà¸ˆà¸±à¸”à¸à¸²à¸£à¸ªà¸´à¸™à¸„à¹‰à¸²à¹à¸¥à¸°à¸„à¸³à¸™à¸§à¸“à¸•à¹‰à¸™à¸—à¸¸à¸™</h2>
      <button class="btn-add-product" id="btn-show-add-form" style="display: none;">à¹€à¸žà¸´à¹ˆà¸¡à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸«à¸¡à¹ˆ</button>
    </div>
    
    <div class="inventory-grid">
      <!-- Left Form Sidebar -->
      <div class="inventory-form-panel" id="product-form-container"></div>
      
      <!-- Right Products Table -->
      <div class="inventory-list-panel">
        <div class="panel-title" style="margin: 24px 24px 0 24px; border: none; padding: 0;">à¸£à¸²à¸¢à¸à¸²à¸£à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸™à¸£à¹‰à¸²à¸™</div>
        <div class="table-responsive">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸ªà¸´à¸™à¸„à¹‰à¸²</th>
                <th>à¸«à¸¡à¸§à¸”à¸«à¸¡à¸¹à¹ˆ</th>
                <th>à¸£à¸²à¸„à¸²à¸‚à¸²à¸¢</th>
                <th>à¸•à¹‰à¸™à¸—à¸¸à¸™à¸ªà¸´à¸™à¸„à¹‰à¸²</th>
                <th>à¸à¸³à¹„à¸£à¸•à¹ˆà¸­à¸Šà¸´à¹‰à¸™</th>
                <th>à¸ªà¸•à¹‡à¸­à¸</th>
                <th style="text-align: center;">à¸ˆà¸±à¸”à¸à¸²à¸£</th>
              </tr>
            </thead>
            <tbody id="inventory-table-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  renderProductForm();
  renderInventoryTable();
}

function renderProductForm() {
  const formBox = document.getElementById('product-form-container');
  if (!formBox) return;

  const product = state.products.find(p => p.id === state.editingProductId);
  const isEditing = !!product;

  formBox.innerHTML = `
    <div class="panel-title">${isEditing ? 'à¹à¸à¹‰à¹„à¸‚à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¸´à¸™à¸„à¹‰à¸²' : 'à¹€à¸žà¸´à¹ˆà¸¡à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸«à¸¡à¹ˆ'}</div>
    <form id="product-form">
      <div class="form-group">
        <label class="form-label">à¸£à¸¹à¸›à¸ à¸²à¸žà¸ªà¸´à¸™à¸„à¹‰à¸²</label>
        <div class="image-upload-box" id="image-upload-trigger">
          ${product && product.image ? `
            <img src="${product.image}" id="product-preview" alt="preview">
          ` : `
            <div class="upload-placeholder" id="upload-placeholder-content">
              <svg viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>à¹à¸•à¸°à¹€à¸žà¸·à¹ˆà¸­à¹€à¸¥à¸·à¸­à¸à¸£à¸¹à¸›à¸ à¸²à¸ž</span>
            </div>
          `}
          <input type="file" id="product-image-file" accept="image/*" style="display: none;">
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label" for="prod-name">à¸Šà¸·à¹ˆà¸­à¸ªà¸´à¸™à¸„à¹‰à¸²</label>
        <input class="form-input" type="text" id="prod-name" placeholder="à¹€à¸Šà¹ˆà¸™ à¸Šà¸²à¸™à¸¡à¸šà¸±à¸šà¹€à¸šà¸´à¹‰à¸¥" value="${product ? product.name : ''}" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-category">à¸«à¸¡à¸§à¸”à¸«à¸¡à¸¹à¹ˆ</label>
        <select class="form-input" id="prod-category" required>
          <option value="drinks" ${product && product.category === 'drinks' ? 'selected' : ''}>à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸”à¸·à¹ˆà¸¡ (Drinks)</option>
          <option value="snacks" ${product && product.category === 'snacks' ? 'selected' : ''}>à¸‚à¸™à¸¡/à¹€à¸šà¹€à¸à¸­à¸£à¸µà¹ˆ (Snacks)</option>
          <option value="others" ${product && product.category === 'others' ? 'selected' : ''}>à¸­à¸·à¹ˆà¸™à¹† (Others)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-price">à¸£à¸²à¸„à¸²à¸‚à¸²à¸¢ (à¸šà¸²à¸—)</label>
        <input class="form-input" type="number" id="prod-price" placeholder="à¹€à¸Šà¹ˆà¸™ 60" value="${product ? product.price : ''}" required min="0" step="any">
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-cost">à¸•à¹‰à¸™à¸—à¸¸à¸™à¸•à¹ˆà¸­à¸«à¸™à¹ˆà¸§à¸¢ (à¸šà¸²à¸—) <span style="color: var(--text-secondary); font-weight: normal;">*à¸ªà¸³à¸«à¸£à¸±à¸šà¸„à¸³à¸™à¸§à¸“à¸à¸³à¹„à¸£</span></label>
        <input class="form-input" type="number" id="prod-cost" placeholder="à¹€à¸Šà¹ˆà¸™ 20" value="${product ? product.cost : ''}" required min="0" step="any">
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-stock">à¸ˆà¸³à¸™à¸§à¸™à¸ªà¸•à¹‡à¸­à¸à¹€à¸£à¸´à¹ˆà¸¡à¸•à¹‰à¸™</label>
        <input class="form-input" type="number" id="prod-stock" placeholder="à¹€à¸Šà¹ˆà¸™ 100" value="${product ? product.stock : ''}" required min="0">
      </div>

      <div style="display: flex; gap: 10px; margin-top: 24px;">
        ${isEditing ? `<button class="btn-secondary" type="button" id="btn-cancel-edit" style="padding: 12px; flex: 1;">à¸¢à¸à¹€à¸¥à¸´à¸</button>` : ''}
        <button class="btn-primary" type="submit" style="padding: 12px; flex: 2;">
          ${isEditing ? 'à¸šà¸±à¸™à¸—à¸¶à¸à¸à¸²à¸£à¹à¸à¹‰à¹„à¸‚' : 'à¸šà¸±à¸™à¸—à¸¶à¸à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸«à¸¡à¹ˆ'}
        </button>
      </div>
    </form>
  `;

  const uploadTrigger = document.getElementById('image-upload-trigger');
  const fileInput = document.getElementById('product-image-file');

  uploadTrigger.addEventListener('click', () => fileInput.click());
  
  let base64Image = product ? product.image : '';

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        base64Image = evt.target.result;
        uploadTrigger.innerHTML = `<img src="${base64Image}" id="product-preview" alt="preview">`;
      };
      reader.readAsDataURL(file);
    }
  });

  if (isEditing) {
    document.getElementById('btn-cancel-edit').addEventListener('click', () => {
      state.editingProductId = null;
      renderProductForm();
    });
  }

  // Handle Form Submit
  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const cost = parseFloat(document.getElementById('prod-cost').value);
    const stock = parseInt(document.getElementById('prod-stock').value);

    if (price < cost) {
      if (!confirm('à¸„à¸³à¹€à¸•à¸·à¸­à¸™: à¸£à¸²à¸„à¸²à¸‚à¸²à¸¢à¸™à¹‰à¸­à¸¢à¸à¸§à¹ˆà¸²à¸•à¹‰à¸™à¸—à¸¸à¸™à¸ªà¸´à¸™à¸„à¹‰à¸² à¹à¸™à¹ˆà¹ƒà¸ˆà¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆà¸§à¹ˆà¸²à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¸•à¸±à¹‰à¸‡à¸„à¹ˆà¸²à¸£à¸²à¸„à¸²à¸™à¸µà¹‰?')) {
        return;
      }
    }

    let pId = isEditing ? state.editingProductId : 'p-' + Date.now();
    const prodObj = {
      id: pId,
      name, category, price, cost, stock,
      image: base64Image
    };

    await saveDbProduct(prodObj);

    if (isEditing) {
      const pIdx = state.products.findIndex(p => p.id === state.editingProductId);
      if (pIdx > -1) {
        state.products[pIdx] = prodObj;
      }
      state.editingProductId = null;
    } else {
      state.products.push(prodObj);
    }

    renderProductForm();
    renderInventoryTable();
  });
}

function renderInventoryTable() {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  state.products.forEach(p => {
    const tr = document.createElement('tr');
    
    const profit = p.price - p.cost;
    const margin = p.price > 0 ? Math.round((profit / p.price) * 100) : 0;
    
    let marginClass = 'high';
    if (margin < 25) marginClass = 'low';
    else if (margin < 50) marginClass = 'medium';

    let catName = 'à¸­à¸·à¹ˆà¸™à¹†';
    if (p.category === 'drinks') catName = 'à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸”à¸·à¹ˆà¸¡';
    if (p.category === 'snacks') catName = 'à¸‚à¸™à¸¡/à¹€à¸šà¹€à¸à¸­à¸£à¸µà¹ˆ';

    tr.innerHTML = `
      <td>
        <div class="row-product-info">
          ${p.image ? `<img src="${p.image}" class="row-product-thumb" alt="thumb">` : `<div class="row-product-thumb" style="display: flex; align-items: center; justify-content: center; font-size: 20px;">${p.category === 'drinks' ? 'ðŸ¥¤' : 'ðŸ°'}</div>`}
          <div style="font-weight: 600;">${p.name}</div>
        </div>
      </td>
      <td><span style="color: var(--text-secondary);">${catName}</span></td>
      <td style="font-family: var(--font-latin); font-weight: 600;">à¸¿${p.price}</td>
      <td style="font-family: var(--font-latin); color: var(--text-secondary);">à¸¿${p.cost}</td>
      <td style="font-family: var(--font-latin);">
        <div style="font-weight: 600; color: ${profit >= 0 ? 'var(--secondary)' : '#FF4D4F'}">à¸¿${profit}</div>
        <span class="margin-pill ${marginClass}">${margin}% à¸¡à¸²à¸£à¹Œà¸ˆà¸´à¸™</span>
      </td>
      <td style="font-family: var(--font-latin); font-weight: 600; color: ${p.stock <= 5 ? '#FF4D4F' : 'inherit'}">${p.stock}</td>
      <td style="text-align: center;">
        <div class="action-buttons" style="justify-content: center;">
          <button class="btn-icon btn-edit-product" data-id="${p.id}" title="à¹à¸à¹‰à¹„à¸‚">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon btn-delete-product" data-id="${p.id}" title="à¸¥à¸š">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      </td>
    `;

    tr.querySelector('.btn-edit-product').addEventListener('click', (e) => {
      state.editingProductId = e.currentTarget.dataset.id;
      renderProductForm();
      document.getElementById('product-form-container').scrollIntoView({ behavior: 'smooth' });
    });

    tr.querySelector('.btn-delete-product').addEventListener('click', async (e) => {
      const pid = e.currentTarget.dataset.id;
      const targetP = state.products.find(p => p.id === pid);
      if (confirm(`à¸„à¸¸à¸“à¹à¸™à¹ˆà¹ƒà¸ˆà¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆà¸§à¹ˆà¸²à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¸¥à¸šà¸ªà¸´à¸™à¸„à¹‰à¸² "${targetP.name}"?`)) {
        await deleteDbProduct(pid);
        state.products = state.products.filter(p => p.id !== pid);
        if (state.editingProductId === pid) state.editingProductId = null;
        renderProductForm();
        renderInventoryTable();
      }
    });

    tbody.appendChild(tr);
  });
}

// ==========================================================================

// BOOTSTRAP LOGIC FOR inventory
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
  
  renderMainLayout('inventory');
  const container = document.getElementById('main-content-wrapper');
  if (container) {
    // Call the specific render function based on the page
    if ('inventory' === 'pos') renderPOS(container);
    if ('inventory' === 'inventory') renderInventory(container);
    if ('inventory' === 'reports') renderReports(container);
    if ('inventory' === 'history') renderHistory(container);
    if ('inventory' === 'purchasing') renderPurchasing(container);
    if ('inventory' === 'settings') renderSettings(container);
  }
}

window.addEventListener('DOMContentLoaded', init);
