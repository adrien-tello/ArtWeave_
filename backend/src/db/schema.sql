-- ============================================================
-- ArtWeave Multi-Vendor Marketplace Schema
-- Run: psql -U ecommerce_user -d ecommerce_db -f schema.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Buyers / regular users
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  phone       VARCHAR(30),
  password_hash TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Sellers (vendors)
CREATE TABLE IF NOT EXISTS sellers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  phone        VARCHAR(30) NOT NULL,
  whatsapp     VARCHAR(30),
  shop_name    VARCHAR(255) NOT NULL,
  shop_desc    TEXT,
  password_hash TEXT NOT NULL,
  is_approved  BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Platform admin
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Products posted by sellers
CREATE TABLE IF NOT EXISTS products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id      UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  name           VARCHAR(255) NOT NULL,
  name_fr        VARCHAR(255) NOT NULL,
  description    TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  price          NUMERIC(12,2) NOT NULL,
  category       VARCHAR(100) NOT NULL,
  image_url      TEXT NOT NULL,
  in_stock       BOOLEAN DEFAULT true,
  stock_qty      INT DEFAULT 1,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Cart (persistent per user)
CREATE TABLE IF NOT EXISTS cart_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  seller_id       UUID REFERENCES sellers(id) ON DELETE SET NULL,
  total_amount    NUMERIC(12,2) NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  payment_status  VARCHAR(20) DEFAULT 'unpaid'
                    CHECK (payment_status IN ('unpaid','paid','failed','refunded')),
  payment_method  VARCHAR(30),
  delivery_address TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Order line items
CREATE TABLE IF NOT EXISTS order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity   INT NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL
);

-- Payments (Monetbil callbacks)
CREATE TABLE IF NOT EXISTS payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  monetbil_ref    VARCHAR(255) UNIQUE,
  amount          NUMERIC(12,2) NOT NULL,
  phone           VARCHAR(30) NOT NULL,
  operator        VARCHAR(30),
  status          VARCHAR(20) DEFAULT 'pending'
                    CHECK (status IN ('pending','success','failed')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_seller    ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category);
CREATE INDEX IF NOT EXISTS idx_cart_user          ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user        ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller      ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order     ON payments(order_id);
