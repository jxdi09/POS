// ==========================================================================
// LOGIN VIEW (ENTRY POINT)
// ==========================================================================
let loginError = '';

function renderLoginScreen() {
  const appElement = document.getElementById('app');
  if (!appElement) return;
  
  appElement.innerHTML = `
    <div class="login-container">
      <div class="login-bg-shape login-bg-shape-1"></div>
      <div class="login-bg-shape login-bg-shape-2"></div>
      <div class="login-card">
        <div class="login-logo">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary)">
            <path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
            <path d="M5 8h10v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z"/>
            <line x1="9" y1="2" x2="9" y2="8"/>
            <line x1="11" y1="2" x2="11" y2="8"/>
            <line x1="7" y1="2" x2="7" y2="8"/>
          </svg>
          SweetPOS <span>&amp; Sip</span>
        </div>
        <p class="login-subtitle">ระบบจัดการออร์เดอร์และคำนวณต้นทุน สำหรับ iPad</p>
        
        ${loginError ? `<div class="login-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ${loginError}
        </div>` : ''}

        <form id="login-form">
          <div class="form-group">
            <label class="form-label" for="username">ชื่อผู้ใช้งาน</label>
            <input class="form-input" type="text" id="username" placeholder="กรอกชื่อผู้ใช้งาน (admin / staff)" required autocomplete="username">
          </div>
          <div class="form-group">
            <label class="form-label" for="password">รหัสผ่าน</label>
            <input class="form-input" type="password" id="password" placeholder="กรอกรหัสผ่าน (1234)" required autocomplete="current-password">
          </div>
          <button class="login-btn" type="submit">เข้าสู่ระบบ</button>
        </form>
      </div>
    </div>
  `;

  // Attach Event
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    
    // Auth logic
    const matchedUser = await verifyAuth(u, p);
    if (matchedUser) {
      loginError = '';
      saveSession(matchedUser);
      // Redirect to POS page instead of switching tab
      window.location.href = './pos/pos.html';
    } else {
      loginError = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (ลองใช้ admin / 1234)';
      renderLoginScreen();
    }
  });
}

// ==========================================================================
// BOOTSTRAP LOGIN PAGE
// ==========================================================================
async function init() {
  await initDatabase();
  await loadDatabase();
  loadSession();
  initDarkTheme();
  
  if (state.user) {
    // If already logged in, redirect to POS
    window.location.href = './pos/pos.html';
  } else {
    renderLoginScreen();
  }
}

window.addEventListener('DOMContentLoaded', init);
