�// TAB 3: REPORTS & FINANCIAL DASHBOARD VIEW (WITH SVG CHARTS)
// ==========================================================================
function renderReports(container) {
  let totalRevenue = 0;
  let totalCost = 0;
  let totalGpDeductions = 0;
  let netRevenue = 0;
  
  let linemanRevenue = 0;
  let linemanProfit = 0;
  let linemanOrders = 0;
  
  let grabRevenue = 0;
  let grabProfit = 0;
  let grabOrders = 0;
  
  let walkinRevenue = 0;
  let walkinProfit = 0;
  let walkinOrders = 0;

  state.orders.forEach(order => {
    totalRevenue += order.total;
    const gpAmt = order.gpAmount !== undefined ? order.gpAmount : 0;
    totalGpDeductions += gpAmt;
    const netRev = order.netRevenue !== undefined ? order.netRevenue : (order.total - gpAmt);
    netRevenue += netRev;
    totalCost += order.totalCost;
    
    if (order.channel === 'lineman') {
      linemanRevenue += order.total;
      linemanProfit += order.profit;
      linemanOrders++;
    } else if (order.channel === 'grab') {
      grabRevenue += order.total;
      grabProfit += order.profit;
      grabOrders++;
    } else {
      walkinRevenue += order.total;
      walkinProfit += order.profit;
      walkinOrders++;
    }
  });

  const netProfit = netRevenue - totalCost;
  const overallMargin = netRevenue > 0 ? Math.round((netProfit / netRevenue) * 100) : 0;

  const totalOrdersCount = state.orders.length || 1;
  const linemanPercent = Math.round((linemanOrders / totalOrdersCount) * 100);
  const grabPercent = Math.round((grabOrders / totalOrdersCount) * 100);
  const walkinPercent = Math.round((walkinOrders / totalOrdersCount) * 100);

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">สรุ�:ราย�!า�"ยอ��ายและกำ�ร�า��ุ�"</h2>
    </div>

    <!-- Financial Stats Row -->
    <div class="report-grid-stats">
      <div class="stat-card">
        <div class="stat-card-title">ยอ��ายรวม (Gross Sales)</div>
        <div class="stat-card-value">฿${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</div>
        <div class="stat-card-footer">หัก���า�อมมิ�`�`ั���" GP แล�0ว��ะ๬หลือรายรั�a��ริ�!</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-title">หัก���า��รรม๬�"ียม GP รวม</div>
        <div class="stat-card-value" style="color: #FF4D4F;">-฿${totalGpDeductions.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</div>
        <div class="stat-card-footer">๬�0ลี��ย�"าม��ริ�!�"ามออร�R๬�อร�R LINE MAN / Grab</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-title">กำ�รสุ���ิ (Net Profit)</div>
        <div class="stat-card-value profit ${netProfit < 0 ? 'loss' : ''}">฿${netProfit.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</div>
        <div class="stat-card-footer">�ำ�"ว���าก (รายรั�a��ริ�! - �"�0�"�ุ�"�อ�!�ีย�R๒�"ระ�a�a)</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-title">อั�"รากำ�รหลั�!หัก GP &amp; �"�0�"�ุ�"</div>
        <div class="stat-card-value" style="color: var(--primary);">${overallMargin}%</div>
        <div class="stat-card-footer">��ากรายรั�a��ริ�!รวม ฿${netRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
      </div>
    </div>

    <!-- SVG Charts Row -->
    <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 24px;">
      <div style="display: grid; grid-template-columns: 1fr; gap: 20px;" class="settings-grid">
        <!-- SVG Daily Sales Bar Chart -->
        <div class="svg-chart-container">
          <div class="svg-chart-title">
            <span>ยอ��ายและกำ�รสุ���ิย�0อ�"หลั�! 7 วั�"</span>
            <div style="display:flex; gap:12px; font-size:11px;">
              <span style="color:var(--primary);">�� ยอ��ายรวม</span>
              <span style="color:var(--secondary);">�� กำ�รสุ���ิ</span>
            </div>
          </div>
          <div id="chart-daily-container" style="height: 180px;">
            ${render7DaySalesChart()}
          </div>
        </div>

        <!-- SVG Category Donut Chart -->
        <div class="svg-chart-container">
          <div class="svg-chart-title">สั�ส��ว�"ยอ��าย�"ามหมว�หมู��สิ�"��0า</div>
          <div id="chart-category-container" style="padding-top:10px;">
            ${renderCategoryPieChart()}
          </div>
        </div>
      </div>
    </div>

    <!-- Middle splits row -->
    <div class="report-platforms-section">
      <!-- Left Card: Platform breakdowns -->
      <div class="platform-split-card">
        <div class="panel-title" style="margin-bottom: 24px;">วิ๬�ราะห�R�`��อ�!�า�!การ�าย (Delivery Channels)</div>
        
        <!-- Line Man -->
        <div class="platform-row">
          <div class="platform-indicator lineman"></div>
          <div class="platform-details">
            <div class="platform-title-row">
              <span>LINE MAN (${linemanOrders} ออร�R๬�อร�R)</span>
              <span>ยอ��าย: ฿${linemanRevenue.toLocaleString()} (กำ�ร: ฿${linemanProfit.toLocaleString()})</span>
            </div>
            <div class="platform-bar-bg">
              <div class="platform-bar-fill lineman" style="width: ${linemanPercent}%"></div>
            </div>
          </div>
        </div>

        <!-- Grab -->
        <div class="platform-row">
          <div class="platform-indicator grab"></div>
          <div class="platform-details">
            <div class="platform-title-row">
              <span>Grab (${grabOrders} ออร�R๬�อร�R)</span>
              <span>ยอ��าย: ฿${grabRevenue.toLocaleString()} (กำ�ร: ฿${grabProfit.toLocaleString()})</span>
            </div>
            <div class="platform-bar-bg">
              <div class="platform-bar-fill grab" style="width: ${grabPercent}%"></div>
            </div>
          </div>
        </div>

        <!-- Walk-in -->
        <div class="platform-row">
          <div class="platform-indicator walkin"></div>
          <div class="platform-details">
            <div class="platform-title-row">
              <span>ห�"�0าร�0า�" / อื���"�  (${walkinOrders} ออร�R๬�อร�R)</span>
              <span>ยอ��าย: ฿${walkinRevenue.toLocaleString()} (กำ�ร: ฿${walkinProfit.toLocaleString()})</span>
            </div>
            <div class="platform-bar-bg">
              <div class="platform-bar-fill walkin" style="width: ${walkinPercent}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Card: Backup Database options -->
      <div class="backup-panel">
        <div class="panel-title">สำรอ�!��xล�Rและกู�0�ื�"��0อมูล (Database Backups)</div>
        <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.5;">
          ๬�~ื��อ�:�0อ�!กั�"��0อมูลการ�ายสูญหาย ��:ร��าว�"�R�หล�และสำรอ�!��0อมูล�ว�0สม��ำ๬สมอ หาก๬�รื��อ�! iPad �"กหล���"หรือ�`ำรุ�๬สียหาย �ุ�สามาร��าว�"�R�หล���xล�R�"ี�0��:อั�:�หล�๒ส�� iPad ๬�รื��อ�!๒หม��หรือระ�a�a�ลาว��R๬�~ื��อกู�0�ื�"���0�ั�"�ี
        </p>
        <div class="backup-buttons">
          <button class="btn-backup" id="btn-export-db">�าว�"�R�หล���xล�Rสำรอ�!��0อมูล (.json)</button>
          <label class="btn-restore-label" for="import-db-file">
            ๬ลือก��xล�R๬�~ื��อกู�0�ื�"��0อมูล
            <input type="file" id="import-db-file" accept=".json" style="display: none;">
          </label>
        </div>
      </div>
    </div>

    <!-- Bottom logs panel -->
    <div class="inventory-list-panel" style="margin-bottom: 30px;">
      <div class="panel-title" style="margin: 24px 24px 0 24px; border: none; padding: 0;">�:ระวั�"ิ�ำสั���!�9ื�0อ�ั�0�!หม� (Transaction History)</div>
      <div class="table-responsive">
        <table class="inventory-table">
          <thead>
            <tr>
              <th>วั�"�ี��/๬วลา</th>
              <th>�aิล๬ล��ี��</th>
              <th>�`��อ�!�า�!</th>
              <th>รายละ๬อีย�รายการ</th>
              <th>ยอ�รวม</th>
              <th>���า GP หัก</th>
              <th>กำ�รสุ���ิ</th>
              <th style="text-align: center;">�~ิม�~�R�9�0ำ</th>
            </tr>
          </thead>
          <tbody id="reports-orders-body"></tbody>
        </table>
      </div>
    </div>
  `;

  // Attach database backup listeners
  document.getElementById('btn-export-db').addEventListener('click', handleExportDb);
  
  const fileImporter = document.getElementById('import-db-file');
  fileImporter.addEventListener('change', handleImportDb);

  renderReportsOrders();
}

function render7DaySalesChart() {
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    chartData.push({ dateStr, label, sales: 0, profit: 0 });
  }

  state.orders.forEach(order => {
    const orderDateStr = new Date(order.date).toISOString().slice(0, 10);
    const dayData = chartData.find(d => d.dateStr === orderDateStr);
    if (dayData) {
      dayData.sales += order.total;
      dayData.profit += order.profit;
    }
  });

  const maxSales = Math.max(...chartData.map(d => d.sales), 100);

  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 30;
  const graphHeight = chartHeight - padding * 2;
  const graphWidth = chartWidth - padding * 2;
  
  const colWidth = graphWidth / 7;
  const barWidth = colWidth * 0.35;

  let svgContent = '';
  
  // Y-axis grid
  for (let i = 0; i <= 2; i++) {
    const yVal = padding + (graphHeight / 2) * i;
    const labelVal = Math.round(maxSales - (maxSales / 2) * i);
    svgContent += `
      <line x1="${padding}" y1="${yVal}" x2="${chartWidth - padding}" y2="${yVal}" stroke="var(--border-color)" stroke-dasharray="3" stroke-width="1" />
      <text x="${padding - 5}" y="${yVal + 3}" font-size="10" text-anchor="end" fill="var(--text-secondary)" font-family="var(--font-latin)">฿${labelVal}</text>
    `;
  }

  // Draw Bars
  chartData.forEach((d, idx) => {
    const x = padding + idx * colWidth + (colWidth - barWidth * 2) / 2;
    
    const salesHeight = (d.sales / maxSales) * graphHeight;
    const salesY = padding + graphHeight - salesHeight;
    
    const profitHeight = (Math.max(0, d.profit) / maxSales) * graphHeight;
    const profitY = padding + graphHeight - profitHeight;

    svgContent += `
      <rect x="${x}" y="${salesY}" width="${barWidth}" height="${salesHeight}" fill="var(--primary)" rx="3" class="chart-bar-hover">
        <title>ยอ��าย ${d.label}: ฿${d.sales.toLocaleString()}</title>
      </rect>
      <rect x="${x + barWidth + 3}" y="${profitY}" width="${barWidth}" height="${profitHeight}" fill="var(--secondary)" rx="3" class="chart-bar-hover">
        <title>กำ�รสุ���ิ ${d.label}: ฿${d.profit.toLocaleString()}</title>
      </rect>
      <text x="${x + barWidth}" y="${chartHeight - 10}" font-size="10" text-anchor="middle" fill="var(--text-secondary)">${d.label}</text>
    `;
  });

  return `
    <svg viewBox="0 0 ${chartWidth} ${chartHeight}" width="100%" height="100%">
      ${svgContent}
    </svg>
  `;
}

function renderCategoryPieChart() {
  const catSales = { drinks: 0, snacks: 0, others: 0 };
  state.orders.forEach(order => {
    order.items.forEach(it => {
      const p = state.products.find(prod => prod.name === it.name);
      const cat = p ? p.category : 'drinks';
      if (catSales[cat] !== undefined) {
        catSales[cat] += it.price * it.qty;
      } else {
        catSales.others += it.price * it.qty;
      }
    });
  });

  const total = catSales.drinks + catSales.snacks + catSales.others;
  if (total === 0) {
    return `<div style="text-align:center; padding:40px; color:var(--text-light);">ยั�!�ม��มี��0อมูลยอ��าย๒�"ระ�a�a</div>`;
  }

  const r = 45;
  const cx = 80;
  const cy = 80;
  const circ = 2 * Math.PI * r;

  const drinkPct = catSales.drinks / total;
  const snackPct = catSales.snacks / total;
  const otherPct = catSales.others / total;

  const drinkStroke = circ * drinkPct;
  const snackStroke = circ * snackPct;
  const otherStroke = circ * otherPct;

  let offset = 0;
  const drinkOffset = offset;
  offset += drinkStroke;
  const snackOffset = offset;
  offset += snackStroke;
  const otherOffset = offset;

  return `
    <div style="display:flex; align-items:center; justify-content:space-around; gap:16px;">
      <svg width="140" height="140" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="${r}" fill="none" stroke="var(--border-color)" stroke-width="18" />
        
        ${drinkStroke > 0 ? `<circle cx="80" cy="80" r="${r}" fill="none" stroke="var(--primary)" stroke-width="18" 
          stroke-dasharray="${drinkStroke} ${circ - drinkStroke}" 
          stroke-dashoffset="${-drinkOffset}" 
          transform="rotate(-90 80 80)" />` : ''}
          
        ${snackStroke > 0 ? `<circle cx="80" cy="80" r="${r}" fill="none" stroke="var(--secondary)" stroke-width="18" 
          stroke-dasharray="${snackStroke} ${circ - snackStroke}" 
          stroke-dashoffset="${-snackOffset}" 
          transform="rotate(-90 80 80)" />` : ''}
          
        ${otherStroke > 0 ? `<circle cx="80" cy="80" r="${r}" fill="none" stroke="var(--accent)" stroke-width="18" 
          stroke-dasharray="${otherStroke} ${circ - otherStroke}" 
          stroke-dashoffset="${-otherOffset}" 
          transform="rotate(-90 80 80)" />` : ''}
          
        <circle cx="80" cy="80" r="36" fill="var(--bg-card)" />
      </svg>
      
      <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background-color:var(--primary);"></span>
          <strong>๬�รื��อ�!�ื��ม:</strong> ฿${catSales.drinks.toLocaleString()} (${Math.round(drinkPct*100)}%)
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background-color:var(--secondary);"></span>
          <strong>��"ม/๬�a๬กอรี��:</strong> ฿${catSales.snacks.toLocaleString()} (${Math.round(snackPct*100)}%)
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background-color:var(--accent);"></span>
          <strong>อื���"� :</strong> ฿${catSales.others.toLocaleString()} (${Math.round(otherPct*100)}%)
        </div>
      </div>
    </div>
  `;
}

function renderReportsOrders() {
  const tbody = document.getElementById('reports-orders-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (state.orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--text-light); padding: 40px;">
          ยั�!�ม���~�a��0อมูล�:ระวั�"ิยอ��ายสิ�"��0า๒�"ระ�a�a
        </td>
      </tr>
    `;
    return;
  }

  state.orders.forEach(order => {
    const tr = document.createElement('tr');
    const displayDate = new Date(order.date).toLocaleString('th-TH', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    let chLabel = 'ห�"�0าร�0า�"';
    let chClass = 'walkin';
    if (order.channel === 'lineman') { chLabel = 'LINE MAN'; chClass = 'lineman'; }
    if (order.channel === 'grab') { chLabel = 'Grab'; chClass = 'grab'; }

    const itemsSummary = order.items.map(it => {
      return `${it.name} (x${it.qty})${it.options ? ` [${it.options}]` : ''}`;
    }).join('<br>');

    const gpAmt = order.gpAmount !== undefined ? order.gpAmount : 0;
    const netRevenue = order.netRevenue !== undefined ? order.netRevenue : (order.total - gpAmt);

    tr.innerHTML = `
      <td style="white-space: nowrap; font-size: 13px;">${displayDate}</td>
      <td style="font-family: var(--font-latin); font-weight: 500; font-size: 13px;">${order.id.toUpperCase()}</td>
      <td>
        <span class="margin-pill ${chClass}" style="color: white; font-weight: bold;">
          ${chLabel} ${order.reference}
        </span>
      </td>
      <td style="font-size: 13px; line-height: 1.4; max-width: 320px;">${itemsSummary}</td>
      <td style="font-family: var(--font-latin); font-weight: 600;">฿${order.total}</td>
      <td style="font-family: var(--font-latin); color: #FF4D4F;">${gpAmt > 0 ? `฿${gpAmt.toFixed(1)}` : '฿0'}</td>
      <td style="font-family: var(--font-latin); font-weight: 600; color: ${order.profit >= 0 ? 'var(--secondary)' : '#FF4D4F'}">
        ฿${order.profit.toFixed(1)}
      </td>
      <td style="text-align: center;">
        <button class="btn-icon btn-print-reprint" data-id="${order.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        </button>
      </td>
    `;

    tr.querySelector('.btn-print-reprint').addEventListener('click', (e) => {
      const oid = e.currentTarget.dataset.id;
      reprintReceipt(oid);
    });

    tbody.appendChild(tr);
  });
}

function reprintReceipt(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  const printArea = document.getElementById('print-area');
  const thaiDate = new Date(order.date).toLocaleString('th-TH', { 
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  let channelLabel = 'ห�"�0าร�0า�" / อื���"� ';
  if (order.channel === 'lineman') channelLabel = 'LINE MAN';
  if (order.channel === 'grab') channelLabel = 'Grab';

  printArea.innerHTML = `
    <div class="receipt-container">
      <div class="receipt-header">
        <div class="receipt-title">${state.shopProfile.name}</div>
        <div class="receipt-subtitle">${state.shopProfile.address}</div>
        <div class="receipt-subtitle">��ร. ${state.shopProfile.phone}</div>
        <div class="receipt-channel-badge">${channelLabel} ${order.reference} (�~ิม�~�R�9�0ำ)</div>
      </div>
      
      <div class="receipt-metadata">
        <div><strong>�aิล๬ล��ี��:</strong> ${order.id.toUpperCase()}</div>
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
          ${order.items.map(item => `
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
          <span>${order.items.reduce((s, i) => s + i.qty, 0)} �`ิ�0�"</span>
        </div>
        <div class="receipt-summary-row total">
          <span>ยอ�รวม�ั�0�!สิ�0�"</span>
          <span>฿${order.total}</span>
        </div>
      </div>
      
      <div class="receipt-footer">
        ${state.shopProfile.receiptFooter.split('\n').map(l => `<p>${l}</p>`).join('')}
      </div>
    </div>
  `;

  window.print();
}

// ==========================================================================

// BOOTSTRAP LOGIC FOR reports
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
  
  renderMainLayout('reports');
  const container = document.getElementById('main-content-wrapper');
  if (container) {
    // Call the specific render function based on the page
    if ('reports' === 'pos') renderPOS(container);
    if ('reports' === 'inventory') renderInventory(container);
    if ('reports' === 'reports') renderReports(container);
    if ('reports' === 'history') renderHistory(container);
    if ('reports' === 'purchasing') renderPurchasing(container);
    if ('reports' === 'settings') renderSettings(container);
  }
}

window.addEventListener('DOMContentLoaded', init);
