#!/bin/bash
# =============================================================
# ArtWeave VPS Deployment Script — Ubuntu
# Run this on your VPS after uploading the project
# =============================================================

# ── STEP 1: System update & install dependencies ─────────────
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw

# ── STEP 2: Install Node.js 20 ───────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # should print v20.x.x

# ── STEP 3: Install PostgreSQL ────────────────────────────────
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# ── STEP 4: Create DB and user ────────────────────────────────
sudo -u postgres psql <<EOF
CREATE DATABASE ecommerce_db;
CREATE USER ecommerce_user WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;
\c ecommerce_db
GRANT ALL ON SCHEMA public TO ecommerce_user;
EOF

# ── STEP 5: Run schema ────────────────────────────────────────
psql -U ecommerce_user -d ecommerce_db -h localhost -f /var/www/artweave/backend/src/db/schema.sql

# ── STEP 6: Install PM2 (process manager) ────────────────────
sudo npm install -g pm2

# ── STEP 7: Build and start backend ──────────────────────────
cd /var/www/artweave/backend
npm install
npm run build

# Seed the first admin user
node dist/seed.js

# Start with PM2
pm2 start dist/index.js --name artweave-api
pm2 save
pm2 startup   # follow the printed command to enable on reboot

# ── STEP 8: Build frontend ────────────────────────────────────
cd /var/www/artweave
# Edit .env first: set VITE_API_URL=http://YOUR_VPS_IP/api
npm install
npm run build
# This creates /var/www/artweave/dist/

# ── STEP 9: Configure Nginx ───────────────────────────────────
sudo tee /etc/nginx/sites-available/artweave > /dev/null <<'NGINX'
server {
    listen 80;
    server_name YOUR_VPS_IP;   # replace with your IP or domain

    # Serve React frontend
    root /var/www/artweave/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/artweave /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# ── STEP 10: Firewall ─────────────────────────────────────────
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

echo "✅ Deployment complete!"
echo "Frontend: http://YOUR_VPS_IP"
echo "API:      http://YOUR_VPS_IP/api/health"
