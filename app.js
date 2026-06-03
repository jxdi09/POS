// ==========================================================================
// DATABASE (SUPABASE & INDEXEDDB) INITIALIZATION
// ==========================================================================
const SUPABASE_URL = 'https://daluagnbzamoxwqyvlao.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbHVhZ25iemFtb3h3cXl2bGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzIxNTcsImV4cCI6MjA5NjA0ODE1N30.ukWMhARHCtpCQFugWqhhRIv2aC4bj67Ch_C5nHFCln8';

let supabase = null;
if (window.supabase && window.supabase.createClient) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Dexie.js (IndexedDB local database fallback)
const db = new Dexie('SweetPOSDatabase');
db.version(1).stores({
  users: 'id, username, password, role',
  products: 'id, name, category, price, cost, stock, image',
  orders: 'id, date, channel, reference, items, subtotal, total, totalCost, gpRate, gpAmount, netRevenue, profit',
  settings: 'key, value'
});

// Mock Initial Data (for fallback bootstrap)
const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'ชานมไต้หวันบับเบิ้ล (Bubble Milk Tea)', category: 'drinks', price: 55, cost: 20, stock: 99, image: '' },
  { id: 'p2', name: 'ชาเขียวมัทฉะลาเต้ (Matcha Latte)', category: 'drinks', price: 65, cost: 25, stock: 50, image: '' },
  { id: 'p3', name: 'โกโก้เย็นสูตรเข้มข้น (Rich Iced Cocoa)', category: 'drinks', price: 60, cost: 22, stock: 80, image: '' },
  { id: 'p4', name: 'ครัวซองต์เนยสดฝรั่งเศส (Butter Croissant)', category: 'snacks', price: 75, cost: 35, stock: 20, image: '' },
  { id: 'p5', name: 'บราวนี่ดาร์กช็อกโกแลต (Dark Chocolate Brownie)', category: 'snacks', price: 60, cost: 24, stock: 25, image: '' },
  { id: 'p6', name: 'บลูเบอร์รี่ชีสพาย (Blueberry Cheese Pie)', category: 'snacks', price: 85, cost: 40, stock: 15, image: '' },
  { id: 'p7', name: 'กาแฟเอสเพรสโซ่เย็น (Iced Espresso)', category: 'drinks', price: 55, cost: 18, stock: 100, image: '' },
  { id: 'p8', name: 'คุกกี้เนยสดช็อกชิพ (Chocolate Chip Cookies)', category: 'snacks', price: 45, cost: 18, stock: 40, image: '' }
];

const INITIAL_ORDERS = [
  { id: 'o1', date: '2026-06-03T10:15:00.000Z', channel: 'lineman', reference: '#4821', items: [{ name: 'ชานมไต้หวันบับเบิ้ล (Bubble Milk Tea)', qty: 2, price: 55, cost: 20, options: 'หวาน 50%, เพิ่มไข่มุก (+10฿)' }], subtotal: 120, total: 120, totalCost: 40, gpRate: 30, gpAmount: 36, netRevenue: 84, profit: 44 },
  { id: 'o2', date: '2026-06-03T11:30:00.000Z', channel: 'grab', reference: '#G-9481', items: [{ name: 'ชาเขียวมัทฉะลาเต้ (Matcha Latte)', qty: 1, price: 65, cost: 25, options: 'หวาน 25%' }, { name: 'บราวนี่ดาร์กช็อกโกแลต (Dark Chocolate Brownie)', qty: 1, price: 60, cost: 24, options: '' }], subtotal: 125, total: 125, totalCost: 49, gpRate: 30, gpAmount: 37.5, netRevenue: 87.5, profit: 38.5 },
  { id: 'o3', date: '2026-06-03T13:45:00.000Z', channel: 'walkin', reference: '', items: [{ name: 'ครัวซองต์เนยสดฝรั่งเศส (Butter Croissant)', qty: 2, price: 75, cost: 35, options: '' }, { name: 'กาแฟเอสเพรสโซ่เย็น (Iced Espresso)', qty: 1, price: 55, cost: 18, options: 'หวาน 100%' }], subtotal: 205, total: 205, totalCost: 88, gpRate: 0, gpAmount: 0, netRevenue: 205, profit: 117 }
];

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
let state = {
  user: null, // { username: '', role: 'admin'|'staff' }
  products: [],
  orders: [],
  cart: [], // { product: {}, qty: 1, sweetness: '', topping: '', notes: '', toppingPrice: 0 }
  activeTab: 'pos', // 'pos' | 'inventory' | 'reports' | 'settings'
  selectedCategory: 'all',
  selectedChannel: 'walkin', // 'lineman' | 'grab' | 'walkin'
  orderNumber: '',
  searchQuery: '',
  editingProductId: null,
  activeModifierItem: null,
  
  // Database connection statuses
  dbMode: 'local', // 'local' | 'supabase'
  dbStatus: 'offline', // 'online' | 'offline'
  
  shopProfile: {
    name: 'Sweet & Sip Shop',
    phone: '081-234-5678',
    address: 'ร้านน้ำและขนมออนไลน์',
    receiptFooter: '*** ขอบคุณที่อุดหนุนครับ/ค่ะ ***\nมีปัญหากับออร์เดอร์ ติดต่อเราได้ทาง LINE'
  },
  gpRates: {
    lineman: 30,
    grab: 30,
    walkin: 0
  },
  darkTheme: false
};

// ==========================================================================
// UNIFIED DATA REPOSITORY (LOCAL DEXIE & CLOUD SUPABASE)
// ==========================================================================
async function initDatabase() {
  state.dbMode = 'local';
  state.dbStatus = 'offline';

  if (supabase) {
    try {
      // Test select single row from user table
      const { data, error } = await supabase.from('pos_users').select('id').limit(1);
      if (!error) {
        state.dbMode = 'supabase';
        state.dbStatus = 'online';
        console.log('Database Status: Connected to Supabase Cloud Database');
      } else {
        console.warn('Database Status: Supabase select error. Falling back to local db.', error);
      }
    } catch (e) {
      console.warn('Database Status: Supabase connect error. Falling back to local db.', e);
    }
  }

  // Ensure default users and settings in Local Dexie
  const userCount = await db.users.count();
  if (userCount === 0) {
    await db.users.bulkAdd([
      { id: 'u-admin', username: 'admin', password: '1234', role: 'admin' },
      { id: 'u-staff', username: 'staff', password: '1234', role: 'staff' }
    ]);
  }

  const productCount = await db.products.count();
  if (productCount === 0) {
    for (let p of INITIAL_PRODUCTS) {
      await db.products.add(p);
    }
  }

  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.bulkAdd([
      { key: 'shop_profile', value: state.shopProfile },
      { key: 'gp_rates', value: state.gpRates }
    ]);
  }
  
  // Seed sample orders to Dexie if empty
  const ordersCount = await db.orders.count();
  if (ordersCount === 0) {
    for (let o of INITIAL_ORDERS) {
      await db.orders.add(o);
    }
  }
}

