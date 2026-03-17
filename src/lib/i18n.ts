import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      "home": "Home",
      "about": "About",
      "all": "All",
      "tables": "Tables",
      "chairs": "Chairs",  
      "cabinets": "Cabinets",
      "doors": "Doors",
      "windows": "Windows",
      "coffins": "Coffins",
      "cupboards": "Cupboards",
      "couche": "Couches",
      "beds": "Beds",
      
      // UI Elements
      "searchProducts": "Search products...",
      "inStock": "In Stock",
      "outOfStock": "Out of Stock",
      "addToWishlist": "Add to Wishlist",
      "removeFromWishlist": "Remove from Wishlist",
      "viewDetails": "View Details",
      "wishlist": "Wishlist",
      "darkMode": "Dark Mode",
      "lightMode": "Light Mode",
      
      // Product Details
      "price": "Price",
      "availability": "Availability",
      "description": "Description",
      "contactSeller": "Contact Seller",
      "placeOrder": "Place Order",
      "email": "Email",
      "phone": "Phone",
      "whatsapp": "WhatsApp",
      
      // Order Form
      "orderProduct": "Order Product",
      "fullName": "Full Name",
      "emailAddress": "Email Address",
      "phoneNumber": "Phone Number",
      "message": "Message",
      "submitOrder": "Submit Order",
      "orderSubmitted": "Order submitted successfully!",
      
      // About Page
      "aboutTitle": "About ArtWeave",
      "aboutDescription": "ArtWeave is a premier wood workshop specializing in handcrafted furniture and wooden products. With years of experience in woodworking, we create beautiful, durable pieces that combine traditional craftsmanship with modern design.",
      "ourStory": "Our Story",
      "ourStoryText": "Founded with a passion for woodworking, ArtWeave has been serving customers with high-quality wooden furniture and custom pieces. Every product is carefully crafted by skilled artisans who take pride in their work.",
      
      // Admin
      "adminLogin": "Admin Login",
      "username": "Username",
      "password": "Password",
      "login": "Login",
      "logout": "Logout",
      "productManagement": "Product Management",
      "orderManagement": "Order Management",
      "addNewProduct": "Add New Product",
      "editProduct": "Edit Product",
      "deleteProduct": "Delete Product",
      "productName": "Product Name",
      "category": "Category",
      "status": "Status",
      "actions": "Actions",
      "orders": "Orders",
      "customer": "Customer",
      "pending": "Pending",
      "accepted": "Accepted",
      "rejected": "Rejected",
      "quickOrder": "Quick Order",
      "cancel": "Cancel",
    }
  },
  fr: {
    translation: {
      // Navigation
      "home": "Accueil",
      "about": "À propos",
      "all": "Tous",
      "tables": "Tables",
      "chairs": "Chaises",
      "cabinets": "Armoires",
      "doors": "Portes",
      "windows": "Fenêtres",
      "coffins": "Cercueils",
      "cupboards": "Placards",
      "couche": "Canapés",
      "Beds": "Lits",
      
      // UI Elements
      "searchProducts": "Rechercher des produits...",
      "inStock": "En stock",
      "outOfStock": "Rupture de stock",
      "addToWishlist": "Ajouter à la liste de souhaits",
      "removeFromWishlist": "Retirer de la liste de souhaits",
      "viewDetails": "Voir les détails",
      "wishlist": "Liste de souhaits",
      "darkMode": "Mode sombre",
      "lightMode": "Mode clair",
      
      // Product Details
      "price": "Prix",
      "availability": "Disponibilité",
      "description": "Description",
      "contactSeller": "Contacter le vendeur",
      "placeOrder": "Passer commande",
      "email": "Email",
      "phone": "Téléphone",
      "whatsapp": "WhatsApp",
      
      // Order Form
      "orderProduct": "Commander le produit",
      "fullName": "Nom complet",
      "emailAddress": "Adresse email",
      "phoneNumber": "Numéro de téléphone",
      "message": "Message",
      "submitOrder": "Soumettre la commande",
      "orderSubmitted": "Commande soumise avec succès !",
      
      // About Page
      "aboutTitle": "À propos de ArtWeave",
      "aboutDescription": "ArtWeave est un atelier de menuiserie de premier plan spécialisé dans les meubles artisanaux et les produits en bois. Avec des années d'expérience en menuiserie, nous créons de belles pièces durables qui allient l'artisanat traditionnel au design moderne.",
      "ourStory": "Notre histoire",
      "ourStoryText": "Fondé avec une passion pour la menuiserie, ArtWeave sert les clients avec des meubles en bois de haute qualité et des pièces personnalisées. Chaque produit est soigneusement fabriqué par des artisans qualifiés qui sont fiers de leur travail.",
      
      // Admin
      "adminLogin": "Connexion Admin",
      "username": "Nom d'utilisateur",
      "password": "Mot de passe",
      "login": "Se connecter",
      "logout": "Se déconnecter",
      "productManagement": "Gestion des produits",
      "orderManagement": "Gestion des commandes",
      "addNewProduct": "Ajouter un nouveau produit",
      "editProduct": "Modifier le produit",
      "deleteProduct": "Supprimer le produit",
      "productName": "Nom du produit",
      "category": "Catégorie",
      "status": "Statut",
      "actions": "Actions",
      "orders": "Commandes",
      "customer": "Client",
      "pending": "En attente",
      "accepted": "Accepté",
      "rejected": "Rejeté",
      "quickOrder": "Commande rapide",
      "cancel": "Annuler",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;