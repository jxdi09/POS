�// TAB: PURCHASING & MATERIALS VIEW
// ==========================================================================
function renderPurchasing(container) {
  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">ระ�a�a��ั��9ื�0อวั�"�ุ�ิ�aและอุ�:กร��R</h2>
    </div>

    <div class="settings-grid">
      <!-- Add Material Form -->
      <div class="inventory-form-panel">
        <div class="panel-title">๬�~ิ��มวั�"�ุ�ิ�a/ภา�`�"ะ๒หม��</div>
        <form id="form-add-material">
          <div class="form-group">
            <label class="form-label" for="mat-name">�`ื��อรายการ (๬�`���" แก�0ว 16oz, �"�0ำ�"าล�ราย)</label>
            <input class="form-input" type="text" id="mat-name" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="mat-unit">ห�"��วย�"ั�a (๬�`���" แ�ว, kg, แ�~�!�)</label>
            <input class="form-input" type="text" id="mat-unit" required>
          </div>
          <button class="btn-primary" type="submit" style="width:100%; padding:12px;">�aั�"�ึกรายการวั�"�ุ�ิ�a</button>
        </form>
      </div>

      <!-- Record Purchase Form -->
      <div class="inventory-form-panel">
        <div class="panel-title">�aั�"�ึกการ�9ื�0อ</div>
        <form id="form-add-purchase">
          <div class="form-group">
            <label class="form-label" for="pur-material">๬ลือกวั�"�ุ�ิ�a</label>
            <select class="form-input" id="pur-material" required>
              <option value="">-- ๬ลือกรายการ --</option>
              ${state.materials.map(m => `<option value="${m.id}">${m.name} (${m.unit})</option>`).join('')}
            </select>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div class="form-group">
              <label class="form-label" for="pur-qty">��ำ�"ว�"</label>
              <input class="form-input" type="number" id="pur-qty" step="0.01" min="0" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="pur-price">รา�า/ห�"��วย</label>
              <input class="form-input" type="number" id="pur-price" step="0.01" min="0" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="pur-total">รา�ารวม (�aา�)</label>
            <input class="form-input" type="number" id="pur-total" step="0.01" min="0" readonly style="background:var(--bg-app);">
          </div>
          <div class="form-group">
            <label class="form-label" for="pur-note">หมาย๬ห�"ุ / ร�0า�"�ี���9ื�0อ</label>
            <input class="form-input" type="text" id="pur-note">
          </div>
          <button class="btn-primary" type="submit" style="width:100%; padding:12px; background-color:var(--secondary);">�aั�"�ึก�:ระวั�"ิการ�9ื�0อ</button>
        </form>
      </div>
    </div>

    <!-- Purchase History Table -->
    <div class="inventory-list-panel" style="margin-top: 24px;">
      <div class="panel-title" style="margin: 24px 24px 0 24px; border: none; padding: 0;">�:ระวั�"ิการ�9ื�0อวั�"�ุ�ิ�a</div>
      <div class="table-responsive">
        <table class="inventory-table">
          <thead>
            <tr>
              <th>วั�"�ี���9ื�0อ</th>
              <th>รายการ</th>
              <th>��ำ�"ว�"</th>
              <th>รา�า�"��อห�"��วย</th>
              <th>รา�ารวม</th>
              <th>หมาย๬ห�"ุ</th>
            </tr>
          </thead>
          <tbody id="purchases-body"></tbody>
        </table>
      </div>
    </div>
  `;

  // Attach auto-calculate total
  const qtyInput = document.getElementById('pur-qty');
  const priceInput = document.getElementById('pur-price');
  const totalInput = document.getElementById('pur-total');
  
  const calcTotal = () => {
    const q = parseFloat(qtyInput.value) || 0;
    const p = parseFloat(priceInput.value) || 0;
    totalInput.value = (q * p).toFixed(2);
  };
  qtyInput.addEventListener('input', calcTotal);
  priceInput.addEventListener('input', calcTotal);

  // Form Handlers
  document.getElementById('form-add-material').addEventListener('submit', async (e) => {
    e.preventDefault();
    const material = {
      id: 'm' + Date.now(),
      name: document.getElementById('mat-name').value.trim(),
      unit: document.getElementById('mat-unit').value.trim(),
      created_at: new Date().toISOString()
    };
    await saveDbMaterial(material);
    state.materials.push(material);
    alert('๬�~ิ��มวั�"�ุ�ิ�a๒หม��สำ๬ร�!��');
    renderPurchasing(container); // Reload page
  });

  document.getElementById('form-add-purchase').addEventListener('submit', async (e) => {
    e.preventDefault();
    const purchase = {
      id: 'pur' + Date.now(),
      material_id: document.getElementById('pur-material').value,
      date: new Date().toISOString(),
      quantity: parseFloat(qtyInput.value),
      unit_price: parseFloat(priceInput.value),
      total_price: parseFloat(totalInput.value),
      note: document.getElementById('pur-note').value.trim(),
      created_at: new Date().toISOString()
    };
    await saveDbPurchase(purchase);
    state.purchases.unshift(purchase); // Add to top
    alert('�aั�"�ึก�:ระวั�"ิการ�9ื�0อสำ๬ร�!��');
    renderPurchasing(container);
  });

  // Render Table
  const tbody = document.getElementById('purchases-body');
  if (state.purchases.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-light); padding: 40px;">ยั�!�ม���~�a�:ระวั�"ิการ�9ื�0อ</td></tr>`;
  } else {
    state.purchases.forEach(p => {
      const mat = state.materials.find(m => m.id === p.material_id);
      const displayDate = new Date(p.date).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${displayDate}</td>
        <td style="font-weight: 600;">${mat ? mat.name : 'Unknown'}</td>
        <td style="font-family: var(--font-latin);">${p.quantity} ${mat ? mat.unit : ''}</td>
        <td style="font-family: var(--font-latin);">฿${p.unit_price}</td>
        <td style="font-family: var(--font-latin); font-weight: 600; color: #FF4D4F;">฿${p.total_price}</td>
        <td><span style="color: var(--text-secondary); font-size: 13px;">${p.note || '-'}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }
}


// BOOTSTRAP LOGIC FOR purchasing
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
  
  renderMainLayout('purchasing');
  const container = document.getElementById('main-content-wrapper');
  if (container) {
    // Call the specific render function based on the page
    if ('purchasing' === 'pos') renderPOS(container);
    if ('purchasing' === 'inventory') renderInventory(container);
    if ('purchasing' === 'reports') renderReports(container);
    if ('purchasing' === 'history') renderHistory(container);
    if ('purchasing' === 'purchasing') renderPurchasing(container);
    if ('purchasing' === 'settings') renderSettings(container);
  }
}

window.addEventListener('DOMContentLoaded', init);