async function loadDatabase() {
  try {
    // 1. Fetch settings
    let settingsList = [];
    if (state.dbMode === 'supabase' && supabase) {
      try {
        const { data, error } = await supabase.from('pos_settings').select('*');
        if (!error && data) {
          settingsList = data;
          for (let s of data) {
            await db.settings.put(s);
          }
        }
      } catch (e) { console.warn(e); }
    }
    
    if (settingsList.length === 0) {
      settingsList = await db.settings.toArray();
    }

    const profileSetting = settingsList.find(s => s.key === 'shop_profile');
    if (profileSetting) {
      state.shopProfile = typeof profileSetting.value === 'string' ? JSON.parse(profileSetting.value) : profileSetting.value;
    }
    const gpSetting = settingsList.find(s => s.key === 'gp_rates');
    if (gpSetting) {
      state.gpRates = typeof gpSetting.value === 'string' ? JSON.parse(gpSetting.value) : gpSetting.value;
    }

    // 2. Fetch products
    state.products = await getDbProducts();

    // 3. Fetch orders
    state.orders = await getDbOrders();
  } catch (error) {
    console.error('Failed to load database properties:', error);
  }
}

async function getDbProducts() {
  if (state.dbMode === 'supabase' && supabase) {
    try {
      const { data, error } = await supabase.from('pos_products').select('*');
      if (!error && data) {
        await db.products.clear();
        for (let p of data) {
          p.price = parseFloat(p.price);
          p.cost = parseFloat(p.cost);
          p.stock = parseInt(p.stock);
          await db.products.put(p);
        }
        return data;
      }
    } catch (e) { console.warn(e); }
  }
  return await db.products.toArray();
}

async function getDbOrders() {
  if (state.dbMode === 'supabase' && supabase) {
    try {
      const { data, error } = await supabase.from('pos_orders').select('*');
      if (!error && data) {
        await db.orders.clear();
        for (let o of data) {
          if (typeof o.items === 'string') o.items = JSON.parse(o.items);
          o.subtotal = parseFloat(o.subtotal);
          o.total = parseFloat(o.total);
          o.totalCost = parseFloat(o.total_cost !== undefined ? o.total_cost : o.totalCost);
          o.gpRate = parseFloat(o.gp_rate !== undefined ? o.gp_rate : o.gpRate);
          o.gpAmount = parseFloat(o.gp_amount !== undefined ? o.gp_amount : o.gpAmount);
          o.netRevenue = parseFloat(o.net_revenue !== undefined ? o.net_revenue : o.netRevenue);
          o.profit = parseFloat(o.profit);
          await db.orders.put(o);
        }
        return data.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    } catch (e) { console.warn(e); }
  }
  const localOrders = await db.orders.toArray();
  return localOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function saveDbProduct(product) {
  await db.products.put(product);
  
  if (state.dbMode === 'supabase' && supabase) {
    try {
      await supabase.from('pos_products').upsert({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        image: product.image
      });
    } catch (e) { console.error(e); }
  }
}

async function deleteDbProduct(id) {
  await db.products.delete(id);
  
  if (state.dbMode === 'supabase' && supabase) {
    try {
      await supabase.from('pos_products').delete().eq('id', id);
    } catch (e) { console.error(e); }
  }
}

async function saveDbOrder(order) {
  await db.orders.put(order);
  
  if (state.dbMode === 'supabase' && supabase) {
    try {
      await supabase.from('pos_orders').upsert({
        id: order.id,
        date: order.date,
        channel: order.channel,
        reference: order.reference,
        items: typeof order.items === 'object' ? order.items : JSON.parse(order.items),
        subtotal: order.subtotal,
        total: order.total,
        total_cost: order.totalCost,
        gp_rate: order.gpRate,
        gp_amount: order.gpAmount,
        net_revenue: order.netRevenue,
        profit: order.profit
      });
    } catch (e) { console.error(e); }
  }
}

async function saveDbSettings(key, value) {
  await db.settings.put({ key, value });
  
  if (state.dbMode === 'supabase' && supabase) {
    try {
      await supabase.from('pos_settings').upsert({
        key: key,
        value: value
      });
    } catch (e) { console.error(e); }
  }
}

async function verifyAuth(username, password) {
  if (state.dbMode === 'supabase' && supabase) {
    try {
      const { data, error } = await supabase.from('pos_users').select('*').eq('username', username).eq('password', password).single();
      if (!error && data) {
        return { username: data.username, role: data.role };
      }
    } catch (e) { console.warn(e); }
  }
  
  const localUser = await db.users.where('username').equals(username).first();
  if (localUser && localUser.password === password) {
    return { username: localUser.username, role: localUser.role };
  }
  return null;
}

// Session Management
function loadSession() {
  const session = sessionStorage.getItem('pos_session');
  if (session) {
    state.user = JSON.parse(session);
  }
}

function saveSession(user) {
  state.user = user;
  sessionStorage.setItem('pos_session', JSON.stringify(user));
}

function clearSession() {
  state.user = null;
  sessionStorage.removeItem('pos_session');
}

// Dark Mode Management
function initDarkTheme() {
  const savedTheme = localStorage.getItem('pos_dark_theme');
  if (savedTheme === 'true') {
    state.darkTheme = true;
    document.body.classList.add('dark-theme');
  } else if (savedTheme === 'false') {
    state.darkTheme = false;
    document.body.classList.remove('dark-theme');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    state.darkTheme = prefersDark;
    if (prefersDark) {
      document.body.classList.add('dark-theme');
    }
  }
}

function toggleTheme() {
  state.darkTheme = !state.darkTheme;
  if (state.darkTheme) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  localStorage.setItem('pos_dark_theme', state.darkTheme);
}

// ==========================================================================
// RENDER ENGINE
// ==========================================================================
const appElement = document.getElementById('app');

function renderApp() {
  if (!state.user) {
    renderLoginScreen();
  } else {
    renderMainLayout();
  }
}

// ==========================================================================
// LOGIN VIEW
// ==========================================================================
let loginError = '';

function renderLoginScreen() {
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
      if (matchedUser.role === 'staff') {
        state.activeTab = 'pos';
      }
      renderApp();
    } else {
      loginError = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (ลองใช้ admin / 1234)';
      renderLoginScreen();
    }
  });
}

