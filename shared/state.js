// ==========================================================================
// STATE MANAGEMENT (WITH MPA SUPPORT)
// ==========================================================================
let state = {
  user: null, // { username: '', role: 'admin'|'staff' }
  products: [],
  orders: [],
  materials: [],
  purchases: [],
  cart: [], // { product: {}, qty: 1, sweetness: '', topping: '', notes: '', toppingPrice: 0 }
  activeTab: 'pos', // Not strictly needed in MPA but kept for compatibility
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

async function verifyAuth(username, password) {
  if (state.dbMode === 'supabase' && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('pos_users').select('*').eq('username', username).eq('password', password).single();
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

// Session Management (Auth)
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

// App State Management (for Multi-Page App)
// Saves volatile state (like cart) to sessionStorage so it survives page reloads
function saveAppState() {
  const appState = {
    cart: state.cart,
    selectedCategory: state.selectedCategory,
    selectedChannel: state.selectedChannel,
    orderNumber: state.orderNumber,
    searchQuery: state.searchQuery
  };
  sessionStorage.setItem('pos_app_state', JSON.stringify(appState));
}

function loadAppState() {
  const saved = sessionStorage.getItem('pos_app_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.cart) state.cart = parsed.cart;
      if (parsed.selectedCategory) state.selectedCategory = parsed.selectedCategory;
      if (parsed.selectedChannel) state.selectedChannel = parsed.selectedChannel;
      if (parsed.orderNumber) state.orderNumber = parsed.orderNumber;
      if (parsed.searchQuery) state.searchQuery = parsed.searchQuery;
    } catch (e) {
      console.error('Failed to parse saved app state', e);
    }
  }
}

// Intercept state changes to automatically save
const originalPush = Array.prototype.push;
const originalSplice = Array.prototype.splice;
// A naive proxy isn't strictly necessary, we will just call saveAppState() manually when cart updates.

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
