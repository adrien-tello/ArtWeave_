import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Hammer, Award, Users, Star } from 'lucide-react';
import { Logo } from '../components/Logo';

export function Landing() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  const features = [
    {
      icon: <Hammer className="h-8 w-8" />,
      title: i18n.language === 'fr' ? 'Artisanat Traditionnel' : 'Traditional Craftsmanship',
      description: i18n.language === 'fr'
        ? 'Chaque pièce est fabriquée à la main par des artisans expérimentés'
        : 'Every piece is handcrafted by experienced artisans'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: i18n.language === 'fr' ? 'Qualité Premium' : 'Premium Quality',
      description: i18n.language === 'fr'
        ? 'Matériaux de haute qualité pour une durabilité exceptionnelle'
        : 'High-quality materials for exceptional durability'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: i18n.language === 'fr' ? 'Service Personnalisé' : 'Personalized Service',
      description: i18n.language === 'fr'
        ? 'Solutions sur mesure adaptées à vos besoins spécifiques'
        : 'Custom solutions tailored to your specific needs'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      text: i18n.language === 'fr'
        ? 'Excellent travail ! Ma table sur mesure est parfaite.'
        : 'Excellent work! My custom table is perfect.',
      rating: 5
    },
    {
      name: 'Jean Kamga',
      text: i18n.language === 'fr'
        ? 'Qualité exceptionnelle et service client remarquable.'
        : 'Exceptional quality and remarkable customer service.',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      text: i18n.language === 'fr'
        ? 'Des meubles magnifiques qui transforment ma maison.'
        : 'Beautiful furniture that transforms my home.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/20">
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo className="h-12 w-12" />
              <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">
                ArtWeave
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {i18n.language.toUpperCase()}
              </button>

              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {i18n.language === 'fr' ? 'Se connecter' : 'Login'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              <span className="block">
                {i18n.language === 'fr' ? 'Artisanat' : 'Handcrafted'}
              </span>
              <span className="block bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 dark:from-amber-400 dark:via-amber-500 dark:to-amber-600 bg-clip-text text-transparent">
                Excellence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              {i18n.language === 'fr'
                ? 'Découvrez notre collection de meubles en bois faits à la main, où tradition et design moderne se rencontrent pour créer des pièces exceptionnelles.'
                : 'Discover our collection of handcrafted wooden furniture, where tradition meets modern design to create exceptional pieces.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/login"
                className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>{i18n.language === 'fr' ? 'Commencer' : 'Get Started'}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                to="/about"
                className="px-8 py-4 border-2 border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-semibold rounded-xl transition-all duration-300 hover:shadow-md"
              >
                {i18n.language === 'fr' ? 'En savoir plus' : 'Learn More'}
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200 dark:bg-amber-800 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-amber-300 dark:bg-amber-700 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {i18n.language === 'fr' ? 'Pourquoi Choisir ArtWeave?' : 'Why Choose ArtWeave?'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {i18n.language === 'fr'
                ? 'Nous nous engageons à fournir des meubles de la plus haute qualité'
                : 'We are committed to providing furniture of the highest quality'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 dark:text-amber-400 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">
                {i18n.language === 'fr' ? 'Clients Satisfaits' : 'Happy Customers'}
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 dark:text-amber-400 mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-400">
                {i18n.language === 'fr' ? 'Produits Créés' : 'Products Created'}
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 dark:text-amber-400 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-400">
                {i18n.language === 'fr' ? "Années d'Expérience" : 'Years Experience'}
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 dark:text-amber-400 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-400">
                {i18n.language === 'fr' ? 'Fait Main' : 'Handmade'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {i18n.language === 'fr' ? 'Ce Que Disent Nos Clients' : 'What Our Customers Say'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {i18n.language === 'fr'
              ? 'Prêt à Découvrir Notre Collection?'
              : 'Ready to Explore Our Collection?'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {i18n.language === 'fr'
              ? 'Connectez-vous pour accéder à notre catalogue complet de meubles artisanaux'
              : 'Login to access our complete catalog of handcrafted furniture'}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2"
          >
            <span>{i18n.language === 'fr' ? 'Accéder au Catalogue' : 'Access Catalog'}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold text-amber-400">ArtWeave</span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                {i18n.language === 'fr'
                  ? 'Artisanat de qualité depuis 2008'
                  : 'Quality craftsmanship since 2008'}
              </p>
              <p className="text-sm text-gray-500">
                © 2024 ArtWeave. {i18n.language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
