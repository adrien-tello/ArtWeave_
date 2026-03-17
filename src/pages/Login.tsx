import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, User, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Logo } from '../components/Logo';

export function Login() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (formData.username && formData.password) {
      if (formData.username === 'admin' && formData.password === 'admin123') {
        toast.success(i18n.language === 'fr' ? 'Connexion réussie!' : 'Login successful!');
        navigate('/admin');
      } else if (formData.username === 'user' && formData.password === 'user123') {
        toast.success(i18n.language === 'fr' ? 'Bienvenue!' : 'Welcome!');
        navigate('/home');
      } else {
        toast.error(i18n.language === 'fr' ? 'Identifiants incorrects' : 'Invalid credentials');
      }
    } else {
      toast.error(i18n.language === 'fr' ? 'Veuillez remplir tous les champs' : 'Please fill in all fields');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/20 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200 dark:bg-amber-800 rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-amber-300 dark:bg-amber-700 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300" />
            <span className="text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
              {i18n.language === 'fr' ? "Retour à l'accueil" : 'Back to home'}
            </span>
          </Link>

          <div className="flex items-center justify-center space-x-3 mb-6">
            <Logo className="h-12 w-12" />
            <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">
              ArtWeave
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {i18n.language === 'fr' ? 'Bienvenue' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {i18n.language === 'fr'
              ? 'Connectez-vous pour accéder à votre compte'
              : 'Sign in to access your account'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {i18n.language === 'fr' ? "Nom d'utilisateur" : 'Username'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder={i18n.language === 'fr' ? "Entrez votre nom d'utilisateur" : 'Enter your username'}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {i18n.language === 'fr' ? 'Mot de passe' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder={i18n.language === 'fr' ? 'Entrez votre mot de passe' : 'Enter your password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={toggleLanguage}
                className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-300"
              >
                {i18n.language === 'fr' ? 'English' : 'Français'}
              </button>

              <Link
                to="/"
                className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-300"
              >
                {i18n.language === 'fr' ? 'Mot de passe oublié?' : 'Forgot password?'}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>{i18n.language === 'fr' ? 'Connexion...' : 'Signing in...'}</span>
                </>
              ) : (
                <span>{i18n.language === 'fr' ? 'Se connecter' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              {i18n.language === 'fr' ? 'Comptes de démonstration:' : 'Demo Accounts:'}
            </h3>
            <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
              <div><strong>Admin:</strong> admin / admin123</div>
              <div><strong>User:</strong> user / user123</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {i18n.language === 'fr' ? 'Pas encore de compte? ' : "Don't have an account? "}
            <Link
              to="/"
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors duration-300"
            >
              {i18n.language === 'fr' ? 'Contactez-nous' : 'Contact us'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
