import { Link, useLocation } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/news', label: t('nav.news') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/resources', label: t('nav.resources') },
    { path: '/community', label: t('nav.community') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-green-700 to-blue-700">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-white text-sm">
          <div className="flex items-center gap-4">
            <span>📞 +251-11-222-5555</span>
            <span>✉️ info@psab.gov.et</span>
          </div>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 hover:bg-white/10 px-3 py-1 rounded transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 via-blue-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">ሰ</span>
            </div>
            <div>
              <h1 className="font-bold text-lg md:text-xl text-gray-800 leading-tight">
                {language === 'en' 
                  ? 'Lemi Kura Subcity Peace and Security Administration Office'
                  : 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ጸጥታ አስተዳደር ጽ/ቤት'
                }
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'en'
                  ? 'Lemi Kura Sub-City - Addis Ababa'
                  : 'ለሚ ኩራ ክፍለ ከተማ - አዲስ አበባ'
                }
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
