// TAB 4: SETTINGS & GP CONFIGURATION VIEW
// ==========================================================================
function renderSettings(container) {
  let dbStatusLabel = state.dbMode === 'supabase' && state.dbStatus === 'online' 
    ? `<span class="db-status-pill online">â— à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸•à¹ˆà¸­ Supabase à¹à¸¥à¹‰à¸§</span>` 
    : `<span class="db-status-pill offline">â— à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¸­à¸­à¸Ÿà¹„à¸¥à¸™à¹Œà¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸™à¸µà¹‰ (Local IndexedDB)</span>`;

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">à¸•à¸±à¹‰à¸‡à¸„à¹ˆà¸²à¸£à¹‰à¸²à¸™à¸„à¹‰à¸²à¹à¸¥à¸°à¸£à¸°à¸šà¸šà¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸•à¹ˆà¸­</h2>
      ${dbStatusLabel}
    </div>

    <div class="settings-grid">
      <!-- Shop Profile Form -->
      <div class="inventory-form-panel">
        <div class="panel-title">à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸£à¹‰à¸²à¸™à¸„à¹‰à¸² (à¹ƒà¸šà¹€à¸ªà¸£à¹‡à¸ˆ)</div>
        <form id="settings-profile-form">
          <div class="form-group">
            <label class="form-label" for="set-shop-name">à¸Šà¸·à¹ˆà¸­à¸£à¹‰à¸²à¸™à¸„à¹‰à¸²</label>
            <input class="form-input" type="text" id="set-shop-name" value="${state.shopProfile.name}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="set-shop-phone">à¹€à¸šà¸­à¸£à¹Œà¹‚à¸—à¸£à¸¨à¸±à¸žà¸—à¹Œ</label>
            <input class="form-input" type="text" id="set-shop-phone" value="${state.shopProfile.phone}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="set-shop-address">à¸—à¸µà¹ˆà¸­à¸¢à¸¹à¹ˆ / à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸£à¹‰à¸²à¸™</label>
            <input class="form-input" type="text" id="set-shop-address" value="${state.shopProfile.address}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="set-shop-footer">à¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡à¸—à¹‰à¸²à¸¢à¹ƒà¸šà¹€à¸ªà¸£à¹‡à¸ˆ</label>
            <textarea class="form-input" id="set-shop-footer" rows="3" style="resize:none; font-family:inherit;" required>${state.shopProfile.receiptFooter}</textarea>
          </div>
          <button class="btn-primary" type="submit" style="width:100%; padding:12px; margin-top:10px;">à¸šà¸±à¸™à¸—à¸¶à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸£à¹‰à¸²à¸™à¸„à¹‰à¸²</button>
        </form>
      </div>

      <!-- GP Settings Form -->
      <div class="inventory-form-panel" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div class="panel-title">à¸•à¸±à¹‰à¸‡à¸„à¹ˆà¸²à¸„à¸­à¸¡à¸¡à¸´à¸Šà¸Šà¸±à¹ˆà¸™à¹€à¸”à¸¥à¸´à¹€à¸§à¸­à¸£à¸µà¹ˆ (GP%)</div>
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
              <label class="form-label" for="set-gp-walkin">à¸«à¸™à¹‰à¸²à¸£à¹‰à¸²à¸™ / à¸­à¸·à¹ˆà¸™à¹† GP (%)</label>
              <input class="form-input" type="number" id="set-gp-walkin" min="0" max="100" value="${state.gpRates.walkin}" readonly style="background-color: var(--bg-app); opacity: 0.7;">
            </div>
            <button class="btn-primary" type="submit" style="width:100%; padding:12px; margin-top:10px;">à¸šà¸±à¸™à¸—à¸¶à¸à¸„à¹ˆà¸² GP</button>
          </form>
        </div>

        <div style="border-top:1px solid var(--border-color); padding-top:20px; margin-top:20px;">
          <div class="panel-title" style="border:none; padding:0; margin-bottom:10px;">à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸à¸²à¸™à¸‚à¹‰à¸­à¸¡à¸¹à¸¥ Supabase</div>
          <p style="font-size:12px; color:var(--text-secondary); line-height:1.5;">
            à¹‚à¸„à¸£à¸‡à¸à¸²à¸£à¸™à¸µà¹‰à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸•à¹ˆà¸­à¸à¸²à¸™à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸›à¸¥à¸²à¸¢à¸—à¸²à¸‡à¹„à¸›à¸¢à¸±à¸‡ Supabase URL:<br>
            <code style="font-family:var(--font-latin); word-break:break-all;">${SUPABASE_URL}</code>
          </p>
          <p style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-top:8px;">
            à¸«à¸²à¸à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸à¸²à¸™à¸‚à¹‰à¸­à¸¡à¸¹à¸¥ à¸ªà¸²à¸¡à¸²à¸£à¸–à¸•à¸´à¸”à¸•à¹ˆà¸­à¸œà¸¹à¹‰à¸žà¸±à¸’à¸™à¸²à¹‚à¸›à¸£à¹à¸à¸£à¸¡ à¸«à¸£à¸·à¸­à¹à¸à¹‰à¹„à¸‚à¹„à¸Ÿà¸¥à¹Œ <code>app.js</code> à¹„à¸”à¹‰à¹‚à¸”à¸¢à¸•à¸£à¸‡
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
    alert('à¸šà¸±à¸™à¸—à¸¶à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸£à¹‰à¸²à¸™à¸„à¹‰à¸²à¸ªà¸³à¹€à¸£à¹‡à¸ˆ!');
    renderSettings(container);
  });

  document.getElementById('settings-gp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const lineman = parseFloat(document.getElementById('set-gp-lineman').value);
    const grab = parseFloat(document.getElementById('set-gp-grab').value);

    state.gpRates = { lineman, grab, walkin: 0 };
    await saveDbSettings('gp_rates', state.gpRates);
    alert('à¸šà¸±à¸™à¸—à¸¶à¸à¸„à¹ˆà¸² GP à¸ªà¸³à¹€à¸£à¹‡à¸ˆ!');
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
        alert('à¸£à¸¹à¸›à¹à¸šà¸šà¹„à¸Ÿà¸¥à¹Œà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¸³à¸£à¸­à¸‡à¹„à¸¡à¹ˆà¸–à¸¹à¸à¸•à¹‰à¸­à¸‡ à¹„à¸¡à¹ˆà¸ªà¸²à¸¡à¸²à¸£à¸–à¸à¸¹à¹‰à¸„à¸·à¸™à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹„à¸”à¹‰');
        return;
      }

      if (confirm(`à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¹€à¸‚à¸µà¸¢à¸™à¸—à¸±à¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹ƒà¸™à¸£à¸°à¸šà¸šà¸”à¹‰à¸§à¸¢à¹„à¸Ÿà¸¥à¹Œà¸ªà¸³à¸£à¸­à¸‡à¸™à¸µà¹‰à¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ?\n(à¸ªà¸´à¸™à¸„à¹‰à¸²: ${parsed.products.length} à¸£à¸²à¸¢à¸à¸²à¸£, à¸„à¸³à¸ªà¸±à¹ˆà¸‡à¸‹à¸·à¹‰à¸­: ${parsed.orders.length} à¸£à¸²à¸¢à¸à¸²à¸£)`)) {
        
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
        alert('à¸à¸¹à¹‰à¸„à¸·à¸™à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹à¸¥à¸°à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸•à¹ˆà¸­à¸£à¸°à¸šà¸šà¹€à¸ªà¸£à¹‡à¸ˆà¹€à¸£à¸µà¸¢à¸šà¸£à¹‰à¸­à¸¢à¹à¸¥à¹‰à¸§!');
        renderReports(document.getElementById('main-content-wrapper'));
      }
    } catch (err) {
      alert('à¹€à¸à¸´à¸”à¸‚à¹‰à¸­à¸œà¸´à¸”à¸žà¸¥à¸²à¸”à¹ƒà¸™à¸à¸²à¸£à¸­à¹ˆà¸²à¸™à¹„à¸Ÿà¸¥à¹Œ: ' + err.message);
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
