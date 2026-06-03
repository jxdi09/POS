// ==========================================================================
// NAVIGATION (MULTI-PAGE APP ROUTING)
// ==========================================================================
function renderMainLayout(activeTabId) {
  const appElement = document.getElementById('app');
  if (!appElement) return;

  const isAdmin = state.user && state.user.role === 'admin';
  appElement.innerHTML = `
    <div class="app-container">
      <!-- Top Navigation Header -->
      <header class="main-header">
        <div class="header-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary)">
            <path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
            <path d="M5 8h10v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z"/>
            <line x1="9" y1="2" x2="9" y2="8"/>
            <line x1="11" y1="2" x2="11" y2="8"/>
            <line x1="7" y1="2" x2="7" y2="8"/>
          </svg>
          <div class="header-logo">SweetPOS<span>&amp;Sip</span></div>
        </div>
        
        <nav class="main-nav">
          <button class="nav-item ${activeTabId === 'pos' ? 'active' : ''}" id="nav-pos">
            <svg viewBox="0 0 24 24" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
            หน้าหลัก POS
          </button>
          
          ${isAdmin ? `
            <button class="nav-item ${activeTabId === 'inventory' ? 'active' : ''}" id="nav-inventory">
              <svg viewBox="0 0 24 24" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              จัดการต้นทุน/สินค้า
            </button>
            <button class="nav-item ${activeTabId === 'reports' ? 'active' : ''}" id="nav-reports">
              <svg viewBox="0 0 24 24" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              รายงานกำไรขาดทุน
            </button>
            <button class="nav-item ${activeTabId === 'history' ? 'active' : ''}" id="nav-history">
              <svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ประวัติออร์เดอร์
            </button>
            <button class="nav-item ${activeTabId === 'purchasing' ? 'active' : ''}" id="nav-purchasing">
              <svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><path d="M20 16.2A2 2 0 0 0 21.8 14V10A2 2 0 0 0 20 7.8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v1.8A2 2 0 0 0 2.2 10v4a2 2 0 0 0 1.8 2.2V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.8zM4 6h16v2H4zm16 12H4v-2h16z"/></svg>
              วัตถุดิบ/จัดซื้อ
            </button>
            <button class="nav-item ${activeTabId === 'settings' ? 'active' : ''}" id="nav-settings">
              <svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              ตั้งค่าระบบ
            </button>
          ` : ''}
        </nav>

        <div class="header-user">
          <button class="theme-toggle-btn" id="btn-theme-toggle" title="สลับโหมด มืด/สว่าง">
            ${state.darkTheme ? `
              <!-- Sun Icon -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ` : `
              <!-- Moon Icon -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            `}
          </button>
          
          <div class="user-badge ${isAdmin ? 'role-admin' : ''}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ${state.user.username} (${isAdmin ? 'ผู้ดูแล' : 'พนักงาน'})
          </div>
          <button class="logout-btn" id="btn-logout" title="ออกจากระบบ">
            <svg viewBox="0 0 24 24" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>

      <!-- Page Wrapper -->
      <main class="main-wrapper" id="main-content-wrapper">
        <!-- Tab Content Rendered Here By Each Page -->
      </main>
    </div>
  `;

  // Attach Navigation Listeners
  document.getElementById('nav-pos').addEventListener('click', () => switchTab('pos'));
  if (isAdmin) {
    document.getElementById('nav-inventory').addEventListener('click', () => switchTab('inventory'));
    document.getElementById('nav-reports').addEventListener('click', () => switchTab('reports'));
    document.getElementById('nav-history').addEventListener('click', () => switchTab('history'));
    document.getElementById('nav-purchasing').addEventListener('click', () => switchTab('purchasing'));
    document.getElementById('nav-settings').addEventListener('click', () => switchTab('settings'));
  }
  document.getElementById('btn-logout').addEventListener('click', () => {
    clearSession();
    window.location.href = '../index.html'; // Go back to root login
  });
  document.getElementById('btn-theme-toggle').addEventListener('click', () => {
    toggleTheme();
    renderMainLayout(activeTabId);
    if (typeof window.renderPage === 'function') {
      window.renderPage(); // Re-render the page content if necessary
    }
  });
}

function switchTab(tabId) {
  if (typeof saveAppState === 'function') {
    saveAppState();
  }
  window.location.href = '../' + tabId + '/' + tabId + '.html';
}
