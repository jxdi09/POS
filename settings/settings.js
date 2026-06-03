�// TAB 4: SETTINGS & GP CONFIGURATION VIEW
// ==========================================================================
function renderSettings(container) {
  let dbStatusLabel = state.dbMode === 'supabase' && state.dbStatus === 'online' 
    ? `<span class="db-status-pill online">�� ๬�`ื��อม�"��อ Supabase แล�0ว</span>` 
    : `<span class="db-status-pill offline">�� ๒�`�0�!า�"ออ�x�ล�"�R๬�รื��อ�!�"ี�0 (Local IndexedDB)</span>`;

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">�"ั�0�!���าร�0า�"��0าและระ�a�a๬�`ื��อม�"��อ</h2>
      ${dbStatusLabel}
    </div>

    <div class="settings-grid">
      <!-- Shop Profile Form -->
      <div class="inventory-form-panel">
        <div class="panel-title">��0อมูลร�0า�"��0า (๒�a๬สร�!��)</div>
        <form id="settings-profile-form">
          <div class="form-group">
            <label class="form-label" for="set-shop-name">�`ื��อร�0า�"��0า</label>
            <input class="form-input" type="text" id="set-shop-name" value="${state.shopProfile.name}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="set-shop-phone">๬�aอร�R��รศั�~��R</label>
            <input class="form-input" type="text" id="set-shop-phone" value="${state.shopProfile.phone}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="set-shop-address">�ี��อยู�� / รายละ๬อีย�ร�0า�"</label>
            <input class="form-input" type="text" id="set-shop-address" value="${state.shopProfile.address}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="set-shop-footer">��0อ�วาม��0าย๒�a๬สร�!��</label>
            <textarea class="form-input" id="set-shop-footer" rows="3" style="resize:none; font-family:inherit;" required>${state.shopProfile.receiptFooter}</textarea>
          </div>
          <button class="btn-primary" type="submit" style="width:100%; padding:12px; margin-top:10px;">�aั�"�ึก��0อมูลร�0า�"��0า</button>
        </form>
      </div>

      <!-- GP Settings Form -->
      <div class="inventory-form-panel" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div class="panel-title">�"ั�0�!���า�อมมิ�`�`ั���"๬�ลิ๬วอรี�� (GP%)</div>
          <form id="settings-gp-form">
            <div class="form-group">
              <label class="form-label" for="set-gp-lineman">LINE MAN GP (%)</label>
              <input class="form-input" type="number" id="set-gp-lineman" min="0" max="100" value="${state.gpRates.lineman}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="set-gp-grab">Grab GP (%)</label>
              <input class="form-input" type="number" id="set-gp-grab" min="0" max="100" value="${state.gpRates.grab}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="set-gp-walkin">ห�"�0าร�0า�" / อื���"�  GP (%)</label>
              <input class="form-input" type="number" id="set-gp-walkin" min="0" max="100" value="${state.gpRates.walkin}" readonly style="background-color: var(--bg-app); opacity: 0.7;">
            </div>
            <button class="btn-primary" type="submit" style="width:100%; padding:12px; margin-top:10px;">�aั�"�ึก���า GP</button>
          </form>
        </div>

        <div style="border-top:1px solid var(--border-color); padding-top:20px; margin-top:20px;">
          <div class="panel-title" style="border:none; padding:0; margin-bottom:10px;">��0อมูลฐา�"��0อมูล Supabase</div>
          <p style="font-size:12px; color:var(--text-secondary); line-height:1.5;">
            ��ร�!การ�"ี�0๬�`ื��อม�"��อฐา�"��0อมูล�:ลาย�า�!��:ยั�! Supabase URL:<br>
            <code style="font-family:var(--font-latin); word-break:break-all;">${SUPABASE_URL}</code>
          </p>
          <p style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-top:8px;">
            หาก�"�0อ�!การ๬�:ลี��ย�"ฐา�"��0อมูล สามาร��"ิ��"��อ�Sู�0�~ั��"า��:รแกรม หรือแก�0����xล�R <code>app.js</code> ���0��ย�"ร�!
          </p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('settings-profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('set-shop-name').value.trim();
    const phone = document.getElementById('set-shop-phone').value.trim();
    const address = document.getElementById('set-shop-address').value.trim();
    const receiptFooter = document.getElementById('set-shop-footer').value.trim();

    state.shopProfile = { name, phone, address, receiptFooter };
    await saveDbSettings('shop_profile', state.shopProfile);
    alert('�aั�"�ึก��0อมูลร�0า�"��0าสำ๬ร�!��!');
    renderSettings(container);
  });

  document.getElementById('settings-gp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const lineman = parseFloat(document.getElementById('set-gp-lineman').value);
    const grab = parseFloat(document.getElementById('set-gp-grab').value);

    state.gpRates = { lineman, grab, walkin: 0 };
    await saveDbSettings('gp_rates', state.gpRates);
    alert('�aั�"�ึก���า GP สำ๬ร�!��!');
    renderSettings(container);
  });
}

