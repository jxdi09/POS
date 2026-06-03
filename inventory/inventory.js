�// TAB 2: INVENTORY & COSTING VIEW
// ==========================================================================
function renderInventory(container) {
  state.editingProductId = null;
  
  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">ระ�a�a��ั�การสิ�"��0าและ�ำ�"ว��"�0�"�ุ�"</h2>
      <button class="btn-add-product" id="btn-show-add-form" style="display: none;">๬�~ิ��มสิ�"��0า๒หม��</button>
    </div>
    
    <div class="inventory-grid">
      <!-- Left Form Sidebar -->
      <div class="inventory-form-panel" id="product-form-container"></div>
      
      <!-- Right Products Table -->
      <div class="inventory-list-panel">
        <div class="panel-title" style="margin: 24px 24px 0 24px; border: none; padding: 0;">รายการสิ�"��0า๒�"ร�0า�"</div>
        <div class="table-responsive">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>รายละ๬อีย�สิ�"��0า</th>
                <th>หมว�หมู��</th>
                <th>รา�า�าย</th>
                <th>�"�0�"�ุ�"สิ�"��0า</th>
                <th>กำ�ร�"��อ�`ิ�0�"</th>
                <th>ส�"�!อก</th>
                <th style="text-align: center;">��ั�การ</th>
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
    <div class="panel-title">${isEditing ? 'แก�0����0อมูลสิ�"��0า' : '๬�~ิ��มสิ�"��0า๒หม��'}</div>
    <form id="product-form">
      <div class="form-group">
        <label class="form-label">รู�:ภา�~สิ�"��0า</label>
        <div class="image-upload-box" id="image-upload-trigger">
          ${product && product.image ? `
            <img src="${product.image}" id="product-preview" alt="preview">
          ` : `
            <div class="upload-placeholder" id="upload-placeholder-content">
              <svg viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>แ�"ะ๬�~ื��อ๬ลือกรู�:ภา�~</span>
            </div>
          `}
          <input type="file" id="product-image-file" accept="image/*" style="display: none;">
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label" for="prod-name">�`ื��อสิ�"��0า</label>
        <input class="form-input" type="text" id="prod-name" placeholder="๬�`���" �`า�"ม�aั�a๬�aิ�0ล" value="${product ? product.name : ''}" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-category">หมว�หมู��</label>
        <select class="form-input" id="prod-category" required>
          <option value="drinks" ${product && product.category === 'drinks' ? 'selected' : ''}>๬�รื��อ�!�ื��ม (Drinks)</option>
          <option value="snacks" ${product && product.category === 'snacks' ? 'selected' : ''}>��"ม/๬�a๬กอรี�� (Snacks)</option>
          <option value="others" ${product && product.category === 'others' ? 'selected' : ''}>อื���"�  (Others)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-price">รา�า�าย (�aา�)</label>
        <input class="form-input" type="number" id="prod-price" placeholder="๬�`���" 60" value="${product ? product.price : ''}" required min="0" step="any">
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-cost">�"�0�"�ุ�"�"��อห�"��วย (�aา�) <span style="color: var(--text-secondary); font-weight: normal;">*สำหรั�a�ำ�"ว�กำ�ร</span></label>
        <input class="form-input" type="number" id="prod-cost" placeholder="๬�`���" 20" value="${product ? product.cost : ''}" required min="0" step="any">
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-stock">��ำ�"ว�"ส�"�!อก๬ริ��ม�"�0�"</label>
        <input class="form-input" type="number" id="prod-stock" placeholder="๬�`���" 100" value="${product ? product.stock : ''}" required min="0">
      </div>

      <div style="display: flex; gap: 10px; margin-top: 24px;">
        ${isEditing ? `<button class="btn-secondary" type="button" id="btn-cancel-edit" style="padding: 12px; flex: 1;">ยก๬ลิก</button>` : ''}
        <button class="btn-primary" type="submit" style="padding: 12px; flex: 2;">
          ${isEditing ? '�aั�"�ึกการแก�0��' : '�aั�"�ึกสิ�"��0า๒หม��'}
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
      if (!confirm('�ำ๬�"ือ�": รา�า�าย�"�0อยกว��า�"�0�"�ุ�"สิ�"��0า แ�"��๒��หรือ�ม��ว��า�"�0อ�!การ�"ั�0�!���ารา�า�"ี�0?')) {
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

    let catName = 'อื���"� ';
    if (p.category === 'drinks') catName = '๬�รื��อ�!�ื��ม';
    if (p.category === 'snacks') catName = '��"ม/๬�a๬กอรี��';

    tr.innerHTML = `
      <td>
        <div class="row-product-info">
          ${p.image ? `<img src="${p.image}" class="row-product-thumb" alt="thumb">` : `<div class="row-product-thumb" style="display: flex; align-items: center; justify-content: center; font-size: 20px;">${p.category === 'drinks' ? '�x��' : '�x��'}</div>`}
          <div style="font-weight: 600;">${p.name}</div>
        </div>
      </td>
      <td><span style="color: var(--text-secondary);">${catName}</span></td>
      <td style="font-family: var(--font-latin); font-weight: 600;">฿${p.price}</td>
      <td style="font-family: var(--font-latin); color: var(--text-secondary);">฿${p.cost}</td>
      <td style="font-family: var(--font-latin);">
        <div style="font-weight: 600; color: ${profit >= 0 ? 'var(--secondary)' : '#FF4D4F'}">฿${profit}</div>
        <span class="margin-pill ${marginClass}">${margin}% มาร�R��ิ�"</span>
      </td>
      <td style="font-family: var(--font-latin); font-weight: 600; color: ${p.stock <= 5 ? '#FF4D4F' : 'inherit'}">${p.stock}</td>
      <td style="text-align: center;">
        <div class="action-buttons" style="justify-content: center;">
          <button class="btn-icon btn-edit-product" data-id="${p.id}" title="แก�0��">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon btn-delete-product" data-id="${p.id}" title="ล�a">
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
      if (confirm(`�ุ�แ�"��๒��หรือ�ม��ว��า�"�0อ�!การล�aสิ�"��0า "${targetP.name}"?`)) {
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
