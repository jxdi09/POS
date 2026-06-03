�// ==========================================================================
// TAB: HISTORY VIEW
// ==========================================================================
function renderHistory(container) {
        </table>
      </div>
    </div>
  `;
  
  // Use existing logic for orders table rendering
  const tbody = document.getElementById('history-orders-body');
  if (state.orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-light); padding: 40px;">ยั�!�ม���~�a��0อมูล�:ระวั�"ิยอ��าย</td></tr>`;
  } else {
    state.orders.forEach(order => {
      const tr = document.createElement('tr');
      const displayDate = new Date(order.date).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      let chLabel = 'ห�"�0าร�0า�"'; let chClass = 'walkin';
      if (order.channel === 'lineman') { chLabel = 'LINE MAN'; chClass = 'lineman'; }
      if (order.channel === 'grab') { chLabel = 'Grab'; chClass = 'grab'; }
      const itemsSummary = order.items.map(it => it.name + ' (x' + it.qty + ')' + (it.options ? ' [' + it.options + ']' : '')).join('<br>');
      const gpAmt = order.gpAmount !== undefined ? order.gpAmount : 0;

      tr.innerHTML = `
        <td style="white-space: nowrap; font-size: 13px;">${displayDate}</td>
        <td style="font-family: var(--font-latin); font-weight: 500; font-size: 13px;">${order.id.toUpperCase()}</td>
        <td><span class="margin-pill ${chClass}" style="color: white; font-weight: bold;">${chLabel} ${order.reference}</span></td>
        <td style="font-size: 13px; line-height: 1.4; max-width: 320px;">${itemsSummary}</td>
        <td style="font-family: var(--font-latin); font-weight: 600;">฿${order.total}</td>
        <td style="font-family: var(--font-latin); color: #FF4D4F;">${gpAmt > 0 ? '฿' + gpAmt.toFixed(1) : '฿0'}</td>
        <td style="font-family: var(--font-latin); font-weight: 600; color: ${order.profit >= 0 ? 'var(--secondary)' : '#FF4D4F'}">฿${order.profit.toFixed(1)}</td>
        <td style="text-align: center;">
          <button class="btn-icon btn-print-reprint" data-id="${order.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          </button>
        </td>
      `;
      tr.querySelector('.btn-print-reprint').addEventListener('click', (e) => reprintReceipt(e.currentTarget.dataset.id));
      tbody.appendChild(tr);
    });
  }
}


// BOOTSTRAP LOGIC FOR history
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
  
  renderMainLayout('history');
  const container = document.getElementById('main-content-wrapper');
  if (container) {
    // Call the specific render function based on the page
    if ('history' === 'pos') renderPOS(container);
    if ('history' === 'inventory') renderInventory(container);
    if ('history' === 'reports') renderReports(container);
    if ('history' === 'history') renderHistory(container);
    if ('history' === 'purchasing') renderPurchasing(container);
    if ('history' === 'settings') renderSettings(container);
  }
}

window.addEventListener('DOMContentLoaded', init);
