import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="text-9xl font-bold text-green-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {language === 'en' ? 'Page Not Found' : 'ገጹ አልተገኘም'}
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {language === 'en'
            ? "The page you're looking for doesn't exist or has been moved."
            : 'እየፈለጉት ያለው ገጽ የለም ወይም ተዛውሯል።'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            {language === 'en' ? 'Go Home' : 'ወደ መነሻ ይሂዱ'}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {language === 'en' ? 'Go Back' : 'ተመለስ'}
          </button>
        </div>
      </div>
    </div>
  );
}
