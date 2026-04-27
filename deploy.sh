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
# WARNING: Change 'your_strong_password' to a secure password!
DB_PASSWORD="your_strong_password"
DB_USER="ecommerce_user"
DB_NAME="ecommerce_db"

sudo -u postgres psql <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
EOF

# ── STEP 5: Install PM2 (process manager) ────────────────────
sudo npm install -g pm2

# ── STEP 6: Build and start backend ──────────────────────────
cd /var/www/artweave/backend

# Create .env file (edit with your actual values!)
cat > .env <<EOF
PORT=3001
FRONTEND_URL=http://YOUR_VPS_IP
JWT_SECRET=$(openssl rand -base64 32)
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_admin_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONETBIL_SERVICE_KEY=your_monetbil_key
MONETBIL_SECRET_KEY=your_monetbil_secret
EOF

npm install

# Deploy Prisma migrations (replaces raw SQL!)
npx prisma migrate deploy
npx prisma generate

# Seed the first admin user
npx ts-node src/seed.ts

# Build the backend
npm run build

# Start with PM2
pm2 start dist/index.js --name artweave-api
pm2 save
pm2 startup   # follow the printed command to enable on reboot

# ── STEP 7: Build frontend ────────────────────────────────────
cd /var/www/artweave

# Create frontend .env
cat > .env <<EOF
VITE_API_URL=http://YOUR_VPS_IP/api
EOF

npm install
npm run build
# This creates /var/www/artweave/dist/

# ── STEP 8: Configure Nginx ───────────────────────────────────
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

# ── STEP 9: Firewall ─────────────────────────────────────────
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ Deployment complete!"
echo "Frontend: http://YOUR_VPS_IP"
echo "API:      http://YOUR_VPS_IP/api/health"
echo ""
echo "⚠️  IMPORTANT: Edit /var/www/artweave/backend/.env and set your actual:"
echo "   - JWT_SECRET (already auto-generated)"
echo "   - CLOUDINARY credentials"
echo "   - MONETBIL credentials"
echo "   - ADMIN_PASSWORD"
echo ""
echo "📋 Next steps:"
echo "   1. Update YOUR_VPS_IP in Nginx config and .env files"
echo "   2. Restart backend: pm2 restart artweave-api"
echo "   3. View logs: pm2 logs artweave-api"

