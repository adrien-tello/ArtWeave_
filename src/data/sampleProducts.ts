import { Product } from '../lib/api';

export const sampleProducts: Omit<Product, 'id' | 'created_at' | 'seller_id' | 'seller_name' | 'seller_phone' | 'seller_whatsapp' | 'shop_name'>[] = [
  // ── TABLES ────────────────────────────────────────────────
  {
    name: 'Dining Table', name_fr: 'Table à manger',
    description: 'Elegant wooden dining table perfect for family gatherings',
    description_fr: 'Élégante table à manger en bois parfaite pour les repas de famille',
    price: 125000, category: 'tables', in_stock: true, stock_qty: 5,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    name: 'Coffee Table', name_fr: 'Table basse',
    description: 'Modern coffee table with storage compartment',
    description_fr: 'Table basse moderne avec compartiment de rangement',
    price: 65000, category: 'tables', in_stock: true, stock_qty: 8,
    image_url: 'https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=600&q=80',
  },
  {
    name: 'Study Table', name_fr: "Table d'étude",
    description: 'Compact study table with drawers',
    description_fr: "Table d'étude compacte avec tiroirs",
    price: 85000, category: 'tables', in_stock: true, stock_qty: 6,
    image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
  },
  {
    name: 'Round Table', name_fr: 'Table ronde',
    description: 'Beautiful round table for intimate dining',
    description_fr: 'Belle table ronde pour les repas intimes',
    price: 95000, category: 'tables', in_stock: false, stock_qty: 0,
    image_url: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=600&q=80',
  },
  {
    name: 'Console Table', name_fr: 'Console',
    description: 'Elegant console table for hallways',
    description_fr: 'Console élégante pour les couloirs',
    price: 75000, category: 'tables', in_stock: true, stock_qty: 4,
    image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
  },
  {
    name: 'Side Table', name_fr: "Table d'appoint",
    description: 'Small side table perfect for living rooms',
    description_fr: "Petite table d'appoint parfaite pour les salons",
    price: 45000, category: 'tables', in_stock: true, stock_qty: 10,
    image_url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80',
  },
  {
    name: 'Outdoor Table', name_fr: "Table d'extérieur",
    description: 'Weather-resistant outdoor dining table',
    description_fr: "Table à manger d'extérieur résistante aux intempéries",
    price: 110000, category: 'tables', in_stock: true, stock_qty: 3,
    image_url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80',
  },

  // ── CHAIRS ────────────────────────────────────────────────
  {
    name: 'Armchair', name_fr: 'Fauteuil',
    description: 'Comfortable wooden armchair with cushions',
    description_fr: 'Fauteuil en bois confortable avec coussins',
    price: 45000, category: 'chairs', in_stock: true, stock_qty: 12,
    image_url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80',
  },
  {
    name: 'Dining Chair', name_fr: 'Chaise de salle à manger',
    description: 'Classic dining chair with ergonomic design',
    description_fr: 'Chaise de salle à manger classique au design ergonomique',
    price: 35000, category: 'chairs', in_stock: true, stock_qty: 20,
    image_url: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80',
  },
  {
    name: 'Rocking Chair', name_fr: 'Chaise berçante',
    description: 'Traditional rocking chair for relaxation',
    description_fr: 'Chaise berçante traditionnelle pour la détente',
    price: 70000, category: 'chairs', in_stock: true, stock_qty: 5,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    name: 'Bar Stool', name_fr: 'Tabouret de bar',
    description: 'High bar stool for kitchen counters',
    description_fr: 'Tabouret de bar haut pour comptoirs de cuisine',
    price: 40000, category: 'chairs', in_stock: true, stock_qty: 15,
    image_url: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80',
  },
  {
    name: 'Lounge Chair', name_fr: 'Chaise longue',
    description: 'Comfortable lounge chair for reading',
    description_fr: 'Chaise longue confortable pour la lecture',
    price: 80000, category: 'chairs', in_stock: true, stock_qty: 7,
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  },
  {
    name: 'Office Chair', name_fr: 'Chaise de bureau',
    description: 'Ergonomic office chair for long work hours',
    description_fr: 'Chaise de bureau ergonomique pour de longues heures de travail',
    price: 55000, category: 'chairs', in_stock: false, stock_qty: 0,
    image_url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80',
  },

  // ── CABINETS ──────────────────────────────────────────────
  {
    name: 'Kitchen Cabinet', name_fr: 'Armoire de cuisine',
    description: 'Spacious kitchen cabinet with multiple shelves',
    description_fr: 'Armoire de cuisine spacieuse avec plusieurs étagères',
    price: 150000, category: 'cabinets', in_stock: true, stock_qty: 4,
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  },
  {
    name: 'Wardrobe', name_fr: 'Garde-robe',
    description: 'Large wardrobe with hanging space and drawers',
    description_fr: 'Grande garde-robe avec espace de suspension et tiroirs',
    price: 200000, category: 'cabinets', in_stock: false, stock_qty: 0,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    name: 'Display Cabinet', name_fr: 'Vitrine',
    description: 'Glass-front display cabinet for collectibles',
    description_fr: 'Vitrine avec façade en verre pour objets de collection',
    price: 120000, category: 'cabinets', in_stock: true, stock_qty: 3,
    image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80',
  },
  {
    name: 'TV Cabinet', name_fr: 'Meuble TV',
    description: 'Entertainment center with cable management',
    description_fr: 'Centre de divertissement avec gestion des câbles',
    price: 110000, category: 'cabinets', in_stock: true, stock_qty: 6,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    name: 'Filing Cabinet', name_fr: 'Classeur',
    description: 'Office filing cabinet with lock',
    description_fr: 'Classeur de bureau avec serrure',
    price: 90000, category: 'cabinets', in_stock: true, stock_qty: 8,
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  },

  // ── DOORS ─────────────────────────────────────────────────
  {
    name: 'Front Door', name_fr: "Porte d'entrée",
    description: 'Solid wooden front door with decorative panels',
    description_fr: "Porte d'entrée en bois massif avec panneaux décoratifs",
    price: 180000, category: 'doors', in_stock: true, stock_qty: 5,
    image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
  },
  {
    name: 'Interior Door', name_fr: 'Porte intérieure',
    description: 'Classic interior door with glass panels',
    description_fr: 'Porte intérieure classique avec panneaux de verre',
    price: 95000, category: 'doors', in_stock: true, stock_qty: 10,
    image_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80',
  },
  {
    name: 'Sliding Door', name_fr: 'Porte coulissante',
    description: 'Space-saving sliding door system',
    description_fr: "Système de porte coulissante économisant l'espace",
    price: 125000, category: 'doors', in_stock: false, stock_qty: 0,
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  },
  {
    name: 'Security Door', name_fr: 'Porte de sécurité',
    description: 'Reinforced security door with multiple locks',
    description_fr: 'Porte de sécurité renforcée avec plusieurs serrures',
    price: 250000, category: 'doors', in_stock: true, stock_qty: 4,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    name: 'French Door', name_fr: 'Porte-fenêtre',
    description: 'Elegant French doors for patios',
    description_fr: 'Portes-fenêtres élégantes pour patios',
    price: 220000, category: 'doors', in_stock: true, stock_qty: 3,
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
  },

  // ── WINDOWS ───────────────────────────────────────────────
  {
    name: 'Casement Window', name_fr: 'Fenêtre à battants',
    description: 'Traditional casement window with wooden frame',
    description_fr: 'Fenêtre à battants traditionnelle avec cadre en bois',
    price: 85000, category: 'windows', in_stock: true, stock_qty: 8,
    image_url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80',
  },
  {
    name: 'Bay Window', name_fr: 'Fenêtre en saillie',
    description: 'Beautiful bay window with built-in seating',
    description_fr: 'Belle fenêtre en saillie avec siège intégré',
    price: 190000, category: 'windows', in_stock: false, stock_qty: 0,
    image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
  },
  {
    name: 'Skylight Window', name_fr: 'Lucarne',
    description: 'Roof-mounted skylight for natural lighting',
    description_fr: "Lucarne montée sur le toit pour l'éclairage naturel",
    price: 165000, category: 'windows', in_stock: true, stock_qty: 5,
    image_url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=600&q=80',
  },
  {
    name: 'Picture Window', name_fr: 'Fenêtre panoramique',
    description: 'Large picture window for maximum light',
    description_fr: 'Grande fenêtre panoramique pour un maximum de lumière',
    price: 120000, category: 'windows', in_stock: true, stock_qty: 6,
    image_url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&q=80',
  },

  // ── COFFINS ───────────────────────────────────────────────
  {
    name: 'Traditional Coffin', name_fr: 'Cercueil traditionnel',
    description: 'Handcrafted traditional wooden coffin',
    description_fr: 'Cercueil en bois traditionnel fait à la main',
    price: 350000, category: 'coffins', in_stock: true, stock_qty: 3,
    image_url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80',
  },
  {
    name: 'Premium Coffin', name_fr: 'Cercueil premium',
    description: 'Luxury coffin with ornate details',
    description_fr: 'Cercueil de luxe avec détails ornés',
    price: 500000, category: 'coffins', in_stock: true, stock_qty: 2,
    image_url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=600&q=80',
  },
  {
    name: 'Eco Coffin', name_fr: 'Cercueil écologique',
    description: 'Environmentally friendly wooden coffin',
    description_fr: "Cercueil en bois respectueux de l'environnement",
    price: 320000, category: 'coffins', in_stock: true, stock_qty: 4,
    image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
  },

  // ── CUPBOARDS ─────────────────────────────────────────────
  {
    name: 'Kitchen Cupboard', name_fr: 'Placard de cuisine',
    description: 'Wall-mounted kitchen cupboard',
    description_fr: 'Placard de cuisine mural',
    price: 75000, category: 'cupboards', in_stock: true, stock_qty: 7,
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  },
  {
    name: 'Bedroom Cupboard', name_fr: 'Placard de chambre',
    description: 'Built-in bedroom storage cupboard',
    description_fr: 'Placard de rangement de chambre intégré',
    price: 130000, category: 'cupboards', in_stock: true, stock_qty: 5,
    image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80',
  },
  {
    name: 'Pantry Cupboard', name_fr: 'Garde-manger',
    description: 'Large pantry cupboard for food storage',
    description_fr: 'Grand garde-manger pour le stockage des aliments',
    price: 120000, category: 'cupboards', in_stock: false, stock_qty: 0,
    image_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
  },
  {
    name: 'Bathroom Cupboard', name_fr: 'Placard de salle de bain',
    description: 'Moisture-resistant bathroom storage',
    description_fr: "Rangement de salle de bain résistant à l'humidité",
    price: 85000, category: 'cupboards', in_stock: true, stock_qty: 6,
    image_url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
  },

  // ── COUCHES / SOFAS ───────────────────────────────────────
  {
    name: 'Sofa Set', name_fr: 'Ensemble canapé',
    description: 'Three-piece wooden sofa set with cushions',
    description_fr: 'Ensemble de canapés en bois trois pièces avec coussins',
    price: 280000, category: 'couche', in_stock: true, stock_qty: 4,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    name: 'Sectional Sofa', name_fr: 'Canapé sectionnel',
    description: 'Large sectional sofa for spacious living rooms',
    description_fr: 'Grand canapé sectionnel pour salons spacieux',
    price: 420000, category: 'couche', in_stock: false, stock_qty: 0,
    image_url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80',
  },
  {
    name: 'Loveseat', name_fr: 'Causeuse',
    description: 'Cozy two-seater wooden loveseat',
    description_fr: 'Causeuse en bois confortable pour deux personnes',
    price: 150000, category: 'couche', in_stock: true, stock_qty: 6,
    image_url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80',
  },
  {
    name: 'Chesterfield Sofa', name_fr: 'Canapé Chesterfield',
    description: 'Classic Chesterfield style wooden sofa',
    description_fr: 'Canapé en bois de style Chesterfield classique',
    price: 350000, category: 'couche', in_stock: true, stock_qty: 2,
    image_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80',
  },
  {
    name: 'Recliner Sofa', name_fr: 'Canapé inclinable',
    description: 'Comfortable reclining sofa with wooden frame',
    description_fr: 'Canapé inclinable confortable avec cadre en bois',
    price: 220000, category: 'couche', in_stock: true, stock_qty: 3,
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  },

  // ── BEDS ──────────────────────────────────────────────────
  {
    name: 'King Bed Frame', name_fr: 'Cadre de lit king',
    description: 'Solid wood king size bed frame with headboard',
    description_fr: 'Cadre de lit king size en bois massif avec tête de lit',
    price: 320000, category: 'beds', in_stock: true, stock_qty: 4,
    image_url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80',
  },
  {
    name: 'Queen Bed Frame', name_fr: 'Cadre de lit queen',
    description: 'Elegant queen size wooden bed frame',
    description_fr: 'Élégant cadre de lit queen size en bois',
    price: 250000, category: 'beds', in_stock: true, stock_qty: 6,
    image_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80',
  },
  {
    name: 'Bunk Bed', name_fr: 'Lit superposé',
    description: 'Sturdy wooden bunk bed for children',
    description_fr: 'Lit superposé en bois solide pour enfants',
    price: 180000, category: 'beds', in_stock: true, stock_qty: 5,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    name: 'Single Bed', name_fr: 'Lit simple',
    description: 'Classic single bed with storage drawers',
    description_fr: 'Lit simple classique avec tiroirs de rangement',
    price: 140000, category: 'beds', in_stock: false, stock_qty: 0,
    image_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80',
  },
];
