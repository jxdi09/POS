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
db.version(2).stores({
  materials: 'id, name, unit',
  purchases: 'id, material_id, date, quantity, unit_price, total_price, note'
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
// UNIFIED DATA REPOSITORY (LOCAL DEXIE & CLOUD SUPABASE)
// ==========================================================================
async function initDatabase() {
  state.dbMode = 'local';
  state.dbStatus = 'offline';

  if (typeof supabase !== 'undefined' && supabase) {
    try {
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
  
  const ordersCount = await db.orders.count();
  if (ordersCount === 0) {
    for (let o of INITIAL_ORDERS) {
      await db.orders.add(o);
    }
  }
}

async function loadDatabase() {
  try {
    let settingsList = [];
    if (state.dbMode === 'supabase' && typeof supabase !== 'undefined' && supabase) {
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

    state.products = await getDbProducts();
    state.orders = await getDbOrders();
    state.materials = await getDbMaterials();
    state.purchases = await getDbPurchases();
  } catch (error) {
    console.error('Failed to load database properties:', error);
  }
}

async function getDbProducts() {
  if (state.dbMode === 'supabase' && typeof supabase !== 'undefined' && supabase) {
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
  if (state.dbMode === 'supabase' && typeof supabase !== 'undefined' && supabase) {
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

async function getDbMaterials() {
  if (state.dbMode === 'supabase' && typeof supabase !== 'undefined' && supabase) {
    try {
      const { data, error } = await supabase.from('pos_materials').select('*');
      if (!error && data) {
        await db.materials.clear();
        for (let m of data) {
          await db.materials.put(m);
        }
        return data;
      }
    } catch (e) { console.warn(e); }
  }
  return await db.materials.toArray();
}

async function getDbPurchases() {
  if (state.dbMode === 'supabase' && typeof supabase !== 'undefined' && supabase) {
    try {
      const { data, error } = await supabase.from('pos_purchases').select('*');
      if (!error && data) {
        await db.purchases.clear();
        for (let p of data) {
          p.quantity = parseFloat(p.quantity);
          p.unit_price = parseFloat(p.unit_price);
          p.total_price = parseFloat(p.total_price);
          await db.purchases.put(p);
        }
        return data.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    } catch (e) { console.warn(e); }
  }
  const localPurchases = await db.purchases.toArray();
  return localPurchases.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function saveDbProduct(product) {
  await db.products.put(product);
  if (state.dbMode === 'supabase' && typeof supabase !== 'undefined' && supabase) {
    try {
      await supabase.from('pos_products').upsert({
        id: product.id, name: product.name, category: product.category, price: product.price, cost: product.cost, stock: product.stock, image: product.image
      });
    } catch (e) { console.error(e); }
  }
}

async function deleteDbProduct(id) {
  await db.products.delete(id);
  if (state.dbMode === 'supabase' && typeof supabase !== 'undefined' && supabase) {
    try { await supabase.from('pos_products').delete().eq('id', id); } catch (e) { console.error(e); }
  }
}

async function saveDbOrder(order) {
  await db.orders.put(order);
  if (state.dbMode === 'supabase' && typeof supabase !== 'undefined' && supabase) {
    try {
      await supabase.from('pos_orders').upsert({
        id: order.id, date: order.date, channel: order.channel, reference: order.reference, items: typeof order.items === 'object' ? order.items : JSON.parse(order.items), subtotal: order.subtotal, total: order.total, total_cost: order.totalCost, gp_rate: order.gpRate, gp_amount: order.gpAmount, net_revenue: order.netRevenue, profit: order.profit
      });
    } catch (e) { console.error(e); }
  }
}

async function saveDbMaterial(material) {
  await db.materials.put(material);
  if (state.dbMode === 'supabase' && typeof supabase !== 'undefined' && supabase) {
    try { await supabase.from('pos_materials').upsert(material); } catch (e) { console.error(e); }
  }
}

async function saveDbPurchase(purchase) {
  await db.purchases.put(purchase);
  if (state.dbMode === 'supabase' && typeof supabase !== 'undefined' && supabase) {
    try { await supabase.from('pos_purchases').upsert(purchase); } catch (e) { console.error(e); }
  }
}

async function saveDbSettings(key, value) {
  await db.settings.put({ key, value });
  if (state.dbMode === 'supabase' && typeof supabase !== 'undefined' && supabase) {
    try { await supabase.from('pos_settings').upsert({ key: key, value: value }); } catch (e) { console.error(e); }
  }
}
