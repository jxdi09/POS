-- ==========================================================================
-- SWEETPOS & SIP DATABASE SETUP SQL
-- COPY AND PASTE THIS SQL CODE INTO YOUR SUPABASE SQL EDITOR TO CREATE TABLES
-- ==========================================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS pos_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS pos_products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    cost NUMERIC NOT NULL,
    stock INTEGER NOT NULL,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS pos_orders (
    id TEXT PRIMARY KEY,
    date TIMESTAMPTZ DEFAULT NOW(),
    channel TEXT NOT NULL,
    reference TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    total_cost NUMERIC NOT NULL,
    gp_rate NUMERIC NOT NULL,
    gp_amount NUMERIC NOT NULL,
    net_revenue NUMERIC NOT NULL,
    profit NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Settings Table
CREATE TABLE IF NOT EXISTS pos_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Insert Initial Default Users (username/password)
INSERT INTO pos_users (id, username, password, role)
VALUES 
('u-admin', 'admin', '1234', 'admin'),
('u-staff', 'staff', '1234', 'staff')
ON CONFLICT (username) DO NOTHING;

-- 6. Insert Default Sample Products
INSERT INTO pos_products (id, name, category, price, cost, stock, image)
VALUES
('p1', 'ชานมไต้หวันบับเบิ้ล (Bubble Milk Tea)', 'drinks', 55, 20, 99, ''),
('p2', 'ชาเขียวมัทฉะลาเต้ (Matcha Latte)', 'drinks', 65, 25, 50, ''),
('p3', 'โกโก้เย็นสูตรเข้มข้น (Rich Iced Cocoa)', 'drinks', 60, 22, 80, ''),
('p4', 'ครัวซองต์เนยสดฝรั่งเศส (Butter Croissant)', 'snacks', 75, 35, 20, ''),
('p5', 'บราวนี่ดาร์กช็อกโกแลต (Dark Chocolate Brownie)', 'snacks', 60, 24, 25, ''),
('p6', 'บลูเบอร์รี่ชีสพาย (Blueberry Cheese Pie)', 'snacks', 85, 40, 15, ''),
('p7', 'กาแฟเอสเพรสโซ่เย็น (Iced Espresso)', 'drinks', 55, 18, 100, ''),
('p8', 'คุกกี้เนยสดช็อกชิพ (Chocolate Chip Cookies)', 'snacks', 45, 18, 40, '')
ON CONFLICT (id) DO NOTHING;

-- 7. Disable Row Level Security (RLS) for simple direct access via API
-- (Ideal for private local iPad-only POS systems connected to a personal Supabase project)
ALTER TABLE pos_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE pos_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE pos_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE pos_settings DISABLE ROW LEVEL SECURITY;