// ==========================================================================
// DATA BACKUP & RESTORE METHODS
// ==========================================================================
function handleExportDb() {
  const dbData = {
    products: state.products,
    orders: state.orders,
    shopProfile: state.shopProfile,
    gpRates: state.gpRates,
    exportedAt: new Date().toISOString()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  
  const datestamp = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute("download", `sweetpos-backup-${datestamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function handleImportDb(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      
      if (!parsed.products || !parsed.orders) {
        alert('รู�:แ�a�a��xล�R��0อมูลสำรอ�!�ม���ูก�"�0อ�! �ม��สามาร�กู�0�ื�"��0อมูล���0');
        return;
      }

      if (confirm(`�"�0อ�!การ๬�ีย�"�ั�a��0อมูล๒�"ระ�a�a��0วย��xล�Rสำรอ�!�"ี�0หรือ�ม��?\n(สิ�"��0า: ${parsed.products.length} รายการ, �ำสั���!�9ื�0อ: ${parsed.orders.length} รายการ)`)) {
        
        // Overwrite Local Dexie
        await db.products.clear();
        for (let p of parsed.products) {
          await db.products.put(p);
        }
        
        await db.orders.clear();
        for (let o of parsed.orders) {
          await db.orders.put(o);
        }

        if (parsed.shopProfile) {
          await db.settings.put({ key: 'shop_profile', value: parsed.shopProfile });
        }
        if (parsed.gpRates) {
          await db.settings.put({ key: 'gp_rates', value: parsed.gpRates });
        }

        // Overwrite Supabase Cloud
        if (state.dbMode === 'supabase' && supabaseClient) {
          try {
            // Delete all and insert updated
            await supabaseClient.from('pos_products').delete().neq('id', 'dummy');
            for (let p of parsed.products) {
              await supabaseClient.from('pos_products').insert(p);
            }

            await supabaseClient.from('pos_orders').delete().neq('id', 'dummy');
            for (let o of parsed.orders) {
              await supabaseClient.from('pos_orders').insert({
                id: o.id,
                date: o.date,
                channel: o.channel,
                reference: o.reference,
                items: o.items,
                subtotal: o.subtotal,
                total: o.total,
                total_cost: o.totalCost !== undefined ? o.totalCost : o.total_cost,
                gp_rate: o.gpRate !== undefined ? o.gpRate : o.gp_rate,
                gp_amount: o.gpAmount !== undefined ? o.gpAmount : o.gp_amount,
                net_revenue: o.netRevenue !== undefined ? o.netRevenue : o.net_revenue,
                profit: o.profit
              });
            }

            if (parsed.shopProfile) {
              await supabaseClient.from('pos_settings').upsert({ key: 'shop_profile', value: parsed.shopProfile });
            }
            if (parsed.gpRates) {
              await supabaseClient.from('pos_settings').upsert({ key: 'gp_rates', value: parsed.gpRates });
            }
          } catch (e) {
            console.error('Failed to sync restored database to Supabase:', e);
          }
        }
        
        // Reload State & Render
        await loadDatabase();
        alert('กู�0�ื�"��0อมูลและ๬�`ื��อม�"��อระ�a�a๬สร�!��๬รีย�aร�0อยแล�0ว!');
        renderReports(document.getElementById('main-content-wrapper'));
      }
    } catch (err) {
      alert('๬กิ���0อ�Sิ��~ลา�๒�"การอ��า�"��xล�R: ' + err.message);
    }
  };
  reader.readAsText(file);
}


// BOOTSTRAP LOGIC FOR settings
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
  
  renderMainLayout('settings');
  const container = document.getElementById('main-content-wrapper');
  if (container) {
    // Call the specific render function based on the page
    if ('settings' === 'pos') renderPOS(container);
    if ('settings' === 'inventory') renderInventory(container);
    if ('settings' === 'reports') renderReports(container);
    if ('settings' === 'history') renderHistory(container);
    if ('settings' === 'purchasing') renderPurchasing(container);
    if ('settings' === 'settings') renderSettings(container);
  }
}

window.addEventListener('DOMContentLoaded', init);