// ==========================================================================
// APP MAIN SHELL / LAYOUT
// ==========================================================================
function renderMainLayout() {
  const isAdmin = state.user.role === 'admin';
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
          <button class="nav-item ${state.activeTab === 'pos' ? 'active' : ''}" id="nav-pos">
            <svg viewBox="0 0 24 24" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
            หน้าหลัก POS
          </button>
          
          ${isAdmin ? `
            <button class="nav-item ${state.activeTab === 'inventory' ? 'active' : ''}" id="nav-inventory">
              <svg viewBox="0 0 24 24" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              จัดการต้นทุน/สินค้า
            </button>
            <button class="nav-item ${state.activeTab === 'reports' ? 'active' : ''}" id="nav-reports">
              <svg viewBox="0 0 24 24" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              รายงานกำไรขาดทุน
            </button>
            <button class="nav-item ${state.activeTab === 'settings' ? 'active' : ''}" id="nav-settings">
              <svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
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
        <!-- Tab Content Rendered Here -->
      </main>
    </div>
  `;

  // Attach Navigation Listeners
  document.getElementById('nav-pos').addEventListener('click', () => switchTab('pos'));
  if (isAdmin) {
    document.getElementById('nav-inventory').addEventListener('click', () => switchTab('inventory'));
    document.getElementById('nav-reports').addEventListener('click', () => switchTab('reports'));
    document.getElementById('nav-settings').addEventListener('click', () => switchTab('settings'));
  }
  document.getElementById('btn-logout').addEventListener('click', () => {
    clearSession();
    renderApp();
  });
  document.getElementById('btn-theme-toggle').addEventListener('click', () => {
    toggleTheme();
    renderMainLayout();
  });

  // Initial Content Render
  renderActiveTab();
}

function switchTab(tabId) {
  state.activeTab = tabId;
  renderMainLayout();
}

function renderActiveTab() {
  const contentWrapper = document.getElementById('main-content-wrapper');
  if (state.activeTab === 'pos') {
    renderPOS(contentWrapper);
  } else if (state.activeTab === 'inventory') {
    renderInventory(contentWrapper);
  } else if (state.activeTab === 'reports') {
    renderReports(contentWrapper);
  } else if (state.activeTab === 'settings') {
    renderSettings(contentWrapper);
  }
}

// ==========================================================================
// TAB 1: POS VIEW & LOGIC
// ==========================================================================
function renderPOS(container) {
  container.innerHTML = `
    <div class="pos-layout">
      <!-- Left Panel: Grid & Categories -->
      <div class="pos-catalog">
        <div class="catalog-header">
          <div class="search-bar">
            <svg viewBox="0 0 24 24" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="search-input" type="text" id="catalog-search" placeholder="ค้นหาเมนูเครื่องดื่ม / ขนม..." value="${state.searchQuery}">
          </div>
        </div>
        
        <!-- Category Tab Bar -->
        <div class="categories-tabs">
          <button class="category-tab ${state.selectedCategory === 'all' ? 'active' : ''}" data-cat="all">ทั้งหมด</button>
          <button class="category-tab ${state.selectedCategory === 'drinks' ? 'active' : ''}" data-cat="drinks">เครื่องดื่ม (Drinks)</button>
          <button class="category-tab ${state.selectedCategory === 'snacks' ? 'active' : ''}" data-cat="snacks">ขนม/เบเกอรี่ (Snacks)</button>
          <button class="category-tab ${state.selectedCategory === 'others' ? 'active' : ''}" data-cat="others">อื่นๆ (Others)</button>
        </div>

        <!-- Product Grid -->
        <div class="products-grid" id="pos-products-grid"></div>
      </div>

      <!-- Right Panel: Shopping Cart -->
      <div class="pos-cart">
        <div class="cart-header">
          <div class="cart-title">
            ออร์เดอร์ปัจจุบัน
            <span class="cart-count">${getCartItemsCount()}</span>
          </div>
          <button class="cart-clear" id="btn-clear-cart">ล้างตะกร้า</button>
        </div>

        <div class="cart-items" id="pos-cart-items"></div>

        <!-- Channel Select (Line Man, Grab, Walk-in) -->
        <div class="cart-channel-section">
          <label class="channel-label">ช่องทางรับออร์เดอร์</label>
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
              หน้าร้าน / อื่นๆ
            </button>
          </div>
          <button class="quick-paste-btn" id="btn-quick-paste">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            ⚡ คีย์ออร์เดอร์ด่วนจาก Grab/LINE MAN
          </button>
        </div>

        <!-- Cart Summary & Checkout -->
        <div class="cart-summary">
          ${state.selectedChannel !== 'walkin' ? `
            <input class="order-num-input" type="text" id="order-reference" placeholder="รหัสออร์เดอร์เดลิเวอรี่ (เช่น #4528)" value="${state.orderNumber}">
          ` : ''}
          <div class="summary-row">
            <span>จำนวนทั้งหมด</span>
            <span id="summary-qty">${getCartItemsCount()} ชิ้น</span>
          </div>
          <div class="summary-row total">
            <span>ยอดรวมสุทธิ</span>
            <span class="total-val">฿<span id="summary-total">${getCartTotal()}</span></span>
          </div>
          <button class="checkout-btn" id="btn-checkout" ${state.cart.length === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            ยืนยันการสั่งซื้อ &amp; พิมพ์ใบสั่งของ
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
        <p>ไม่พบรายการสินค้าที่ระบุ</p>
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
        ${p.image ? `<img src="${p.image}" class="product-img" alt="${p.name}">` : `<div class="product-placeholder">${p.category === 'drinks' ? '🥤' : '🍰'}</div>`}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <span class="product-price">฿${p.price}</span>
          <span class="product-stock ${isOutOfStock ? 'out' : ''}">${isOutOfStock ? 'หมด' : `คลัง: ${p.stock}`}</span>
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
        <p>ยังไม่มีสินค้าในตะกร้า</p>
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
              ${item.notes ? `<span style="color: var(--primary);">โน้ต: ${item.notes}</span>` : ''}
            </div>
          ` : ''}
        </div>
        <div class="cart-item-price-col">
          <div class="cart-item-total">฿${itemTotal}</div>
        </div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-item-notes-btn" data-index="${index}">แก้ไขโน้ต</button>
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
          alert(`ไม่สามารถเพิ่มจำนวนได้ สินค้าในคลังมีจำกัด (${product.stock} ชิ้น)`);
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
      const newNote = prompt('เพิ่มคำแนะนำพิเศษ/โน้ตสำหรับรายการนี้:', state.cart[idx].notes || '');
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

  if (qtyEl) qtyEl.textContent = `${count} ชิ้น`;
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
          ราคาพื้นฐาน: ฿${product.price}
        </div>

        ${isDrink ? `
          <!-- Sweetness Levels -->
          <div class="modifier-group">
            <div class="modifier-label">ระดับความหวาน</div>
            <div class="modifier-options" id="options-sweetness">
              <button class="modifier-btn" data-val="หวานปกติ (100%)">100%</button>
              <button class="modifier-btn" data-val="หวานน้อย (50%)">50%</button>
              <button class="modifier-btn" data-val="หวานน้อยมาก (25%)">25%</button>
              <button class="modifier-btn" data-val="ไม่หวานเลย (0%)">0%</button>
              <button class="modifier-btn" data-val="หวานมาก (120%)">120%</button>
            </div>
          </div>

          <!-- Toppings -->
          <div class="modifier-group">
            <div class="modifier-label">ท็อปปิ้งเพิ่มเติม</div>
            <div class="modifier-options" id="options-toppings">
              <button class="modifier-btn selected" data-val="" data-price="0">ไม่รับท็อปปิ้ง</button>
              <button class="modifier-btn" data-val="เพิ่มไข่มุก (+10฿)" data-price="10">ไข่มุก (+฿10)</button>
              <button class="modifier-btn" data-val="เพิ่มพุดดิ้งนม (+15฿)" data-price="15">พุดดิ้งนม (+฿15)</button>
              <button class="modifier-btn" data-val="เพิ่มบุกวุ้น (+10฿)" data-price="10">บุกวุ้น (+฿10)</button>
              <button class="modifier-btn" data-val="เพิ่มวิปครีม (+15฿)" data-price="15">วิปครีม (+฿15)</button>
            </div>
          </div>
        ` : `
          <!-- Option for snacks: Heat / Warm up -->
          <div class="modifier-group">
            <div class="modifier-label">บริการอุ่นร้อน</div>
            <div class="modifier-options" id="options-warm">
              <button class="modifier-btn selected" data-val="">ไม่ต้องอุ่น</button>
              <button class="modifier-btn" data-val="อุ่นร้อน">อุ่นร้อนให้ร้อนพร้อมทาน</button>
            </div>
          </div>
        `}

        <div class="form-group" style="margin-top: 15px;">
          <label class="form-label" style="font-size: 13px;">คำขอเพิ่มเติมถึงร้านค้า (โน้ต)</label>
          <input class="form-input" type="text" id="modal-notes" placeholder="เช่น แยกน้ำแข็ง, หวานธรรมชาติ...">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" id="modal-cancel-btn">ยกเลิก</button>
        <button class="btn-primary" id="modal-add-btn">ใส่ตะกร้า (฿${product.price})</button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('modal-close-btn').addEventListener('click', closeModifierModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModifierModal);

  let selectedSweetness = isDrink ? 'หวานปกติ (100%)' : '';
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
        document.getElementById('modal-add-btn').textContent = `ใส่ตะกร้า (฿${product.price + toppingPrice})`;
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
        alert(`ไม่สามารถเพิ่มจำนวนได้ สินค้าในคลังมีจำกัด (${product.stock} ชิ้น)`);
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
        <h3 class="modal-title">คีย์ออร์เดอร์ด่วนด้วยการวางข้อความ</h3>
        <button class="modal-close" id="paste-modal-close-btn">&times;</button>
      </div>
      <div class="modal-body paste-modal-body">
        <p class="paste-help-text">
          คัดลอกรายละเอียดคำสั่งซื้อจากแอป LINE MAN หรือ Grab แล้ววางลงในช่องนี้ ระบบจะวิเคราะห์หาชื่อเมนู จำนวน ความหวาน และท็อปปิ้ง เพื่อแอดลงบิลให้ทันทีโดยไม่ต้องคีย์แยกชิ้น
        </p>
        <textarea class="paste-textarea" id="paste-textarea-input" placeholder="ตัวอย่างข้อความ:
LINE MAN ออร์เดอร์ #4821
2x ชานมไต้หวันบับเบิ้ล (Bubble Milk Tea) (หวานน้อย (50%), เพิ่มไข่มุก)
1x บราวนี่ดาร์กช็อกโกแลต (Dark Chocolate Brownie) (อุ่นร้อน)"></textarea>
        <div class="paste-help-text">
          <strong>คุณสมบัติการตรวจจับ:</strong>
          <ul>
            <li>เปรียบเทียบคำและค้นหาเมนูในร้าน (รองรับภาษาไทย และภาษาอังกฤษ)</li>
            <li>ตรวจจับจำนวน เช่น 1x, x2 หรือ 1 ชิ้น</li>
            <li>ตรวจจับความหวาน (0%, 25%, 50%, 100%, 120%) และการอุ่นร้อน</li>
            <li>ตรวจจับรหัสออร์เดอร์จากหัวข้อ (เช่น #4821)</li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" id="paste-modal-cancel-btn">ยกเลิก</button>
        <button class="btn-primary" id="paste-modal-import-btn">นำเข้าตะกร้าสินค้า</button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('paste-modal-close-btn').addEventListener('click', closePasteModal);
  document.getElementById('paste-modal-cancel-btn').addEventListener('click', closePasteModal);
  
  document.getElementById('paste-modal-import-btn').addEventListener('click', () => {
    const text = document.getElementById('paste-textarea-input').value;
    if (!text.trim()) {
      alert('กรุณากรอกข้อความสรุปออร์เดอร์');
      return;
    }
    
    const parsed = parsePastedOrder(text);
    if (parsed.items.length === 0) {
      alert('วิเคราะห์ไม่สำเร็จ: ไม่พบรายชื่อสินค้าในข้อความที่ตรงกับเมนูของร้านค้า กรุณาตรวจเช็คตัวสะกดชื่อเมนูให้ตรงกัน');
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
  if (lowerText.includes('line man') || lowerText.includes('lineman') || lowerText.includes('ไลน์แมน')) {
    result.channel = 'lineman';
  } else if (lowerText.includes('grab') || lowerText.includes('แกร็บ')) {
    result.channel = 'grab';
  }

  // Detect reference number
  const refMatch = text.match(/#([a-zA-Z0-9-]+)/) || text.match(/ออร์เดอร์\s*#?([0-9]+)/i);
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
      const qtyMatch = cleanLine.match(/(\d+)\s*x/) || cleanLine.match(/x\s*(\d+)/) || cleanLine.match(/(\d+)\s*(ชิ้น|แก้ว|อัน)/);
      if (qtyMatch) {
        qty = parseInt(qtyMatch[1]);
      } else {
        const startNumber = cleanLine.match(/^\s*(\d+)\s+/);
        if (startNumber) {
          qty = parseInt(startNumber[1]);
        }
      }

      let sweetness = matchedProduct.category === 'drinks' ? 'หวานปกติ (100%)' : '';
      if (matchedProduct.category === 'drinks') {
        if (cleanLine.includes('50%') || cleanLine.includes('หวานน้อย') || cleanLine.includes('หวาน 50%')) {
          sweetness = 'หวานน้อย (50%)';
        } else if (cleanLine.includes('25%') || cleanLine.includes('หวานน้อยมาก') || cleanLine.includes('หวาน 25%')) {
          sweetness = 'หวานน้อยมาก (25%)';
        } else if (cleanLine.includes('0%') || cleanLine.includes('ไม่หวาน') || cleanLine.includes('หวาน 0%')) {
          sweetness = 'ไม่หวานเลย (0%)';
        } else if (cleanLine.includes('120%') || cleanLine.includes('หวานมาก') || cleanLine.includes('หวาน 120%')) {
          sweetness = 'หวานมาก (120%)';
        }
      }

      let topping = '';
      let toppingPrice = 0;
      if (matchedProduct.category === 'drinks') {
        if (cleanLine.includes('ไข่มุก')) {
          topping = 'เพิ่มไข่มุก (+10฿)';
          toppingPrice = 10;
        } else if (cleanLine.includes('พุดดิ้ง')) {
          topping = 'เพิ่มพุดดิ้งนม (+15฿)';
          toppingPrice = 15;
        } else if (cleanLine.includes('บุก') || cleanLine.includes('วุ้น')) {
          topping = 'เพิ่มบุกวุ้น (+10฿)';
          toppingPrice = 10;
        } else if (cleanLine.includes('วิปครีม') || cleanLine.includes('วิป')) {
          topping = 'เพิ่มวิปครีม (+15฿)';
          toppingPrice = 15;
        }
      } else {
        if (cleanLine.includes('อุ่น') || cleanLine.includes('ร้อน')) {
          topping = 'อุ่นร้อน';
        }
      }

      let notes = '';
      const parenthesesMatch = line.match(/[\(\[\{](.+?)[\)\]\}]/g);
      if (parenthesesMatch) {
        const collected = parenthesesMatch.map(m => m.slice(1, -1)).filter(n => {
          const l = n.toLowerCase();
          return !l.includes('หวาน') && !l.includes('%') && !l.includes('ไข่มุก') && !l.includes('พุดดิ้ง') && !l.includes('บุก') && !l.includes('วิป') && !l.includes('อุ่น') && !l.includes('ร้อน');
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
      alert(`สินค้า "${item.product.name}" มีจำนวนสินค้าไม่พอในสต็อก (มีเหลือเพียง ${item.product.stock} ชิ้น)`);
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
      options: mods + (item.notes ? ` (โน้ต: ${item.notes})` : '')
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

  let channelLabel = 'หน้าร้าน / อื่นๆ';
  if (state.selectedChannel === 'lineman') channelLabel = 'LINE MAN';
  if (state.selectedChannel === 'grab') channelLabel = 'Grab';

  printArea.innerHTML = `
    <div class="receipt-container">
      <div class="receipt-header">
        <div class="receipt-title">${state.shopProfile.name}</div>
        <div class="receipt-subtitle">${state.shopProfile.address}</div>
        <div class="receipt-subtitle">โทร. ${state.shopProfile.phone}</div>
        <div class="receipt-channel-badge">${channelLabel} ${newOrder.reference}</div>
      </div>
      
      <div class="receipt-metadata">
        <div><strong>บิลเลขที่:</strong> ${newOrder.id.toUpperCase()}</div>
        <div><strong>วันที่สั่ง:</strong> ${thaiDate}</div>
        <div><strong>ผู้ทำรายการ:</strong> ${state.user.username}</div>
      </div>
      
      <table class="receipt-items-table">
        <thead>
          <tr>
            <th>รายการ</th>
            <th style="width: 15%; text-align: center;">จำนวน</th>
            <th class="price-col" style="width: 25%;">ยอดรวม</th>
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
          <span>จำนวนทั้งหมด</span>
          <span>${getCartItemsCount()} ชิ้น</span>
        </div>
        <div class="receipt-summary-row total">
          <span>ยอดรวมทั้งสิ้น</span>
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
// TAB 2: INVENTORY & COSTING VIEW
// ==========================================================================
function renderInventory(container) {
  state.editingProductId = null;
  
  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">ระบบจัดการสินค้าและคำนวณต้นทุน</h2>
      <button class="btn-add-product" id="btn-show-add-form" style="display: none;">เพิ่มสินค้าใหม่</button>
    </div>
    
    <div class="inventory-grid">
      <!-- Left Form Sidebar -->
      <div class="inventory-form-panel" id="product-form-container"></div>
      
      <!-- Right Products Table -->
      <div class="inventory-list-panel">
        <div class="panel-title" style="margin: 24px 24px 0 24px; border: none; padding: 0;">รายการสินค้าในร้าน</div>
        <div class="table-responsive">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>รายละเอียดสินค้า</th>
                <th>หมวดหมู่</th>
                <th>ราคาขาย</th>
                <th>ต้นทุนสินค้า</th>
                <th>กำไรต่อชิ้น</th>
                <th>สต็อก</th>
                <th style="text-align: center;">จัดการ</th>
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
    <div class="panel-title">${isEditing ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}</div>
    <form id="product-form">
      <div class="form-group">
        <label class="form-label">รูปภาพสินค้า</label>
        <div class="image-upload-box" id="image-upload-trigger">
          ${product && product.image ? `
            <img src="${product.image}" id="product-preview" alt="preview">
          ` : `
            <div class="upload-placeholder" id="upload-placeholder-content">
              <svg viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>แตะเพื่อเลือกรูปภาพ</span>
            </div>
          `}
          <input type="file" id="product-image-file" accept="image/*" style="display: none;">
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label" for="prod-name">ชื่อสินค้า</label>
        <input class="form-input" type="text" id="prod-name" placeholder="เช่น ชานมบับเบิ้ล" value="${product ? product.name : ''}" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-category">หมวดหมู่</label>
        <select class="form-input" id="prod-category" required>
          <option value="drinks" ${product && product.category === 'drinks' ? 'selected' : ''}>เครื่องดื่ม (Drinks)</option>
          <option value="snacks" ${product && product.category === 'snacks' ? 'selected' : ''}>ขนม/เบเกอรี่ (Snacks)</option>
          <option value="others" ${product && product.category === 'others' ? 'selected' : ''}>อื่นๆ (Others)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-price">ราคาขาย (บาท)</label>
        <input class="form-input" type="number" id="prod-price" placeholder="เช่น 60" value="${product ? product.price : ''}" required min="0" step="any">
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-cost">ต้นทุนต่อหน่วย (บาท) <span style="color: var(--text-secondary); font-weight: normal;">*สำหรับคำนวณกำไร</span></label>
        <input class="form-input" type="number" id="prod-cost" placeholder="เช่น 20" value="${product ? product.cost : ''}" required min="0" step="any">
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-stock">จำนวนสต็อกเริ่มต้น</label>
        <input class="form-input" type="number" id="prod-stock" placeholder="เช่น 100" value="${product ? product.stock : ''}" required min="0">
      </div>

      <div style="display: flex; gap: 10px; margin-top: 24px;">
        ${isEditing ? `<button class="btn-secondary" type="button" id="btn-cancel-edit" style="padding: 12px; flex: 1;">ยกเลิก</button>` : ''}
        <button class="btn-primary" type="submit" style="padding: 12px; flex: 2;">
          ${isEditing ? 'บันทึกการแก้ไข' : 'บันทึกสินค้าใหม่'}
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
      if (!confirm('คำเตือน: ราคาขายน้อยกว่าต้นทุนสินค้า แน่ใจหรือไม่ว่าต้องการตั้งค่าราคานี้?')) {
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

    let catName = 'อื่นๆ';
    if (p.category === 'drinks') catName = 'เครื่องดื่ม';
    if (p.category === 'snacks') catName = 'ขนม/เบเกอรี่';

    tr.innerHTML = `
      <td>
        <div class="row-product-info">
          ${p.image ? `<img src="${p.image}" class="row-product-thumb" alt="thumb">` : `<div class="row-product-thumb" style="display: flex; align-items: center; justify-content: center; font-size: 20px;">${p.category === 'drinks' ? '🥤' : '🍰'}</div>`}
          <div style="font-weight: 600;">${p.name}</div>
        </div>
      </td>
      <td><span style="color: var(--text-secondary);">${catName}</span></td>
      <td style="font-family: var(--font-latin); font-weight: 600;">฿${p.price}</td>
      <td style="font-family: var(--font-latin); color: var(--text-secondary);">฿${p.cost}</td>
      <td style="font-family: var(--font-latin);">
        <div style="font-weight: 600; color: ${profit >= 0 ? 'var(--secondary)' : '#FF4D4F'}">฿${profit}</div>
        <span class="margin-pill ${marginClass}">${margin}% มาร์จิน</span>
      </td>
      <td style="font-family: var(--font-latin); font-weight: 600; color: ${p.stock <= 5 ? '#FF4D4F' : 'inherit'}">${p.stock}</td>
      <td style="text-align: center;">
        <div class="action-buttons" style="justify-content: center;">
          <button class="btn-icon btn-edit-product" data-id="${p.id}" title="แก้ไข">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon btn-delete-product" data-id="${p.id}" title="ลบ">
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
      if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${targetP.name}"?`)) {
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
// TAB 3: REPORTS & FINANCIAL DASHBOARD VIEW (WITH SVG CHARTS)
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
      <h2 class="page-title">สรุปรายงานยอดขายและกำไรขาดทุน</h2>
    </div>

    <!-- Financial Stats Row -->
    <div class="report-grid-stats">
      <div class="stat-card">
        <div class="stat-card-title">ยอดขายรวม (Gross Sales)</div>
        <div class="stat-card-value">฿${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</div>
        <div class="stat-card-footer">หักค่าคอมมิชชั่น GP แล้วจะเหลือรายรับจริง</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-title">หักค่าธรรมเนียม GP รวม</div>
        <div class="stat-card-value" style="color: #FF4D4F;">-฿${totalGpDeductions.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</div>
        <div class="stat-card-footer">เฉลี่ยตามจริงตามออร์เดอร์ LINE MAN / Grab</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-title">กำไรสุทธิ (Net Profit)</div>
        <div class="stat-card-value profit ${netProfit < 0 ? 'loss' : ''}">฿${netProfit.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</div>
        <div class="stat-card-footer">คำนวณจาก (รายรับจริง - ต้นทุนของคีย์ในระบบ)</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-title">อัตรากำไรหลังหัก GP &amp; ต้นทุน</div>
        <div class="stat-card-value" style="color: var(--primary);">${overallMargin}%</div>
        <div class="stat-card-footer">จากรายรับจริงรวม ฿${netRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
      </div>
    </div>

    <!-- SVG Charts Row -->
    <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 24px;">
      <div style="display: grid; grid-template-columns: 1fr; gap: 20px;" class="settings-grid">
        <!-- SVG Daily Sales Bar Chart -->
        <div class="svg-chart-container">
          <div class="svg-chart-title">
            <span>ยอดขายและกำไรสุทธิย้อนหลัง 7 วัน</span>
            <div style="display:flex; gap:12px; font-size:11px;">
              <span style="color:var(--primary);">■ ยอดขายรวม</span>
              <span style="color:var(--secondary);">■ กำไรสุทธิ</span>
            </div>
          </div>
          <div id="chart-daily-container" style="height: 180px;">
            ${render7DaySalesChart()}
          </div>
        </div>

        <!-- SVG Category Donut Chart -->
        <div class="svg-chart-container">
          <div class="svg-chart-title">สัดส่วนยอดขายตามหมวดหมู่สินค้า</div>
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
        <div class="panel-title" style="margin-bottom: 24px;">วิเคราะห์ช่องทางการขาย (Delivery Channels)</div>
        
        <!-- Line Man -->
        <div class="platform-row">
          <div class="platform-indicator lineman"></div>
          <div class="platform-details">
            <div class="platform-title-row">
              <span>LINE MAN (${linemanOrders} ออร์เดอร์)</span>
              <span>ยอดขาย: ฿${linemanRevenue.toLocaleString()} (กำไร: ฿${linemanProfit.toLocaleString()})</span>
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
              <span>Grab (${grabOrders} ออร์เดอร์)</span>
              <span>ยอดขาย: ฿${grabRevenue.toLocaleString()} (กำไร: ฿${grabProfit.toLocaleString()})</span>
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
              <span>หน้าร้าน / อื่นๆ (${walkinOrders} ออร์เดอร์)</span>
              <span>ยอดขาย: ฿${walkinRevenue.toLocaleString()} (กำไร: ฿${walkinProfit.toLocaleString()})</span>
            </div>
            <div class="platform-bar-bg">
              <div class="platform-bar-fill walkin" style="width: ${walkinPercent}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Card: Backup Database options -->
      <div class="backup-panel">
        <div class="panel-title">สำรองไฟล์และกู้คืนข้อมูล (Database Backups)</div>
        <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.5;">
          เพื่อป้องกันข้อมูลการขายสูญหาย โปรดดาวน์โหลดและสำรองข้อมูลไว้สม่ำเสมอ หากเครื่อง iPad ตกหล่นหรือชำรุดเสียหาย คุณสามารถดาวน์โหลดไฟล์นี้ไปอัปโหลดใส่ iPad เครื่องใหม่หรือระบบคลาวด์เพื่อกู้คืนได้ทันที
        </p>
        <div class="backup-buttons">
          <button class="btn-backup" id="btn-export-db">ดาวน์โหลดไฟล์สำรองข้อมูล (.json)</button>
          <label class="btn-restore-label" for="import-db-file">
            เลือกไฟล์เพื่อกู้คืนข้อมูล
            <input type="file" id="import-db-file" accept=".json" style="display: none;">
          </label>
        </div>
      </div>
    </div>

    <!-- Bottom logs panel -->
    <div class="inventory-list-panel" style="margin-bottom: 30px;">
      <div class="panel-title" style="margin: 24px 24px 0 24px; border: none; padding: 0;">ประวัติคำสั่งซื้อทั้งหมด (Transaction History)</div>
      <div class="table-responsive">
        <table class="inventory-table">
          <thead>
            <tr>
              <th>วันที่/เวลา</th>
              <th>บิลเลขที่</th>
              <th>ช่องทาง</th>
              <th>รายละเอียดรายการ</th>
              <th>ยอดรวม</th>
              <th>ค่า GP หัก</th>
              <th>กำไรสุทธิ</th>
              <th style="text-align: center;">พิมพ์ซ้ำ</th>
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
        <title>ยอดขาย ${d.label}: ฿${d.sales.toLocaleString()}</title>
      </rect>
      <rect x="${x + barWidth + 3}" y="${profitY}" width="${barWidth}" height="${profitHeight}" fill="var(--secondary)" rx="3" class="chart-bar-hover">
        <title>กำไรสุทธิ ${d.label}: ฿${d.profit.toLocaleString()}</title>
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
    return `<div style="text-align:center; padding:40px; color:var(--text-light);">ยังไม่มีข้อมูลยอดขายในระบบ</div>`;
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
          <strong>เครื่องดื่ม:</strong> ฿${catSales.drinks.toLocaleString()} (${Math.round(drinkPct*100)}%)
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background-color:var(--secondary);"></span>
          <strong>ขนม/เบเกอรี่:</strong> ฿${catSales.snacks.toLocaleString()} (${Math.round(snackPct*100)}%)
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background-color:var(--accent);"></span>
          <strong>อื่นๆ:</strong> ฿${catSales.others.toLocaleString()} (${Math.round(otherPct*100)}%)
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
          ยังไม่พบข้อมูลประวัติยอดขายสินค้าในระบบ
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

    let chLabel = 'หน้าร้าน';
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

  let channelLabel = 'หน้าร้าน / อื่นๆ';
  if (order.channel === 'lineman') channelLabel = 'LINE MAN';
  if (order.channel === 'grab') channelLabel = 'Grab';

  printArea.innerHTML = `
    <div class="receipt-container">
      <div class="receipt-header">
        <div class="receipt-title">${state.shopProfile.name}</div>
        <div class="receipt-subtitle">${state.shopProfile.address}</div>
        <div class="receipt-subtitle">โทร. ${state.shopProfile.phone}</div>
        <div class="receipt-channel-badge">${channelLabel} ${order.reference} (พิมพ์ซ้ำ)</div>
      </div>
      
      <div class="receipt-metadata">
        <div><strong>บิลเลขที่:</strong> ${order.id.toUpperCase()}</div>
        <div><strong>วันที่สั่ง:</strong> ${thaiDate}</div>
        <div><strong>ผู้ทำรายการ:</strong> ${state.user.username}</div>
      </div>
      
      <table class="receipt-items-table">
        <thead>
          <tr>
            <th>รายการ</th>
            <th style="width: 15%; text-align: center;">จำนวน</th>
            <th class="price-col" style="width: 25%;">ยอดรวม</th>
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
          <span>จำนวนทั้งหมด</span>
          <span>${order.items.reduce((s, i) => s + i.qty, 0)} ชิ้น</span>
        </div>
        <div class="receipt-summary-row total">
          <span>ยอดรวมทั้งสิ้น</span>
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
// TAB 4: SETTINGS & GP CONFIGURATION VIEW
// ==========================================================================
function renderSettings(container) {
  let dbStatusLabel = state.dbMode === 'supabase' && state.dbStatus === 'online' 
    ? `<span class="db-status-pill online">● เชื่อมต่อ Supabase แล้ว</span>` 
    : `<span class="db-status-pill offline">● ใช้งานออฟไลน์เครื่องนี้ (Local IndexedDB)</span>`;

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">ตั้งค่าร้านค้าและระบบเชื่อมต่อ</h2>
      ${dbStatusLabel}
    </div>

    <div class="settings-grid">
      <!-- Shop Profile Form -->
      <div class="inventory-form-panel">
        <div class="panel-title">ข้อมูลร้านค้า (ใบเสร็จ)</div>
        <form id="settings-profile-form">
          <div class="form-group">
            <label class="form-label" for="set-shop-name">ชื่อร้านค้า</label>
            <input class="form-input" type="text" id="set-shop-name" value="${state.shopProfile.name}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="set-shop-phone">เบอร์โทรศัพท์</label>
            <input class="form-input" type="text" id="set-shop-phone" value="${state.shopProfile.phone}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="set-shop-address">ที่อยู่ / รายละเอียดร้าน</label>
            <input class="form-input" type="text" id="set-shop-address" value="${state.shopProfile.address}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="set-shop-footer">ข้อความท้ายใบเสร็จ</label>
            <textarea class="form-input" id="set-shop-footer" rows="3" style="resize:none; font-family:inherit;" required>${state.shopProfile.receiptFooter}</textarea>
          </div>
          <button class="btn-primary" type="submit" style="width:100%; padding:12px; margin-top:10px;">บันทึกข้อมูลร้านค้า</button>
        </form>
      </div>

      <!-- GP Settings Form -->
      <div class="inventory-form-panel" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div class="panel-title">ตั้งค่าคอมมิชชั่นเดลิเวอรี่ (GP%)</div>
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
              <label class="form-label" for="set-gp-walkin">หน้าร้าน / อื่นๆ GP (%)</label>
              <input class="form-input" type="number" id="set-gp-walkin" min="0" max="100" value="${state.gpRates.walkin}" readonly style="background-color: var(--bg-app); opacity: 0.7;">
            </div>
            <button class="btn-primary" type="submit" style="width:100%; padding:12px; margin-top:10px;">บันทึกค่า GP</button>
          </form>
        </div>

        <div style="border-top:1px solid var(--border-color); padding-top:20px; margin-top:20px;">
          <div class="panel-title" style="border:none; padding:0; margin-bottom:10px;">ข้อมูลฐานข้อมูล Supabase</div>
          <p style="font-size:12px; color:var(--text-secondary); line-height:1.5;">
            โครงการนี้เชื่อมต่อฐานข้อมูลปลายทางไปยัง Supabase URL:<br>
            <code style="font-family:var(--font-latin); word-break:break-all;">${SUPABASE_URL}</code>
          </p>
          <p style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-top:8px;">
            หากต้องการเปลี่ยนฐานข้อมูล สามารถติดต่อผู้พัฒนาโปรแกรม หรือแก้ไขไฟล์ <code>app.js</code> ได้โดยตรง
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
    alert('บันทึกข้อมูลร้านค้าสำเร็จ!');
    renderSettings(container);
  });

  document.getElementById('settings-gp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const lineman = parseFloat(document.getElementById('set-gp-lineman').value);
    const grab = parseFloat(document.getElementById('set-gp-grab').value);

    state.gpRates = { lineman, grab, walkin: 0 };
    await saveDbSettings('gp_rates', state.gpRates);
    alert('บันทึกค่า GP สำเร็จ!');
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
        alert('รูปแบบไฟล์ข้อมูลสำรองไม่ถูกต้อง ไม่สามารถกู้คืนข้อมูลได้');
        return;
      }

      if (confirm(`ต้องการเขียนทับข้อมูลในระบบด้วยไฟล์สำรองนี้หรือไม่?\n(สินค้า: ${parsed.products.length} รายการ, คำสั่งซื้อ: ${parsed.orders.length} รายการ)`)) {
        
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
        if (state.dbMode === 'supabase' && supabase) {
          try {
            // Delete all and insert updated
            await supabase.from('pos_products').delete().neq('id', 'dummy');
            for (let p of parsed.products) {
              await supabase.from('pos_products').insert(p);
            }

            await supabase.from('pos_orders').delete().neq('id', 'dummy');
            for (let o of parsed.orders) {
              await supabase.from('pos_orders').insert({
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
              await supabase.from('pos_settings').upsert({ key: 'shop_profile', value: parsed.shopProfile });
            }
            if (parsed.gpRates) {
              await supabase.from('pos_settings').upsert({ key: 'gp_rates', value: parsed.gpRates });
            }
          } catch (e) {
            console.error('Failed to sync restored database to Supabase:', e);
          }
        }
        
        // Reload State & Render
        await loadDatabase();
        alert('กู้คืนข้อมูลและเชื่อมต่อระบบเสร็จเรียบร้อยแล้ว!');
        renderReports(document.getElementById('main-content-wrapper'));
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ==========================================================================
// SYSTEM BOOTSTRAP
// ==========================================================================
async function init() {
  await initDatabase();
  await loadDatabase();
  loadSession();
  initDarkTheme();
  renderApp();
}

window.addEventListener('DOMContentLoaded', init);
